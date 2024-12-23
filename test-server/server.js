require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

// API Endpoints

// 1. Fetch all cities
app.get("/api/cities", (req, res) => {
  const query = "SELECT CityID AS id, CityName AS name, image_path AS image FROM city"; // Updated table and column names
  db.query(query, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
  });
});


// 2. Fetch city by ID
app.get("/api/cities/:cityId", (req, res) => {
  const { cityId } = req.params;
  const query = "SELECT CityID AS id, CityName AS name, image_path AS image FROM city WHERE CityID = ?";
  db.query(query, [cityId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "City not found" });
    res.json(result[0]); // Return single city object
  });
});


// 1. Fetch all Banks
app.get("/api/allbanks", (req, res) => {
  const query = "SELECT BankID AS id, BankName AS name, BankShortCode AS bank_short_code, image_path AS image FROM bank"; // Updated table and column names
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// 2. Fetch banks for a specific city
app.get("/api/banks/:cityId", (req, res) => {
  const { cityId } = req.params;
  const query = `
    SELECT b.BankID AS id, b.BankName AS name, b.image_path AS image 
    FROM bank b
    JOIN citybanklink cbl ON b.BankID = cbl.BankID
    WHERE cbl.CityID = ?
  `;
  db.query(query, [cityId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Fetch merchants and their associated data for a specific city
app.get("/api/merchants/:cityId", (req, res) => {
  const { cityId } = req.params;

  // Query to fetch merchants associated with the city
  const query = `
    SELECT
      m.MerchantID AS merchant_id,
      m.MerchantName AS merchant_name,
      m.Category AS merchant_category,
      m.ImagePath AS merchant_image
    FROM merchant m
    JOIN merchantcitylink mcl ON m.MerchantID = mcl.MerchantID
    WHERE mcl.CityID = ?
  `;

  db.query(query, [cityId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching merchants from the database." });
    }

    // Format the response
    if (results.length > 0) {
      const merchants = results.map(row => ({
        id: row.merchant_id,
        name: row.merchant_name,
        category: row.merchant_category,
        image: row.merchant_image,
      }));

      res.json({ merchants });
    } else {
      res.json({ merchants: [] });
    }
  });
});


// Fetch merchant by merchant id
app.get("/api/merchant/:merchantId", (req, res) => {
  const { merchantId } = req.params;
  const query = `
    SELECT 
      m.MerchantID AS id, 
      m.MerchantName AS name, 
      m.ImagePath AS image_path, 
      GROUP_CONCAT(c.CategoryName) AS categories
    FROM merchant m
    LEFT JOIN merchantcategorylink mcl ON m.MerchantID = mcl.MerchantID
    LEFT JOIN category c ON mcl.CategoryID = c.CategoryID
    WHERE m.MerchantID = ?
    GROUP BY m.MerchantID
  `;

  db.query(query, [merchantId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      const merchantData = {
        id: result[0].id,
        name: result[0].name,
        image_path: result[0].image_path,
        categories: result[0].categories ? result[0].categories.split(",") : []
      };

      res.json(merchantData);
    } else {
      res.status(404).json({ message: "Merchant not found" });
    }
  });
});



// Fetch Cards for a Merchant in a City and Bank
app.get("/api/cards/:merchantId/:bankId/:cityId", (req, res) => {
  const { merchantId, bankId, cityId } = req.params;
  
  const query = `
    SELECT 
      c.CardID AS id, 
      c.CardName AS card_name, 
      c.CardType AS card_type, 
      c.ImagePath AS image_path, 
      b.BankName AS bank_name
    FROM card c
    JOIN bank b ON c.BankID = b.BankID
    LEFT JOIN bankmerchantdiscount bmd ON b.BankID = bmd.BankID
    LEFT JOIN merchant m ON bmd.MerchantID = m.MerchantID
    LEFT JOIN merchantcitylink mcl ON m.MerchantID = mcl.MerchantID
    WHERE mcl.CityID = ? AND c.MerchantID = ? AND c.BankID = ?
  `;

  db.query(query, [cityId, merchantId, bankId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.get("/api/branches/:merchantId/:cityId", (req, res) => {
  const { merchantId, cityId } = req.params;
  const query = `
    SELECT 
      mb.BranchID AS id, 
      mb.BranchName AS name, 
      mb.Address AS address, 
      mb.image_path AS image_path
    FROM merchantbranch mb WHERE MerchantID = ? AND cityID = ?
  `;

  db.query(query, [merchantId, cityId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});




// Fetch branch count for a Merchant in a City
app.get("/api/branch-count/:merchantId/:cityId", (req, res) => {
  const { merchantId, cityId } = req.params;

  const query = `
    SELECT 
      COUNT(*) AS branch_count
    FROM merchantbranch mb WHERE MerchantID = ? AND cityID = ?
  `;

  db.query(query, [merchantId, cityId], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching branch count." });
    res.json({ branch_count: results[0].branch_count });
  });
});



// Fetch Discounts for a Merchant in a City and Bank with Branch and Card Details
app.get("/api/discounts/:merchantId/:bankId/:cityId", (req, res) => {
  const { merchantId, bankId, cityId } = req.params;

  const query = `
    SELECT 
        d.DiscountID AS id,
        d.DiscountAmount AS discount_amount,
        d.DiscountType AS discount_type,
        d.StartDate AS start_date,
        d.EndDate AS end_date,
        GROUP_CONCAT(DISTINCT CONCAT(c.CardName, ':', c.image_path) SEPARATOR '|') AS cards,
        b.BankName AS bank_name,
        b.image_path AS bank_image,
        GROUP_CONCAT(
          DISTINCT CONCAT(
            mb.BranchID, ':', mb.BranchName, ':', mb.Address
          ) SEPARATOR '|'
        ) AS branches
    FROM bankmerchantdiscount d
    LEFT JOIN carddiscount cd ON d.DiscountID = cd.DiscountID
    LEFT JOIN card c ON cd.CardID = c.CardID
    LEFT JOIN bank b ON d.BankID = b.BankID
    LEFT JOIN merchantbranch mb ON d.BranchID = mb.BranchID
    LEFT JOIN citybanklink cb ON b.BankID = cb.BankID AND cb.CityID = ?
    WHERE mb.MerchantID = ? AND d.BankID = ? AND mb.CityID = ?
    GROUP BY d.DiscountID
  `;

  db.query(query, [cityId, merchantId, bankId, cityId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching discounts from the database." });
    }

    // Format the response to include structured branch and card details
    const formattedResults = results.map(row => ({
      id: row.id,
      discount_amount: row.discount_amount,
      discount_type: row.discount_type,
      start_date: row.start_date,
      end_date: row.end_date,
      cards: row.cards
        ? row.cards.split('|').map(card => {
            const [cardName, cardImage] = card.split(':');
            return { cardName, cardImage };
          })
        : [],
      bank_name: row.bank_name,
      bank_image: row.bank_image,
      branches: row.branches
        ? row.branches.split('|').map(branch => {
            const [branchId, branchName, address] = branch.split(':');
            return { branchId, branchName, address };
          })
        : [],
    }));

    res.json(formattedResults);
  });
});






app.get("/api/maximum-discount/:merchantId/:bankId/:cityId", (req, res) => {
  const { merchantId, bankId, cityId } = req.params;

  const query = `
    SELECT 
      MAX(bmd.DiscountAmount) AS max_discount,
      COUNT(DISTINCT cd.CardID) AS total_card_count
    FROM bankmerchantdiscount bmd
    INNER JOIN merchantbranch mb ON bmd.BranchID = mb.BranchID
    LEFT JOIN carddiscount cd ON bmd.DiscountID = cd.DiscountID
    WHERE bmd.BankID = ? 
      AND mb.MerchantID = ? 
      AND mb.CityID = ?
  `;

  db.query(query, [bankId, merchantId, cityId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      max_discount: results[0]?.max_discount || 0,
      total_card_count: results[0]?.total_card_count || 0,
    });
  });
});

app.get("/api/maximum-discount-any-bank/:merchantId/:cityId", (req, res) => {
  const { merchantId, cityId } = req.params;

  const query = `
    SELECT 
      MAX(bmd.DiscountAmount) AS max_discount,
      COUNT(DISTINCT cd.CardID) AS total_card_count
    FROM bankmerchantdiscount bmd
    INNER JOIN merchantbranch mb ON bmd.BranchID = mb.BranchID
    LEFT JOIN carddiscount cd ON bmd.DiscountID = cd.DiscountID
    WHERE mb.MerchantID = ? 
      AND mb.CityID = ?
  `;

  db.query(query, [merchantId, cityId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      max_discount: results[0]?.max_discount || 0,
      total_card_count: results[0]?.total_card_count || 0,
    });
  });
});




app.get("/api/discounts/:discountId/details", (req, res) => {
  const { discountId } = req.params;

  // Query to fetch discount details
  const discountQuery = `
    SELECT d.id, d.title, d.description, d.percentage, d.expiration_date, d.image_path 
    FROM discounts d
    WHERE d.id = ?;
  `;

  // Query to fetch associated cards for the discount
  const cardsQuery = `
    SELECT c.id, c.card_name, c.card_type, c.image_path, b.name AS bank_name 
    FROM cards c 
    JOIN carddiscount cd ON c.id = cd.card_id
    JOIN banks b ON c.bank_id = b.id
    WHERE cd.discount_id = ?;
  `;

  // Query to fetch associated branches for the discount
  const branchesQuery = `
    SELECT b.id, b.name, b.address, b.image_path 
    FROM branches b
    JOIN bankmerchantdiscount bmd ON b.id = bmd.branch_id
    WHERE bmd.discount_id = ?;
  `;

  const queries = [discountQuery, cardsQuery, branchesQuery];

  // Run all queries in parallel using Promise.all
  Promise.all(
    queries.map((query) =>
      new Promise((resolve, reject) =>
        db.query(query, [discountId], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        })
      )
    )
  )
    .then(([discount, cards, branches]) => {
      res.json({ ...discount[0], cards, branches });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});







app.get("/api/branch-discounts/:merchantId/:bankId/:cityId/:branchId", (req, res) => {
  const { merchantId, bankId, cityId, branchId } = req.params;

  // Query to fetch discounts for a specific branch
  const query = `
    SELECT 
    bmd.DiscountAmount AS percentage,
    bmd.DiscountType AS discount_title,
    c.image_path AS cardimage,
    c.CardName AS cardname,
    bk.BankName AS bankname,
    bk.image_path AS bankimage,
    mb.BranchName AS branchname,
    mb.Address AS branchaddress,
    mb.image_path AS branchimage
FROM 
    bankmerchantdiscount bmd
JOIN 
    carddiscount cd ON bmd.DiscountID = cd.DiscountID
JOIN 
    card c ON cd.CardID = c.CardID
JOIN 
    bank bk ON bmd.BankID = bk.BankID
JOIN 
    merchantbranch mb ON bmd.BranchID = mb.BranchID
JOIN 
    merchantcitylink mcl ON mb.MerchantID = mcl.MerchantID AND mcl.CityID = mb.CityID
WHERE 
    bmd.MerchantID = ? 
    AND bmd.BankID = ? 
    AND mb.CityID = ? 
    AND bmd.BranchID = ?;

  `;

  db.query(query, [merchantId, bankId, cityId, branchId], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching discounts from the database." });
    res.json(results);
  });
});





app.get("/api/merchants-search/:cityId/:keyword", (req, res) => {
  const { cityId, keyword } = req.params;

  const query = `
    SELECT DISTINCT 
      m.MerchantName AS merchant_name,
      m.MerchantID AS merchant_id,
      b.BranchName AS branch_name,
      b.BranchID AS branch_id,
      b.Address AS branch_address
    FROM merchant m
    INNER JOIN merchantbranch b ON m.MerchantID = b.MerchantID
    WHERE b.CityID = ? 
    AND (
      CONCAT(m.MerchantName, ' ', b.Address) LIKE ? 
      OR m.MerchantName LIKE ? 
      OR b.Address LIKE ?
    )
  `;

  const searchKeyword = `%${keyword}%`;

  db.query(query, [cityId, searchKeyword, searchKeyword, searchKeyword], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching merchants." });
    }
    res.json(results);
  });
});






app.get("/api/branch-details/:cityId/:merchantId", (req, res) => {
  const { cityId, merchantId } = req.params;

  // Query to fetch distinct banks offering discounts for a specific merchant in a city
  const query = `
    SELECT DISTINCT
      b.BankID AS bank_id,
      b.BankName AS bank_name,
      b.image_path AS bank_image
    FROM bank b
    JOIN bankmerchantdiscount bmd ON b.BankID = bmd.BankID
    JOIN merchantbranch mb ON mb.BranchID = bmd.BranchID
    JOIN merchantcitylink mcl ON mcl.MerchantID = mb.MerchantID
    WHERE mcl.MerchantID = ? AND mb.CityID = ?
  `;

  db.query(query, [merchantId, cityId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching data from the database" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No banks offering discounts found for this merchant in the specified city." });
    }

    res.json(results); // Return distinct banks with discounts for the merchant in the city
  });
});







