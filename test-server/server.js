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
    database: "test_rabaat", // Replace with your database name
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

// 2. Fetch banks for a specific city
app.get("/api/banks/:cityId", (req, res) => {
    const { cityId } = req.params;
    const query = "SELECT id, name, image_path FROM banks WHERE city_id = ?";
    db.query(query, [cityId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 3. Fetch merchants for a specific bank and city
app.get("/api/merchants/:bankId/:cityId", (req, res) => {
    const { bankId, cityId } = req.params;
    const query = "SELECT id, name, category, image_path FROM merchants WHERE bank_id = ? AND city_id = ?";
    db.query(query, [bankId, cityId], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
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
  
  

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
