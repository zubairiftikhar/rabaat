const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");

const BASE_URL = "https://rabaat.com";
const API_BASE = "http://localhost:8081/api";
const SITEMAP_DIR = "C:/Office Projects/Rabaat_workspace/rabaat/test-client/client/public/";
const SITEMAP_INDEX_PATH = `${SITEMAP_DIR}sitemap.xml`;
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
    `${BASE_URL}/aboutus`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/deals`,
    `${BASE_URL}/discounts`,
  ];

  const cities = await fetchData("/cities");
  for (const city of cities) {
    const cityName = replaceSpacesWithUnderscore(city.name);
    urls.push(`${BASE_URL}/${cityName}?CityID=${city.id}`);
    urls.push(`${BASE_URL}/${cityName}/Banks?CityID=${city.id}`);
    
    const merchantsResponse = await fetchData(`/merchants/${city.id}`);
    const merchants = merchantsResponse?.merchants || [];
    
    for (const merchant of merchants) {
      const merchantName = replaceSpacesWithUnderscore(merchant.name);
      urls.push(`${BASE_URL}/${cityName}/${merchantName}?MerchantID=${merchant.id}&CityID=${city.id}`);
      
      const branches = await fetchData(`/branches/${merchant.id}/${city.id}`);
      for (const branch of branches) {
        const branchAddress = replaceSpacesWithUnderscore(branch.address);
        urls.push(`${BASE_URL}/${cityName}/${merchantName}/Branch/${branchAddress}?BranchID=${branch.id}&MerchantID=${merchant.id}&CityID=${city.id}`);
      }
    }

    const banks = await fetchData("/allbanks");
    for (const bank of banks) {
      const bankName = replaceSpacesWithUnderscore(bank.name);
      urls.push(`${BASE_URL}/merchants/${bank.id}/${city.id}`);
      urls.push(`${BASE_URL}/Bank/${bankName}`);

      for (const merchant of merchants) {
        const merchantName = replaceSpacesWithUnderscore(merchant.name);
        urls.push(`${BASE_URL}/${cityName}/${merchantName}/Bank/${bankName}?MerchantID=${merchant.id}&BankID=${bank.id}&CityID=${city.id}`);

        const branches = await fetchData(`/branches/${merchant.id}/${city.id}`);
        for (const branch of branches) {
          const branchAddress = replaceSpacesWithUnderscore(branch.address);
          urls.push(`${BASE_URL}/${cityName}/${merchantName}/Bank/${bankName}/${branchAddress}?MerchantID=${merchant.id}&BranchID=${branch.id}&BankID=${bank.id}&CityID=${city.id}`);
        }
      }
    }
  }

  const banks = await fetchData("/allbanks");
  for (const bank of banks) {
    const bankName = replaceSpacesWithUnderscore(bank.name);
    const cards = await fetchData(`/cards/${bank.name}`);
    for (const card of cards) {
      const cardName = replaceSpacesWithUnderscore(card.CardName);
      urls.push(`${BASE_URL}/BankDiscount/${bankName}/${cardName}`);
      for (const city of cities) {
        const merchantsResponse = await fetchData(`/merchants/${city.id}`);
        const merchants = merchantsResponse?.merchants || [];
        for (const merchant of merchants) {
          const merchantName = replaceSpacesWithUnderscore(merchant.name);
          urls.push(`${BASE_URL}/BankDiscount/${bankName}/${cardName}/${merchantName}?CityID=${city.id}&MerchantID=${merchant.id}`);
        }
      }
    }
  }

  for (const city of cities) {
    const cityName = replaceSpacesWithUnderscore(city.name);
    for (const bank of banks) {
      const bankName = replaceSpacesWithUnderscore(bank.name);
      const cards = await fetchData(`/cards/${bank.name}`);
      for (const card of cards) {
        const cardName = replaceSpacesWithUnderscore(card.CardName);
        urls.push(`${BASE_URL}/${cityName}/${bankName}/${cardName}/${city.id}`);
      }
    }
  }

  let sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  let chunkIndex = 1;

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunkUrls = urls.slice(i, i + CHUNK_SIZE);
    const sitemapFilename = `sitemap_${String(chunkIndex).padStart(3, "0")}.xml`;
    const sitemapPath = `${SITEMAP_DIR}${sitemapFilename}`;

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

setInterval(generateSitemap, 24 * 60 * 60 * 1000);

router.get("/sitemap.xml", (req, res) => {
  res.sendFile(SITEMAP_INDEX_PATH);
});

generateSitemap();

module.exports = router;