// User Authentication Routes
app.post("/api/signup", async (req, res) => {
  const { name, email, password, confirm_password, city, bank_card } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password || !confirm_password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Ensure passwords match
  if (password !== confirm_password) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    // Check if the user already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error." });

      if (results.length > 0) {
        return res.status(400).json({ error: "User already exists." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const query = `
        INSERT INTO users (name, email, password, confirm_password, city, user_card) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(query, [name, email, hashedPassword, confirm_password, city, bank_card], (err) => {
        if (err) return res.status(500).json({ error: "Database error during signup." });

        // Generate JWT token after successful signup
        const secretKey = process.env.JWT_SECRET || "default_secret_key";
        const token = jwt.sign({ email, name }, secretKey, { expiresIn: "7d" });

        // Respond with success message and the JWT token
        res.status(201).json({ message: "Signup successful!", token, name });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});


app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const secretKey = process.env.JWT_SECRET || "default_secret_key";

  try {
    // Find the user by email
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error during login." });
      
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const user = results[0];

      // Compare the provided password with the stored hashed password
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Generate JWT token after successful login
      const token = jwt.sign(
        { id: user.ID, name: user.name, email: user.email },
        secretKey,
        { expiresIn: "1h" }
      );

      // Respond with the token and the user's name
      res.json({ token, name: user.name });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});







// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));