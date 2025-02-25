const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const BASE_URL = "https://rabaat.com";
const API_BASE = "http://localhost:8081/api";
const SITEMAP_DIR = path.join(__dirname, "../test-client/client/public");
const SITEMAP_INDEX_PATH = path.join(SITEMAP_DIR, "sitemap.xml");
const CHUNK_SIZE = 10000;

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
  let urls = [
    `${BASE_URL}/`,
    `${BASE_URL}/AboutUs`,
    `${BASE_URL}/Contact`,
    `${BASE_URL}/TermOfUse`,
  ];

  const cities = await fetchData("/cities");
  const banks = await fetchData("/allbanks"); // Fetch all banks once

  for (const city of cities) {
    const cityName = replaceSpacesWithUnderscore(city.name);
    urls.push(`${BASE_URL}/${cityName}`);
    urls.push(`${BASE_URL}/${cityName}/Bank`);
    urls.push(`${BASE_URL}/${cityName}/Search-By-Bank`);

    // Fetch merchants in the city
    const merchantsResponse = await fetchData(`/merchants/${city.name}`);
    const merchants = merchantsResponse?.merchants || [];

    // Generate URLs for merchants and their branches
    for (const merchant of merchants) {
      const merchantName = replaceSpacesWithUnderscore(merchant.name);
      urls.push(`${BASE_URL}/${cityName}/${merchantName}`);

      // Fetch branches for this merchant in this city
      const branches = await fetchData(`/branches/${merchant.name}/${city.name}`);
      for (const branch of branches) {
        const branchAddress = replaceSpacesWithUnderscore(branch.address);
        urls.push(`${BASE_URL}/${cityName}/${merchantName}/Branch/${branch.id}/${branchAddress}`);
      }
    }

    // Generate URLs for banks and their merchants in the city
    for (const bank of banks) {
      const bankName = replaceSpacesWithUnderscore(bank.name);
      urls.push(`${BASE_URL}/${cityName}/Bank/${bankName}`);

      for (const merchant of merchants) {
        const merchantName = replaceSpacesWithUnderscore(merchant.name);
        urls.push(`${BASE_URL}/${cityName}/${merchantName}/Bank/${bankName}`);

        // Fetch branches only once per merchant-city combination
        const branches = await fetchData(`/branches/${merchant.name}/${city.name}`);
        for (const branch of branches) {
          const branchAddress = replaceSpacesWithUnderscore(branch.address);
          urls.push(`${BASE_URL}/${cityName}/${bankName}/${merchantName}/Branch/${branch.id}/${branchAddress}`);
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
        urls.push(`${BASE_URL}/${cityName}/Bank/${bankName}/${cardName}`);

        // Fetch merchants only once per city
        const merchantsResponse = await fetchData(`/merchants/${city.name}`);
        const merchants = merchantsResponse?.merchants || [];
        
        for (const merchant of merchants) {
          const merchantName = replaceSpacesWithUnderscore(merchant.name);
          urls.push(`${BASE_URL}/${cityName}/Bank/${bankName}/${cardName}/${merchantName}`);
        }
      }
    }
  }

  // Generate sitemap chunks
  let sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  let chunkIndex = 1;

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunkUrls = urls.slice(i, i + CHUNK_SIZE);
    const sitemapFilename = `sitemap_${String(chunkIndex).padStart(3, "0")}.xml`;
    const sitemapPath = path.join(SITEMAP_DIR, sitemapFilename);

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      chunkUrls.map(url => `<url><loc>${url.replace(/&/g, "&amp;")}</loc></url>`).join("\n") +
      "\n</urlset>";

    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log(`Generated ${sitemapFilename}`);
    sitemapIndexContent += `<sitemap><loc>${BASE_URL}/${sitemapFilename}</loc></sitemap>\n`;
    chunkIndex++;
  }

  sitemapIndexContent += "</sitemapindex>";
  fs.writeFileSync(SITEMAP_INDEX_PATH, sitemapIndexContent);
  console.log("Sitemap index updated!");
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
