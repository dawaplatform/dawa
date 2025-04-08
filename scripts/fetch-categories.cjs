const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

async function fetchAndSaveCategories() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error(
        'NEXT_PUBLIC_API_URL is not defined in the environment variables',
      );
    }

    console.info(`Fetching categories from ${apiUrl}/getcategories/`);
    const response = await axios.get(`${apiUrl}/getcategories/`);
    const categories = response.data.data || [];

    const filePath = path.resolve(process.cwd(), 'public/categories.json');
    fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
    console.log('Categories saved to public/categories.json');
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    process.exit(1);
  }
}

fetchAndSaveCategories();
