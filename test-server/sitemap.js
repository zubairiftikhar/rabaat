const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");

const BASE_URL = "https://rabaat.com";
const API_BASE = "http://localhost:8081/api";
const FRONTEND_PUBLIC_PATH = "C:/Office Projects/Rabaat_workspace/rabaat/test-client/client/public/sitemap.xml";

// const BASE_URL = "https://rabaat.com";
// const API_BASE = "https://api.rabaat.com/api";
// const FRONTEND_PUBLIC_PATH = "https://rabaat.com/public/sitemap.xml";

// Function to fetch dynamic data
const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
};

// Helper function to format URLs properly
const replaceSpacesWithUnderscore = (str) => 
  str ? str.replace(/\s+/g, "_") : "";

const generateSitemap = async () => {
  let urls = [
    `${BASE_URL}/`,
    `${BASE_URL}/aboutus`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/deals`,
    `${BASE_URL}/discounts`
  ];

  // Fetch cities
  const cities = await fetchData("/cities");
  for (const city of cities) {
    const cityName = replaceSpacesWithUnderscore(city.name);
    
    urls.push(`${BASE_URL}/${cityName}?CityID=${city.id}`);
    urls.push(`${BASE_URL}/${cityName}/Banks?CityID=${city.id}`);

    // Fetch merchants for each city
    const merchants = await fetchData(`/merchants/${city.id}`);
    for (const merchant of merchants.merchants) {
      const merchantName = replaceSpacesWithUnderscore(merchant.name);
      urls.push(`${BASE_URL}/${cityName}/${merchantName}?MerchantID=${merchant.id}&CityID=${city.id}`);

      // Fetch branches for each merchant
      const branches = await fetchData(`/branches/${merchant.id}/${city.id}`);
      for (const branch of branches) {
        const branchAddress = replaceSpacesWithUnderscore(branch.address);
        urls.push(`${BASE_URL}/${cityName}/${merchantName}/Branch/${branchAddress}?BranchID=${branch.id}&MerchantID=${merchant.id}&CityID=${city.id}`);
      }
    }

    // Fetch banks for each city and add merchant-bank URLs
    const banks = await fetchData("/allbanks");
    for (const bank of banks) {
      const bankName = replaceSpacesWithUnderscore(bank.bank_name);
      urls.push(`${BASE_URL}/merchants/${bank.id}/${city.id}`);
      urls.push(`${BASE_URL}/Bank/${bankName}`);

      for (const merchant of merchants.merchants) {
        const merchantName = replaceSpacesWithUnderscore(merchant.name);

        // Bank URL for merchant
        urls.push(`${BASE_URL}/${cityName}/${merchantName}/Bank/${bankName}?MerchantID=${merchant.id}&BankID=${bank.bank_id}&CityID=${city.id}`);

        // Fetch branches for each merchant and bank
        const branches = await fetchData(`/branches/${merchant.id}/${city.id}`);
        for (const branch of branches) {
          const branchAddress = replaceSpacesWithUnderscore(branch.address);
          urls.push(`${BASE_URL}/${cityName}/${merchantName}/Bank/${bankName}/${branchAddress}?MerchantID=${merchant.id}&BranchID=${branch.id}&BankID=${bank.bank_id}&CityID=${city.id}`);
        }
      }
    }
  }

  // Fetch all banks and add BankDiscount URLs
  const banks = await fetchData("/allbanks");
  for (const bank of banks) {
    const bankName = replaceSpacesWithUnderscore(bank.bank_name);
    
    // Fetch all cards for bank discounts
    const cards = await fetchData(`/cards/${bank.bank_id}`);
    for (const card of cards) {
      const cardName = replaceSpacesWithUnderscore(card.card_name);
      urls.push(`${BASE_URL}/BankDiscount/${bankName}/${cardName}`);

      for (const merchant of await fetchData("/allMerchants")) {
        const merchantName = replaceSpacesWithUnderscore(merchant.name);
        urls.push(`${BASE_URL}/BankDiscount/${bankName}/${cardName}/${merchantName}?CityID=${merchant.city_id}&MerchantID=${merchant.id}`);
      }
    }
  }

  // Fetch all city-based discounts
  for (const city of cities) {
    const cityName = replaceSpacesWithUnderscore(city.name);
    for (const bank of banks) {
      const bankName = replaceSpacesWithUnderscore(bank.bank_name);
      
      const cards = await fetchData(`/cards/${bank.bank_id}`);
      for (const card of cards) {
        const cardName = replaceSpacesWithUnderscore(card.card_name);
        urls.push(`${BASE_URL}/${cityName}/${bankName}/${cardName}/${city.id}`);
      }
    }
  }

  // Generate XML sitemap
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(url => `<url><loc>${url.replace(/&/g, '&amp;')}</loc></url>`).join("\n")  +
    "\n</urlset>";

  fs.writeFileSync(FRONTEND_PUBLIC_PATH, sitemapContent);
  console.log("Sitemap updated!");
};

// Run sitemap generation periodically
setInterval(generateSitemap, 24 * 60 * 60 * 1000); // Runs every 24 hours

// Route to serve the sitemap.xml file
router.get("/sitemap.xml", (req, res) => {
  res.sendFile(FRONTEND_PUBLIC_PATH);
});

// Generate sitemap on startup
generateSitemap();

// Export the router
module.exports = router;
