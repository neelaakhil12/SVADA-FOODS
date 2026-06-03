import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log("Starting database initialization...");
  
  try {
    // 1. Read and run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split SQL by semicolons, filtering out empty lines
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
      
    console.log(`Executing ${statements.length} schema statements...`);
    for (const statement of statements) {
      await db.query(statement);
    }
    console.log("Schema initialized successfully.");

    // 2. Read initial-data.json
    const dataPath = path.join(__dirname, 'initial-data.json');
    if (!fs.existsSync(dataPath)) {
      console.warn("initial-data.json not found, skipping seeding.");
      return;
    }
    
    const { PRODUCTS_DATA, DEFAULT_CATEGORY_METADATA } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // 3. Seed Categories
    console.log("Seeding categories...");
    for (const [name, meta] of Object.entries(DEFAULT_CATEGORY_METADATA)) {
      await db.query(
        `INSERT INTO categories (name, image, description) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE image = ?, description = ?`,
        [name, meta.image || '', meta.desc || '', meta.image || '', meta.desc || '']
      );
    }
    console.log(`Categories seeded: ${Object.keys(DEFAULT_CATEGORY_METADATA).length}`);

    // 4. Seed Products
    console.log("Seeding products...");
    for (const p of PRODUCTS_DATA) {
      const weightLabels = p.weightLabels ? JSON.stringify(p.weightLabels) : null;
      const isBestseller = p.isBestseller ? 1 : 0;
      const inStock = p.inStock !== false ? 1 : 0;
      const isEcoPiece = p.isEcoPiece ? 1 : 0;

      await db.query(
        `INSERT INTO products (id, name, category, price250g, price500g, price1kg, rating, reviews, description, image, ingredients, isBestseller, inStock, isEcoPiece, weightLabels) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE name = ?, category = ?, price250g = ?, price500g = ?, price1kg = ?, rating = ?, reviews = ?, description = ?, image = ?, ingredients = ?, isBestseller = ?, inStock = ?, isEcoPiece = ?, weightLabels = ?`,
        [
          p.id, p.name, p.category, p.price250g || 0, p.price500g || 0, p.price1kg || 0, 
          p.rating || 0, p.reviews || 0, p.description || '', p.image || '', p.ingredients || '', 
          isBestseller, inStock, isEcoPiece, weightLabels,
          // ON DUPLICATE KEY UPDATE values:
          p.name, p.category, p.price250g || 0, p.price500g || 0, p.price1kg || 0, 
          p.rating || 0, p.reviews || 0, p.description || '', p.image || '', p.ingredients || '', 
          isBestseller, inStock, isEcoPiece, weightLabels
        ]
      );
    }
    console.log(`Products seeded: ${PRODUCTS_DATA.length}`);
    console.log("Database initialized and seeded successfully!");
    
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    process.exit(0);
  }
}

initializeDatabase();


