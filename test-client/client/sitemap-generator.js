import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

// Base URL of your site
const BASE_URL = 'https://rabaat.com';

const generateSitemap = async () => {
    const smStream = new SitemapStream({ hostname: BASE_URL });

    // Define your React app's routes
    const routes = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/banks', changefreq: 'weekly', priority: 0.8 },
        { url: '/merchants', changefreq: 'weekly', priority: 0.8 },
        { url: '/deals', changefreq: 'weekly', priority: 0.8 },
        { url: '/branches', changefreq: 'weekly', priority: 0.7 },
        { url: '/discounts', changefreq: 'weekly', priority: 0.7 },
        { url: '/merchantdiscount', changefreq: 'weekly', priority: 0.7 },
        { url: '/branchdiscount', changefreq: 'weekly', priority: 0.7 },
        { url: '/branch-details', changefreq: 'weekly', priority: 0.7 },
    ];

    // Write routes to the stream
    routes.forEach(route => smStream.write(route));

    // End the stream
    smStream.end();

    // Save sitemap to a file
    const filePath = './public/sitemap.xml';
    await pipeline(smStream, createWriteStream(filePath));

    console.log(`Sitemap generated at ${filePath}`);
};

generateSitemap().catch(console.error);
