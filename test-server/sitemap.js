const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const BASE_URL = "https://rabaat.com";
const API_BASE = "http://localhost:8081/api";
const SITEMAP_DIR = path.join(__dirname, "../test-client/client/public");
const SITEMAP_INDEX_PATH = path.join(SITEMAP_DIR, "sitemap.xml");
const MAX_URLS_PER_FILE = 10000;

const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
};

const replaceSpacesWithUnderscore = (str) => (str ? str.replace(/\s+/g, "_") : "");

const generateSitemap = async () => {
  // Create URL groups
  const staticUrls = [
    `${BASE_URL}/`,
    `${BASE_URL}/AboutUs`,
    `${BASE_URL}/Contact`,
    `${BASE_URL}/TermOfUse`,
  ];

  const cityUrls = [];
  const categoryUrls = [];
  const merchantUrls = [];
  const branchUrls = [];
  const bankUrls = [];
  const cardUrls = [];

  const cities = await fetchData("/cities");
  const banks = await fetchData("/allbanks");
  const categories = await fetchData("/categories");

  // Generate city URLs
  for (const city of cities) {
    const cityName = replaceSpacesWithUnderscore(city.name);
    cityUrls.push(`${BASE_URL}/${cityName}`);
    cityUrls.push(`${BASE_URL}/${cityName}/Bank`);
    cityUrls.push(`${BASE_URL}/${cityName}/Search-By-Bank`);
    
    // Add category URLs for each city
    for (const category of categories) {
      const categoryName = replaceSpacesWithUnderscore(category.CategoryName);
      categoryUrls.push(`${BASE_URL}/${cityName}/category/${categoryName}`);
    }

    // Fetch merchants in the city
    const merchantsResponse = await fetchData(`/merchants/${city.name}`);
    const merchants = merchantsResponse?.merchants || [];

    // Generate URLs for merchants and their branches
    for (const merchant of merchants) {
      const merchantName = replaceSpacesWithUnderscore(merchant.name);
      merchantUrls.push(`${BASE_URL}/${cityName}/${merchantName}`);

      // Fetch branches for this merchant in this city
      const branches = await fetchData(`/branches/${merchant.name}/${city.name}`);
      for (const branch of branches) {
        const branchAddress = replaceSpacesWithUnderscore(branch.address);
        branchUrls.push(`${BASE_URL}/${cityName}/${merchantName}/Branch/${branch.id}/${branchAddress}`);
      }
    }

    // Generate URLs for banks and their merchants in the city
    for (const bank of banks) {
      const bankName = replaceSpacesWithUnderscore(bank.name);
      bankUrls.push(`${BASE_URL}/${cityName}/Bank/${bankName}`);

      for (const merchant of merchants) {
        const merchantName = replaceSpacesWithUnderscore(merchant.name);
        bankUrls.push(`${BASE_URL}/${cityName}/${merchantName}/Bank/${bankName}`);

        // Fetch branches only once per merchant-city combination
        const branches = await fetchData(`/branches/${merchant.name}/${city.name}`);
        for (const branch of branches) {
          const branchAddress = replaceSpacesWithUnderscore(branch.address);
          branchUrls.push(`${BASE_URL}/${cityName}/${bankName}/${merchantName}/Branch/${branch.id}/${branchAddress}`);
        }
      }
    }
  }

  // Generate URLs for cards
  for (const bank of banks) {
    const bankName = replaceSpacesWithUnderscore(bank.name);
    const cards = await fetchData(`/cards/${bank.name}`);

    for (const card of cards) {
      const cardName = replaceSpacesWithUnderscore(card.CardName);
      
      for (const city of cities) {
        const cityName = replaceSpacesWithUnderscore(city.name);
        cardUrls.push(`${BASE_URL}/${cityName}/Bank/${bankName}/${cardName}`);

        // Fetch merchants only once per city
        const merchantsResponse = await fetchData(`/merchants/${city.name}`);
        const merchants = merchantsResponse?.merchants || [];
        
        for (const merchant of merchants) {
          const merchantName = replaceSpacesWithUnderscore(merchant.name);
          cardUrls.push(`${BASE_URL}/${cityName}/Bank/${bankName}/${cardName}/${merchantName}`);
        }
      }
    }
  }

  // Group all URL categories
  const urlGroups = [
    { name: "static", urls: staticUrls },
    { name: "cities", urls: cityUrls },
    { name: "categories", urls: categoryUrls },
    { name: "merchants", urls: merchantUrls },
    { name: "branches", urls: branchUrls },
    { name: "banks", urls: bankUrls },
    { name: "discounts", urls: cardUrls }
  ];

  // Generate sitemap files for each group, potentially splitting into chunks if too large
  let sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  for (const group of urlGroups) {
    if (group.urls.length === 0) continue;
    
    // Split the group into chunks if needed
    if (group.urls.length <= MAX_URLS_PER_FILE) {
      // Create a single file for this group
      const filename = `sitemap_${group.name}.xml`;
      const filePath = path.join(SITEMAP_DIR, filename);
      
      const content = generateSitemapContent(group.urls);
      fs.writeFileSync(filePath, content);
      
      sitemapIndexContent += `<sitemap><loc>${BASE_URL}/${filename}</loc></sitemap>\n`;
      console.log(`Generated ${filename} with ${group.urls.length} URLs`);
    } else {
      // Split into multiple files
      const chunkCount = Math.ceil(group.urls.length / MAX_URLS_PER_FILE);
      
      for (let i = 0; i < chunkCount; i++) {
        const startIdx = i * MAX_URLS_PER_FILE;
        const endIdx = Math.min((i + 1) * MAX_URLS_PER_FILE, group.urls.length);
        const chunkUrls = group.urls.slice(startIdx, endIdx);
        
        const filename = `sitemap_${group.name}_${String(i+1).padStart(3, "0")}.xml`;
        const filePath = path.join(SITEMAP_DIR, filename);
        
        const content = generateSitemapContent(chunkUrls);
        fs.writeFileSync(filePath, content);
        
        sitemapIndexContent += `<sitemap><loc>${BASE_URL}/${filename}</loc></sitemap>\n`;
        console.log(`Generated ${filename} with ${chunkUrls.length} URLs`);
      }
    }
  }

  sitemapIndexContent += "</sitemapindex>";
  fs.writeFileSync(SITEMAP_INDEX_PATH, sitemapIndexContent);
  console.log("Sitemap index updated!");
};

// Helper function to generate sitemap XML content
const generateSitemapContent = (urls) => {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(url => `<url><loc>${url.replace(/&/g, "&amp;")}</loc></url>`).join("\n") +
    "\n</urlset>";
};

// Run sitemap generation periodically (every 24 hours)
setInterval(generateSitemap, 24 * 60 * 60 * 1000);

// Serve sitemap.xml
router.get("/sitemap.xml", (req, res) => {
  res.sendFile(SITEMAP_INDEX_PATH);
});

// Generate sitemap on startup
generateSitemap();

module.exports = router;