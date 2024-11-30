const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "rabaat", // Replace with your database name
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

// API Endpoints

// 1. Fetch all cities
app.get("/api/cities", (req, res) => {
    const query = "SELECT id, name, image_path AS image FROM cities"; // Removed description
    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 1. Fetch city by ID
app.get("/api/cities/:cityId", (req, res) => {
  const { cityId } = req.params;
  const query = "SELECT id, name, image_path FROM cities WHERE id = ?";
  db.query(query, [cityId], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]); // Return single city object
  });
});

// 1. Fetch all Banks
app.get("/api/allbanks", (req, res) => {
  const query = "SELECT id, name,bank_short_code, image_path AS image FROM banks"; // Removed description
  db.query(query, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
  });
});

// 2. Fetch banks for a specific city
app.get("/api/banks/:cityId", (req, res) => {
    const { cityId } = req.params;
    const query = "SELECT id, name, image_path FROM banks WHERE city_id = ?";
    db.query(query, [cityId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 3. Fetch merchants and bank for a specific bank and city
app.get("/api/merchants/:bankId/:cityId", (req, res) => {
  const { bankId, cityId } = req.params;

  // Query to fetch bank data and associated merchants
  const query = `
    SELECT 
      b.id AS bank_id, 
      b.name AS bank_name, 
      b.image_path AS bank_image, 
      m.id AS merchant_id, 
      m.name AS merchant_name, 
      m.category AS merchant_category, 
      m.image_path AS merchant_image 
    FROM merchants m
    JOIN banks b ON m.bank_id = b.id
    WHERE m.bank_id = ? AND m.city_id = ?
  `;

  db.query(query, [bankId, cityId], (err, results) => {
      if (err) return res.status(500).json(err);

      // Format the response to include bank data and merchants
      if (results.length > 0) {
          const bankData = {
              id: results[0].bank_id,
              name: results[0].bank_name,
              image: results[0].bank_image,
          };

          const merchants = results.map(row => ({
              id: row.merchant_id,
              name: row.merchant_name,
              category: row.merchant_category,
              image: row.merchant_image,
          }));

          res.json({ bank: bankData, merchants });
      } else {
          res.json({ bank: null, merchants: [] });
      }
  });
});

// Fetch merchant by merchant id
app.get("/api/merchant/:merchantId", (req, res) => {
  const { merchantId } = req.params;
  const query = "SELECT id, name, image_path FROM merchants WHERE id = ?";
  db.query(query, [merchantId], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]); // Return single city object
  });
});


// Fetch Cards for a Merchant in a City and Bank
app.get("/api/cards/:merchantId/:bankId/:cityId", (req, res) => {
    const { merchantId, bankId, cityId } = req.params;
    const query = `
      SELECT c.id, c.card_name, c.card_type, c.image_path, b.name AS bank_name
      FROM cards c
      JOIN banks b ON c.bank_id = b.id
      WHERE c.merchant_id = ? AND c.bank_id = ?`;
    db.query(query, [merchantId, bankId], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
});

// Fetch Branches for a Merchant in a City
app.get("/api/branches/:merchantId/:cityId", (req, res) => {
    const { merchantId, cityId } = req.params;
    const query = `
      SELECT b.id, b.name, b.address, b.image_path
      FROM branches b
      WHERE b.merchant_id = ? AND b.city_id = ?`;
    db.query(query, [merchantId, cityId], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
});

// Fetch Discounts for a Merchant in a City and Bank
app.get("/api/discounts/:merchantId/:bankId/:cityId", (req, res) => {
  const { merchantId, bankId, cityId } = req.params;
  const query = `
      SELECT 
          d.id, 
          d.percentage, 
          d.title, 
          d.image_path, 
          GROUP_CONCAT(c.card_name SEPARATOR ', ') AS card_names 
      FROM discounts d
      LEFT JOIN cards c ON d.card_id = c.id
      WHERE d.merchant_id = ? AND d.bank_id = ? AND d.city_id = ?
      GROUP BY d.id`;
  db.query(query, [merchantId, bankId, cityId], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
  });
});

app.get("/api/discounts/:discountId/details", (req, res) => {
  const { discountId } = req.params;

  const discountQuery = `
    SELECT d.id, d.title, d.description, d.percentage, d.expiration_date, d.image_path 
    FROM discounts d
    WHERE d.id = ?;
  `;

  const cardsQuery = `
    SELECT c.id, c.card_name, c.card_type, c.image_path, b.name AS bank_name 
    FROM cards c 
    JOIN banks b ON c.bank_id = b.id 
    WHERE c.id IN (SELECT card_id FROM discounts WHERE id = ?);
  `;

  const branchesQuery = `
    SELECT b.id, b.name, b.address, b.image_path 
    FROM branches b 
    WHERE b.id IN (SELECT branch_id FROM discounts WHERE id = ?);
  `;

  const queries = [discountQuery, cardsQuery, branchesQuery];

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


// Fetch Discounts for a specific Branch in a Merchant, City, and Bank
app.get("/api/branch-discounts/:merchantId/:bankId/:cityId/:branchId", (req, res) => {
  const { merchantId, bankId, cityId, branchId } = req.params;
  const query = `
    SELECT 
      d.id, 
      d.percentage, 
      d.title, 
      d.image_path, 
      GROUP_CONCAT(c.card_name SEPARATOR ', ') AS card_names 
    FROM discounts d
    LEFT JOIN cards c ON d.card_id = c.id
    WHERE d.merchant_id = ? AND d.bank_id = ? AND d.city_id = ? AND d.branch_id = ?
    GROUP BY d.id
  `;
  db.query(query, [merchantId, bankId, cityId, branchId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Start Server
const PORT = 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));