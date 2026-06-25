import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import db from './db.js';
import nodemailer from 'nodemailer';
import multer from 'multer';
import Razorpay from 'razorpay';

// Prevent Node process from crashing on unhandled promise rejections or database connection errors
process.on('unhandledRejection', (reason, promise) => {
  console.warn('DEBUG: Unhandled Rejection (likely local MySQL not running):', reason.message || reason);
});
process.on('uncaughtException', (err) => {
  console.error('DEBUG: Uncaught Exception:', err.message || err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const isDbConfigured = !!process.env.DB_USER;

const getDbErrorMessage = (error) => {
  if (!error) return "Unknown database error";
  if (error.errors && error.errors.length > 0) {
    return error.errors.map(e => e.message || e.toString()).join(", ");
  }
  return error.message || error.toString();
};

// In-Memory Fallback Stores (used if MySQL is offline)
const memoryOtpStore = new Map();
const memoryAdminResetTokens = new Map();
const memoryOrders = [];
let fallbackProducts = [];
let fallbackCategories = [];
let fallbackVideos = [];
let fallbackHeroSlides = [
  {
    id: 'hs-default',
    name: 'Free Shipping & Fast Delivery',
    image: '/image copy 158.png',
    desc: 'Free delivery across India on orders above ₹3,500'
  }
];

const videosFallbackPath = path.join(__dirname, 'videos-fallback.json');
try {
  if (fs.existsSync(videosFallbackPath)) {
    fallbackVideos = JSON.parse(fs.readFileSync(videosFallbackPath, 'utf8'));
  } else {
    const initialDataPath = path.join(__dirname, 'initial-data.json');
    if (fs.existsSync(initialDataPath)) {
      const { VIDEOS_DATA } = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
      fallbackVideos = VIDEOS_DATA || [];
      fs.writeFileSync(videosFallbackPath, JSON.stringify(fallbackVideos, null, 2), 'utf8');
    }
  }
} catch (err) {
  console.warn("Failed to load fallback videos data:", err.message);
}

const productsFallbackPath = path.join(__dirname, 'products-fallback.json');
const categoriesFallbackPath = path.join(__dirname, 'categories-fallback.json');
const ordersFallbackPath = path.join(__dirname, 'orders-fallback.json');
const heroSlidesFallbackPath = path.join(__dirname, 'hero-slides-fallback.json');
const usersFallbackPath = path.join(__dirname, 'users-fallback.json');
const settingsFallbackPath = path.join(__dirname, 'settings-fallback.json');
const memoryUsers = [];

let fallbackSettings = { free_shipping_threshold: "3500", shipping_cost: "90" };
try {
  if (fs.existsSync(settingsFallbackPath)) {
    fallbackSettings = JSON.parse(fs.readFileSync(settingsFallbackPath, 'utf8'));
  }
} catch (err) {
  console.warn("Failed to load fallback settings data:", err.message);
}


// Load fallback products
try {
  if (fs.existsSync(productsFallbackPath)) {
    fallbackProducts = JSON.parse(fs.readFileSync(productsFallbackPath, 'utf8'));
  } else {
    const initialDataPath = path.join(__dirname, 'initial-data.json');
    if (fs.existsSync(initialDataPath)) {
      const { PRODUCTS_DATA } = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
      fallbackProducts = PRODUCTS_DATA.map(p => ({
        ...p,
        id: p.id,
        name: p.name,
        category: p.category,
        price250g: p.price250g || 0,
        price500g: p.price500g || 0,
        price1kg: p.price1kg || 0,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        description: p.description || '',
        image: p.image || '',
        ingredients: p.ingredients || '',
        isBestseller: !!p.isBestseller,
        inStock: p.inStock !== false,
        isEcoPiece: !!p.isEcoPiece,
        weightLabels: p.weightLabels || null
      }));
      fs.writeFileSync(productsFallbackPath, JSON.stringify(fallbackProducts, null, 2), 'utf8');
    }
  }
} catch (err) {
  console.warn("Failed to load fallback products data:", err.message);
}

// Load fallback categories
try {
  if (fs.existsSync(categoriesFallbackPath)) {
    fallbackCategories = JSON.parse(fs.readFileSync(categoriesFallbackPath, 'utf8'));
  } else {
    const initialDataPath = path.join(__dirname, 'initial-data.json');
    if (fs.existsSync(initialDataPath)) {
      const { DEFAULT_CATEGORY_METADATA } = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
      fallbackCategories = Object.entries(DEFAULT_CATEGORY_METADATA).map(([name, meta]) => ({
        name,
        image: meta.image || '',
        description: meta.desc || ''
      }));
      fs.writeFileSync(categoriesFallbackPath, JSON.stringify(fallbackCategories, null, 2), 'utf8');
    }
  }
} catch (err) {
  console.warn("Failed to load fallback categories data:", err.message);
}

// Load fallback orders
try {
  if (fs.existsSync(ordersFallbackPath)) {
    const loaded = JSON.parse(fs.readFileSync(ordersFallbackPath, 'utf8'));
    const uniqueLoaded = [];
    const seenIds = new Set();
    for (const order of loaded) {
      if (order && order.id && !seenIds.has(order.id)) {
        seenIds.add(order.id);
        uniqueLoaded.push(order);
      }
    }
    memoryOrders.push(...uniqueLoaded);
  }
} catch (err) {
  console.warn("Failed to load fallback orders data:", err.message);
}

// Load fallback hero slides
try {
  if (fs.existsSync(heroSlidesFallbackPath)) {
    fallbackHeroSlides = JSON.parse(fs.readFileSync(heroSlidesFallbackPath, 'utf8'));
  }
  if (fallbackHeroSlides.length <= 1) {
    const initialDataPath = path.join(__dirname, 'initial-data.json');
    if (fs.existsSync(initialDataPath)) {
      const { DEFAULT_CATEGORY_METADATA } = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
      const catSlides = Object.entries(DEFAULT_CATEGORY_METADATA).map(([name, meta], index) => ({
        id: `hs-cat-${index + 1}`,
        name: name,
        image: meta.image || '',
        desc: meta.desc || ''
      }));
      const existingIds = new Set(fallbackHeroSlides.map(s => s.id));
      const newSlides = catSlides.filter(s => !existingIds.has(s.id));
      fallbackHeroSlides = [...fallbackHeroSlides, ...newSlides];
      fs.writeFileSync(heroSlidesFallbackPath, JSON.stringify(fallbackHeroSlides, null, 2), 'utf8');
    }
  }
} catch (err) {
  console.warn("Failed to load fallback hero slides data:", err.message);
}

// Load fallback users
try {
  if (fs.existsSync(usersFallbackPath)) {
    const loaded = JSON.parse(fs.readFileSync(usersFallbackPath, 'utf8'));
    if (Array.isArray(loaded)) {
      memoryUsers.push(...loaded);
    }
  }
} catch (err) {
  console.warn("Failed to load fallback users data:", err.message);
}

// Mail Transporter Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.warn('DEBUG: SMTP connection failed. Check credentials in .env:', error.message);
  } else {
    console.log('SMTP connection verified successfully. Ready to send emails.');
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'video-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(uploadsDir));


// Serve React build static files in production
app.use(express.static(path.join(__dirname, '../dist')));

async function saveOrUpdateUser(email, name, phone) {
  const lastLogin = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const userRecord = { email, name, phone, lastLogin };

  try {
    await db.query(
      `INSERT INTO users (email, name, phone, lastLogin) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE name = ?, phone = ?, lastLogin = ?`,
      [email, name, phone, lastLogin, name, phone, lastLogin]
    );
    console.log(`Saved/Updated user in DB: ${email}`);
  } catch (dbErr) {
    if (isDbConfigured) {
      throw dbErr;
    }
    console.warn("Database offline. Saving user to memory/fallback JSON:", dbErr.message);
  }

  const idx = memoryUsers.findIndex(u => u.email === email);
  if (idx !== -1) {
    memoryUsers[idx] = userRecord;
  } else {
    memoryUsers.push(userRecord);
  }
  try {
    fs.writeFileSync(usersFallbackPath, JSON.stringify(memoryUsers, null, 2), 'utf8');
  } catch (fsErr) {
    console.warn("Failed to write users fallback:", fsErr.message);
  }
}

// -------------------------------------------------------------
// DATABASE AUTO-INITIALIZATION & SEEDING ON STARTUP
// -------------------------------------------------------------
async function checkAndInitDatabase() {
  try {
    console.log("Ensuring database schema tables exist...");
    
    // Always execute schema.sql (contains CREATE TABLE IF NOT EXISTS)
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
      
    for (const statement of statements) {
      await db.query(statement);
    }
    console.log("Schema tables ensured.");

    const dataPath = path.join(__dirname, 'initial-data.json');
    if (fs.existsSync(dataPath)) {
      const { PRODUCTS_DATA, DEFAULT_CATEGORY_METADATA } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

      // Check and Seed Categories if empty
      const [catRows] = await db.query("SELECT COUNT(*) as count FROM categories");
      if (catRows[0].count === 0) {
        console.log("Seeding categories table...");
        for (const [name, meta] of Object.entries(DEFAULT_CATEGORY_METADATA)) {
          await db.query(
            `INSERT INTO categories (name, image, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=name`,
            [name, meta.image || '', meta.desc || '']
          );
        }
        console.log("Categories seeded successfully.");
      } else {
        console.log("Categories already exist. Skipping categories seed.");
      }

      // Check and Seed Products if empty
      const [prodRows] = await db.query("SELECT COUNT(*) as count FROM products");
      if (prodRows[0].count === 0) {
        console.log("Seeding products table...");
        for (const p of PRODUCTS_DATA) {
          const weightLabels = p.weightLabels ? JSON.stringify(p.weightLabels) : null;
          const isBestseller = p.isBestseller ? 1 : 0;
          const inStock = p.inStock !== false ? 1 : 0;
          const isEcoPiece = p.isEcoPiece ? 1 : 0;

          await db.query(
            `INSERT INTO products (id, name, category, price250g, price500g, price1kg, rating, reviews, description, image, ingredients, isBestseller, inStock, isEcoPiece, weightLabels) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.id, p.name, p.category, p.price250g || 0, p.price500g || 0, p.price1kg || 0, 
              p.rating || 0, p.reviews || 0, p.description || '', p.image || '', p.ingredients || '', 
              isBestseller, inStock, isEcoPiece, weightLabels
            ]
          );
        }
        console.log("Products seeded successfully.");
      } else {
        console.log("Products already exist. Skipping products seed.");
      }

      // Check and Seed Videos if empty
      const [videoRows] = await db.query("SELECT COUNT(*) as count FROM watch_buy_videos");
      if (videoRows[0].count === 0) {
        console.log("Seeding watch_buy_videos table...");
        for (const v of VIDEOS_DATA) {
          await db.query(
            `INSERT INTO watch_buy_videos (id, videoUrl, title, \`desc\`, keyword) 
             VALUES (?, ?, ?, ?, ?)`,
            [v.id, v.videoUrl, v.title, v.desc || '', v.keyword]
          );
        }
        console.log("Watch & Buy videos seeded successfully.");
      } else {
        console.log("Watch & Buy videos already exist. Skipping seed.");
      }
    }

    // Check and Seed Settings if empty
    try {
      const [settingRows] = await db.query("SELECT COUNT(*) as count FROM settings");
      if (settingRows[0].count === 0) {
        console.log("Seeding settings table...");
        await db.query("INSERT INTO settings (key_name, value_name) VALUES ('free_shipping_threshold', '3500'), ('shipping_cost', '90'), ('admin_email', 'svadafarms@gmail.com'), ('admin_password', 'admin123')");
        console.log("Settings seeded successfully.");
      } else {
        const [shippingRows] = await db.query("SELECT * FROM settings WHERE key_name = 'shipping_cost'");
        if (shippingRows.length === 0) {
          await db.query("INSERT INTO settings (key_name, value_name) VALUES ('shipping_cost', '90')");
          console.log("Seeded missing shipping_cost setting.");
        }
        const [emailRows] = await db.query("SELECT * FROM settings WHERE key_name = 'admin_email'");
        if (emailRows.length === 0) {
          await db.query("INSERT INTO settings (key_name, value_name) VALUES ('admin_email', 'svadafarms@gmail.com')");
          console.log("Seeded missing admin_email setting.");
        }
        const [passRows] = await db.query("SELECT * FROM settings WHERE key_name = 'admin_password'");
        if (passRows.length === 0) {
          await db.query("INSERT INTO settings (key_name, value_name) VALUES ('admin_password', 'admin123')");
          console.log("Seeded missing admin_password setting.");
        }
      }
    } catch (settingErr) {
      console.warn("Failed to check or seed settings table:", settingErr.message);
    }

    // Auto-migrate: Add trackingLink column to orders table if it doesn't exist
    try {
      await db.query("ALTER TABLE orders ADD COLUMN trackingLink VARCHAR(512) DEFAULT NULL");
      console.log("Migration: Added trackingLink column to orders table.");
    } catch (err) {
      // Ignore if the column already exists (Error Code 1060 or ER_DUP_FIELDNAME)
      if (err.errno !== 1060 && err.code !== 'ER_DUP_FIELDNAME') {
        console.warn("Failed to automatically add trackingLink column:", err.message);
      }
    }

    // Auto-migrate: Change image columns to LONGTEXT to support base64 uploads
    try {
      await db.query("ALTER TABLE products MODIFY COLUMN image LONGTEXT");
      console.log("Migration: Modified products.image to LONGTEXT");
    } catch (err) {
      console.warn("Failed to migrate products.image to LONGTEXT:", err.message);
    }
    try {
      await db.query("ALTER TABLE categories MODIFY COLUMN image LONGTEXT");
      console.log("Migration: Modified categories.image to LONGTEXT");
    } catch (err) {
      console.warn("Failed to migrate categories.image to LONGTEXT:", err.message);
    }
    try {
      await db.query("ALTER TABLE hero_slides MODIFY COLUMN image LONGTEXT");
      console.log("Migration: Modified hero_slides.image to LONGTEXT");
    } catch (err) {
      console.warn("Failed to migrate hero_slides.image to LONGTEXT:", err.message);
    }

    // Check and Seed Hero Slides if empty
    try {
      const [heroRows] = await db.query("SELECT COUNT(*) as count FROM hero_slides");
      if (heroRows[0].count <= 1) {
        console.log("Seeding hero_slides table...");
        const [existingSlides] = await db.query("SELECT * FROM hero_slides");
        const existingIds = new Set(existingSlides.map(s => s.id));

        const dataPath = path.join(__dirname, 'initial-data.json');
        if (fs.existsSync(dataPath)) {
          const { DEFAULT_CATEGORY_METADATA } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
          
          // Default slide
          if (!existingIds.has('hs-default')) {
            await db.query(
              "INSERT INTO hero_slides (id, name, image, `desc`) VALUES (?, ?, ?, ?)",
              ['hs-default', 'Free Shipping & Fast Delivery', '/image copy 158.png', 'Free delivery across India on orders above ₹3,500']
            );
          } else {
            await db.query(
              "UPDATE hero_slides SET name = ?, `desc` = ? WHERE id = ?",
              ['Free Shipping & Fast Delivery', 'Free delivery across India on orders above ₹3,500', 'hs-default']
            );
          }

          // Category slides
          let index = 1;
          for (const [name, meta] of Object.entries(DEFAULT_CATEGORY_METADATA)) {
            const slideId = `hs-cat-${index}`;
            index++;
            if (!existingIds.has(slideId)) {
              await db.query(
                "INSERT INTO hero_slides (id, name, image, `desc`) VALUES (?, ?, ?, ?)",
                [slideId, name, meta.image || '', meta.desc || '']
              );
            }
          }
          console.log("Hero slides seeded successfully in database.");
        }
      } else {
        console.log("Hero slides already exist in database. Skipping seed.");
      }
    } catch (heroErr) {
      console.warn("Failed to check or seed hero slides table in database:", heroErr.message);
    }
  } catch (error) {
    console.error("Failed to auto-initialize database on startup:", error);
  }
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    const formatted = rows.map(p => ({
      ...p,
      isBestseller: !!p.isBestseller,
      inStock: !!p.inStock,
      isEcoPiece: !!p.isEcoPiece,
      weightLabels: p.weightLabels ? (typeof p.weightLabels === 'string' ? JSON.parse(p.weightLabels) : p.weightLabels) : null
    }));
    res.json(formatted);
  } catch (error) {
    console.warn("Database offline. Returning products from fallback JSON.");
    res.json(fallbackProducts);
  }
});

app.post('/api/products', async (req, res) => {
  const p = req.body;
  const id = p.id || Date.now().toString();
  const weightLabels = p.weightLabels ? JSON.stringify(p.weightLabels) : null;
  
  const newProduct = {
    id,
    name: p.name,
    category: p.category,
    price250g: Number(p.price250g) || 0,
    price500g: Number(p.price500g) || 0,
    price1kg: Number(p.price1kg) || 0,
    rating: Number(p.rating) || 0.00,
    reviews: Number(p.reviews) || 0,
    description: p.description || '',
    image: p.image || '',
    ingredients: p.ingredients || '',
    isBestseller: !!p.isBestseller,
    inStock: p.inStock !== false,
    isEcoPiece: !!p.isEcoPiece,
    weightLabels: p.weightLabels || null
  };

  try {
    await db.query(
      `INSERT INTO products (id, name, category, price250g, price500g, price1kg, rating, reviews, description, image, ingredients, isBestseller, inStock, isEcoPiece, weightLabels)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, p.name, p.category, p.price250g || 0, p.price500g || 0, p.price1kg || 0,
        p.rating || 0, p.reviews || 0, p.description || '', p.image || '', p.ingredients || '',
        p.isBestseller ? 1 : 0, p.inStock !== false ? 1 : 0, p.isEcoPiece ? 1 : 0, weightLabels
      ]
    );
    // Keep fallback in sync
    fallbackProducts.unshift(newProduct);
    try { fs.writeFileSync(productsFallbackPath, JSON.stringify(fallbackProducts, null, 2), 'utf8'); } catch (fsErr) {}
    res.status(201).json({ message: "Product created", id });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in POST /api/products:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Storing product in fallback JSON.");
    fallbackProducts.unshift(newProduct);
    try {
      fs.writeFileSync(productsFallbackPath, JSON.stringify(fallbackProducts, null, 2), 'utf8');
      res.status(201).json({ message: "Product created (Fallback JSON)", id });
    } catch (fsErr) {
      res.status(500).json({ error: "Failed to persist fallback product: " + fsErr.message });
    }
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const p = req.body;
  const weightLabels = p.weightLabels ? JSON.stringify(p.weightLabels) : null;

  try {
    await db.query(
      `UPDATE products SET name = ?, category = ?, price250g = ?, price500g = ?, price1kg = ?, 
       description = ?, image = ?, ingredients = ?, isBestseller = ?, inStock = ?, isEcoPiece = ?, weightLabels = ?
       WHERE id = ?`,
      [
        p.name, p.category, p.price250g || 0, p.price500g || 0, p.price1kg || 0,
        p.description || '', p.image || '', p.ingredients || '',
        p.isBestseller ? 1 : 0, p.inStock !== false ? 1 : 0, p.isEcoPiece ? 1 : 0, weightLabels,
        id
      ]
    );
    // Keep fallback in sync
    fallbackProducts = fallbackProducts.map(prod => prod.id === id ? {
      ...prod,
      name: p.name,
      category: p.category,
      price250g: Number(p.price250g) || 0,
      price500g: Number(p.price500g) || 0,
      price1kg: Number(p.price1kg) || 0,
      description: p.description || '',
      image: p.image || '',
      ingredients: p.ingredients || '',
      isBestseller: !!p.isBestseller,
      inStock: p.inStock !== false,
      isEcoPiece: !!p.isEcoPiece,
      weightLabels: p.weightLabels || null
    } : prod);
    try { fs.writeFileSync(productsFallbackPath, JSON.stringify(fallbackProducts, null, 2), 'utf8'); } catch (fsErr) {}
    res.json({ message: "Product updated" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in PUT /api/products/:id:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Updating product in fallback JSON.");
    const idx = fallbackProducts.findIndex(prod => prod.id === id);
    if (idx !== -1) {
      fallbackProducts[idx] = {
        ...fallbackProducts[idx],
        name: p.name,
        category: p.category,
        price250g: Number(p.price250g) || 0,
        price500g: Number(p.price500g) || 0,
        price1kg: Number(p.price1kg) || 0,
        description: p.description || '',
        image: p.image || '',
        ingredients: p.ingredients || '',
        isBestseller: !!p.isBestseller,
        inStock: p.inStock !== false,
        isEcoPiece: !!p.isEcoPiece,
        weightLabels: p.weightLabels || null
      };
      try {
        fs.writeFileSync(productsFallbackPath, JSON.stringify(fallbackProducts, null, 2), 'utf8');
        res.json({ message: "Product updated (Fallback JSON)" });
      } catch (fsErr) {
        res.status(500).json({ error: "Failed to persist fallback product update: " + fsErr.message });
      }
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    fallbackProducts = fallbackProducts.filter(prod => prod.id !== id);
    try { fs.writeFileSync(productsFallbackPath, JSON.stringify(fallbackProducts, null, 2), 'utf8'); } catch (fsErr) {}
    res.json({ message: "Product deleted" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in DELETE /api/products/:id:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Deleting product from fallback JSON.");
    const idx = fallbackProducts.findIndex(prod => prod.id === id);
    if (idx !== -1) {
      fallbackProducts.splice(idx, 1);
      try {
        fs.writeFileSync(productsFallbackPath, JSON.stringify(fallbackProducts, null, 2), 'utf8');
        res.json({ message: "Product deleted (Fallback JSON)" });
      } catch (fsErr) {
        res.status(500).json({ error: "Failed to persist fallback product delete: " + fsErr.message });
      }
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  }
});

// --- CATEGORIES ---
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (error) {
    console.warn("Database offline. Returning categories from fallback JSON.");
    res.json(fallbackCategories);
  }
});

app.post('/api/categories', async (req, res) => {
  const { name, image, description } = req.body;
  try {
    await db.query(
      "INSERT INTO categories (name, image, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE image = ?, description = ?",
      [name, image || '', description || '', image || '', description || '']
    );
    // Keep fallback in sync
    const catIdx = fallbackCategories.findIndex(c => c.name === name);
    if (catIdx !== -1) {
      fallbackCategories[catIdx] = { name, image: image || '', description: description || '' };
    } else {
      fallbackCategories.push({ name, image: image || '', description: description || '' });
    }
    try { fs.writeFileSync(categoriesFallbackPath, JSON.stringify(fallbackCategories, null, 2), 'utf8'); } catch (fsErr) {}
    res.status(201).json({ message: "Category created" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in POST /api/categories:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Storing category in fallback JSON.");
    const catIdx = fallbackCategories.findIndex(c => c.name === name);
    if (catIdx !== -1) {
      fallbackCategories[catIdx] = { name, image: image || '', description: description || '' };
    } else {
      fallbackCategories.push({ name, image: image || '', description: description || '' });
    }
    try {
      fs.writeFileSync(categoriesFallbackPath, JSON.stringify(fallbackCategories, null, 2), 'utf8');
      res.status(201).json({ message: "Category created (Fallback JSON)" });
    } catch (fsErr) {
      res.status(500).json({ error: "Failed to persist fallback category: " + fsErr.message });
    }
  }
});

app.delete('/api/categories/:name', async (req, res) => {
  const { name } = req.params;
  try {
    await db.query("DELETE FROM categories WHERE name = ?", [name]);
    fallbackCategories = fallbackCategories.filter(c => c.name !== name);
    try { fs.writeFileSync(categoriesFallbackPath, JSON.stringify(fallbackCategories, null, 2), 'utf8'); } catch (fsErr) {}
    res.json({ message: "Category deleted" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in DELETE /api/categories/:name:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Deleting category from fallback JSON.");
    fallbackCategories = fallbackCategories.filter(c => c.name !== name);
    try {
      fs.writeFileSync(categoriesFallbackPath, JSON.stringify(fallbackCategories, null, 2), 'utf8');
      res.json({ message: "Category deleted (Fallback JSON)" });
    } catch (fsErr) {
      res.status(500).json({ error: "Failed to persist fallback category delete: " + fsErr.message });
    }
  }
});

app.put('/api/categories/:oldName/rename', async (req, res) => {
  const { oldName } = req.params;
  const { newName, image, description } = req.body;
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    
    await connection.query(
      "INSERT INTO categories (name, image, description) VALUES (?, ?, ?)",
      [newName, image || '', description || '']
    );
    await connection.query("UPDATE products SET category = ? WHERE category = ?", [newName, oldName]);
    await connection.query("DELETE FROM categories WHERE name = ?", [oldName]);
    
    await connection.commit();
    
    // Update fallback files in sync
    fallbackCategories = fallbackCategories.map(c => c.name === oldName ? { name: newName, image: image || '', description: description || '' } : c);
    try { fs.writeFileSync(categoriesFallbackPath, JSON.stringify(fallbackCategories, null, 2), 'utf8'); } catch (fsErr) {}

    fallbackProducts = fallbackProducts.map(p => p.category === oldName ? { ...p, category: newName } : p);
    try { fs.writeFileSync(productsFallbackPath, JSON.stringify(fallbackProducts, null, 2), 'utf8'); } catch (fsErr) {}

    res.json({ message: "Category renamed successfully" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    if (isDbConfigured) {
      console.error("Database error in PUT /api/categories/:oldName/rename:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Renaming category in fallback JSON files.");
    
    fallbackCategories = fallbackCategories.map(c => c.name === oldName ? { name: newName, image: image || '', description: description || '' } : c);
    try { fs.writeFileSync(categoriesFallbackPath, JSON.stringify(fallbackCategories, null, 2), 'utf8'); } catch (fsErr) {}

    fallbackProducts = fallbackProducts.map(p => p.category === oldName ? { ...p, category: newName } : p);
    try { fs.writeFileSync(productsFallbackPath, JSON.stringify(fallbackProducts, null, 2), 'utf8'); } catch (fsErr) {}

    res.json({ message: "Category renamed successfully (Fallback JSON)" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// --- ORDERS ---
app.get('/api/orders', async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders ORDER BY createdAt DESC");
    const [items] = await db.query(`
      SELECT oi.*, p.image 
      FROM order_items oi
      LEFT JOIN products p ON oi.productId = p.id
    `);

    // Group items by orderId
    const formatted = orders.map(order => {
      const orderItems = items
        .filter(item => item.orderId === order.id)
        .map(item => ({
          product: {
            id: item.productId,
            name: item.name,
            image: item.image
          },
          weight: item.weight,
          quantity: item.quantity,
          price: item.price
        }));

      return {
        ...order,
        items: orderItems
      };
    });
    
    res.json(formatted);
  } catch (error) {
    console.warn("Database offline. Returning orders from in-memory store.");
    res.json(memoryOrders);
  }
});

app.post('/api/orders', async (req, res) => {
  const { id, customerName, customerPhone, customerAddress, total, items } = req.body;
  const orderId = id || Date.now().toString();
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // format to YYYY-MM-DD HH:MM:SS

  const newOrder = {
    id: orderId,
    customerName,
    customerPhone,
    customerAddress,
    status: 'pending',
    createdAt,
    total,
    items: items.map(item => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        image: item.product.image || ''
      },
      weight: item.weight,
      quantity: item.quantity,
      price: item.price
    }))
  };

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Insert order
    await connection.query(
      `INSERT INTO orders (id, customerName, customerPhone, customerAddress, status, createdAt, total)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, customerName, customerPhone, customerAddress, 'pending', createdAt, total]
    );

    // 2. Insert items
    if (items && items.length > 0) {
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (orderId, productId, name, weight, quantity, price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, item.product.id, item.product.name, item.weight, item.quantity, item.price]
        );
      }
    }

    await connection.commit();
    connection.release();

    // Sync in-memory store & persist to fallback file
    const existingIdx = memoryOrders.findIndex(o => o.id === newOrder.id);
    if (existingIdx !== -1) {
      memoryOrders[existingIdx] = newOrder;
    } else {
      memoryOrders.unshift(newOrder);
    }
    try { fs.writeFileSync(ordersFallbackPath, JSON.stringify(memoryOrders, null, 2), 'utf8'); } catch (fsErr) {}

    res.status(201).json({ message: "Order placed successfully", id: orderId });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    if (isDbConfigured) {
      console.error("Database error in POST /api/orders:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Saving order to fallback JSON.");
    const existingIdx = memoryOrders.findIndex(o => o.id === newOrder.id);
    if (existingIdx !== -1) {
      memoryOrders[existingIdx] = newOrder;
    } else {
      memoryOrders.unshift(newOrder);
    }
    try {
      fs.writeFileSync(ordersFallbackPath, JSON.stringify(memoryOrders, null, 2), 'utf8');
      res.status(201).json({ message: "Order placed successfully (Fallback JSON)", id: orderId });
    } catch (fsErr) {
      res.status(500).json({ error: "Failed to persist fallback order: " + fsErr.message });
    }
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    let updated = false;
    memoryOrders.forEach(o => {
      if (o.id === id) {
        o.status = status;
        updated = true;
      }
    });
    if (updated) {
      try { fs.writeFileSync(ordersFallbackPath, JSON.stringify(memoryOrders, null, 2), 'utf8'); } catch (fsErr) {}
    }
    res.json({ message: "Order status updated" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in PUT /api/orders/:id/status:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Updating order status in fallback JSON.");
    let updated = false;
    memoryOrders.forEach(o => {
      if (o.id === id) {
        o.status = status;
        updated = true;
      }
    });
    if (updated) {
      try {
        fs.writeFileSync(ordersFallbackPath, JSON.stringify(memoryOrders, null, 2), 'utf8');
        res.json({ message: "Order status updated (Fallback JSON)" });
      } catch (fsErr) {
        res.status(500).json({ error: "Failed to persist fallback order update: " + fsErr.message });
      }
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  }
});

app.put('/api/orders/:id/tracking', async (req, res) => {
  const { id } = req.params;
  const { trackingLink } = req.body;
  try {
    await db.query("UPDATE orders SET trackingLink = ? WHERE id = ?", [trackingLink, id]);
    let updated = false;
    memoryOrders.forEach(o => {
      if (o.id === id) {
        o.trackingLink = trackingLink;
        updated = true;
      }
    });
    if (updated) {
      try { fs.writeFileSync(ordersFallbackPath, JSON.stringify(memoryOrders, null, 2), 'utf8'); } catch (fsErr) {}
    }
    res.json({ message: "Order tracking link updated" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in PUT /api/orders/:id/tracking:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Updating order tracking link in fallback JSON.");
    let updated = false;
    memoryOrders.forEach(o => {
      if (o.id === id) {
        o.trackingLink = trackingLink;
        updated = true;
      }
    });
    if (updated) {
      try {
        fs.writeFileSync(ordersFallbackPath, JSON.stringify(memoryOrders, null, 2), 'utf8');
        res.json({ message: "Order tracking link updated (Fallback JSON)" });
      } catch (fsErr) {
        res.status(500).json({ error: "Failed to persist fallback order tracking update: " + fsErr.message });
      }
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM orders WHERE id = ?", [id]);
    const filtered = memoryOrders.filter(o => o.id !== id);
    if (filtered.length !== memoryOrders.length) {
      memoryOrders.length = 0;
      memoryOrders.push(...filtered);
      try { fs.writeFileSync(ordersFallbackPath, JSON.stringify(memoryOrders, null, 2), 'utf8'); } catch (fsErr) {}
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in DELETE /api/orders/:id:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Deleting order from fallback JSON.");
    const filtered = memoryOrders.filter(o => o.id !== id);
    if (filtered.length !== memoryOrders.length) {
      memoryOrders.length = 0;
      memoryOrders.push(...filtered);
      try {
        fs.writeFileSync(ordersFallbackPath, JSON.stringify(memoryOrders, null, 2), 'utf8');
        res.json({ message: "Order deleted successfully (Fallback JSON)" });
      } catch (fsErr) {
        res.status(500).json({ error: "Failed to persist fallback order deletion: " + fsErr.message });
      }
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  }
});

// --- HERO SLIDES ---
app.get('/api/hero-slides', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hero_slides");
    res.json(rows);
  } catch (error) {
    console.warn("Database offline. Returning hero slides from fallback JSON.");
    try {
      if (fs.existsSync(heroSlidesFallbackPath)) {
        const fileSlides = JSON.parse(fs.readFileSync(heroSlidesFallbackPath, 'utf8'));
        if (fileSlides.length > fallbackHeroSlides.length) {
          fallbackHeroSlides = fileSlides;
        }
        return res.json(fileSlides);
      }
    } catch (fsErr) {
      console.warn("Failed to read fallback hero slides file, returning in-memory:", fsErr.message);
    }
    res.json(fallbackHeroSlides);
  }
});

app.post('/api/hero-slides', async (req, res) => {
  const { id, name, image, desc } = req.body;
  const slideId = id || `hs-${Date.now()}`;
  const slideRecord = { id: slideId, name: name || '', image, desc: desc || '' };
  try {
    await db.query(
      `INSERT INTO hero_slides (id, name, image, \`desc\`) VALUES (?, ?, ?, ?)`,
      [slideId, name || '', image, desc || '']
    );
    fallbackHeroSlides.unshift(slideRecord);
    try { fs.writeFileSync(heroSlidesFallbackPath, JSON.stringify(fallbackHeroSlides, null, 2), 'utf8'); } catch (fsErr) {}
    res.status(201).json({ message: "Hero slide added", id: slideId });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in POST /api/hero-slides:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Storing hero slide in fallback JSON.");
    fallbackHeroSlides.unshift(slideRecord);
    try {
      fs.writeFileSync(heroSlidesFallbackPath, JSON.stringify(fallbackHeroSlides, null, 2), 'utf8');
      res.status(201).json({ message: "Hero slide added (Fallback JSON)", id: slideId });
    } catch (fsErr) {
      res.status(500).json({ error: "Failed to persist fallback hero slide: " + fsErr.message });
    }
  }
});

app.put('/api/hero-slides/:id', async (req, res) => {
  const { id } = req.params;
  const { name, image, desc } = req.body;
  try {
    await db.query(
      `UPDATE hero_slides SET name = ?, image = ?, \`desc\` = ? WHERE id = ?`,
      [name || '', image, desc || '', id]
    );
    fallbackHeroSlides = fallbackHeroSlides.map(slide => slide.id === id ? { id, name: name || '', image, desc: desc || '' } : slide);
    try { fs.writeFileSync(heroSlidesFallbackPath, JSON.stringify(fallbackHeroSlides, null, 2), 'utf8'); } catch (fsErr) {}
    res.json({ message: "Hero slide updated" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in PUT /api/hero-slides/:id:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Updating hero slide in fallback JSON.");
    const index = fallbackHeroSlides.findIndex(slide => slide.id === id);
    if (index !== -1) {
      fallbackHeroSlides[index] = { id, name: name || '', image, desc: desc || '' };
      try {
        fs.writeFileSync(heroSlidesFallbackPath, JSON.stringify(fallbackHeroSlides, null, 2), 'utf8');
        res.json({ message: "Hero slide updated (Fallback JSON)" });
      } catch (fsErr) {
        res.status(500).json({ error: "Failed to persist fallback hero slide update: " + fsErr.message });
      }
    } else {
      res.status(404).json({ error: "Hero slide not found" });
    }
  }
});

app.delete('/api/hero-slides/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM hero_slides WHERE id = ?", [id]);
    fallbackHeroSlides = fallbackHeroSlides.filter(slide => slide.id !== id);
    try { fs.writeFileSync(heroSlidesFallbackPath, JSON.stringify(fallbackHeroSlides, null, 2), 'utf8'); } catch (fsErr) {}
    res.json({ message: "Hero slide deleted" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in DELETE /api/hero-slides/:id:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Deleting hero slide from fallback JSON.");
    const index = fallbackHeroSlides.findIndex(slide => slide.id === id);
    if (index !== -1) {
      fallbackHeroSlides.splice(index, 1);
      try {
        fs.writeFileSync(heroSlidesFallbackPath, JSON.stringify(fallbackHeroSlides, null, 2), 'utf8');
        res.json({ message: "Hero slide deleted (Fallback JSON)" });
      } catch (fsErr) {
        res.status(500).json({ error: "Failed to persist fallback hero slide deletion: " + fsErr.message });
      }
    } else {
      res.status(404).json({ error: "Hero slide not found" });
    }
  }
});

// --- SHOPPABLE VIDEOS ---
app.get('/api/videos', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM watch_buy_videos ORDER BY createdAt DESC");
    res.json(rows);
  } catch (error) {
    console.warn("Database offline. Returning videos from fallback JSON.");
    res.json(fallbackVideos);
  }
});

// Single Video Upload Endpoint
app.post('/api/videos/upload', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided." });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, videoUrl: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/videos', async (req, res) => {
  const { id, videoUrl, title, desc, keyword } = req.body;
  const videoId = id || `wb-${Date.now()}`;
  const videoRecord = { id: videoId, videoUrl, title, desc: desc || '', keyword };

  try {
    await db.query(
      `INSERT INTO watch_buy_videos (id, videoUrl, title, \`desc\`, keyword) VALUES (?, ?, ?, ?, ?)`,
      [videoId, videoUrl, title, desc || '', keyword]
    );
    res.status(201).json({ message: "Video record created", id: videoId });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in POST /api/videos:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Storing video record in fallback JSON.");
    fallbackVideos.unshift(videoRecord);
    try {
      fs.writeFileSync(videosFallbackPath, JSON.stringify(fallbackVideos, null, 2), 'utf8');
      res.status(201).json({ message: "Video record created (Fallback JSON)", id: videoId });
    } catch (fsErr) {
      res.status(500).json({ error: "Failed to persist fallback record: " + fsErr.message });
    }
  }
});

app.put('/api/videos/:id', async (req, res) => {
  const { id } = req.params;
  const { videoUrl, title, desc, keyword } = req.body;

  try {
    await db.query(
      `UPDATE watch_buy_videos SET videoUrl = ?, title = ?, \`desc\` = ?, keyword = ? WHERE id = ?`,
      [videoUrl, title, desc || '', keyword, id]
    );
    const v = fallbackVideos.find(item => item.id === id);
    if (v) {
      v.videoUrl = videoUrl;
      v.title = title;
      v.desc = desc || '';
      v.keyword = keyword;
    }
    res.json({ message: "Video record updated" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in PUT /api/videos/:id:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Updating video record in fallback JSON.");
    const v = fallbackVideos.find(item => item.id === id);
    if (v) {
      v.videoUrl = videoUrl;
      v.title = title;
      v.desc = desc || '';
      v.keyword = keyword;
      try {
        fs.writeFileSync(videosFallbackPath, JSON.stringify(fallbackVideos, null, 2), 'utf8');
        res.json({ message: "Video record updated (Fallback JSON)" });
      } catch (fsErr) {
        res.status(500).json({ error: "Failed to persist fallback update: " + fsErr.message });
      }
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  const { id } = req.params;

  const deleteDiskFile = (videoRecord) => {
    if (videoRecord && videoRecord.videoUrl.startsWith('/uploads/')) {
      const filename = videoRecord.videoUrl.split('/').pop();
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted video file: ${filePath}`);
        } catch (err) {
          console.warn(`Failed to delete video file on disk: ${err.message}`);
        }
      }
    }
  };

  try {
    let videoRecord = null;
    try {
      const [rows] = await db.query("SELECT * FROM watch_buy_videos WHERE id = ?", [id]);
      if (rows.length > 0) videoRecord = rows[0];
    } catch (dbErr) {
      // ignore
    }

    await db.query("DELETE FROM watch_buy_videos WHERE id = ?", [id]);
    
    const idx = fallbackVideos.findIndex(v => v.id === id);
    if (idx !== -1) {
      videoRecord = fallbackVideos[idx];
      fallbackVideos.splice(idx, 1);
    }

    if (videoRecord) {
      deleteDiskFile(videoRecord);
    }

    res.json({ message: "Video record deleted" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in DELETE /api/videos/:id:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Deleting video record from fallback JSON.");
    const idx = fallbackVideos.findIndex(v => v.id === id);
    if (idx !== -1) {
      const videoRecord = fallbackVideos[idx];
      deleteDiskFile(videoRecord);
      fallbackVideos.splice(idx, 1);
      try {
        fs.writeFileSync(videosFallbackPath, JSON.stringify(fallbackVideos, null, 2), 'utf8');
        res.json({ message: "Video record deleted (Fallback JSON)" });
      } catch (fsErr) {
        res.status(500).json({ error: "Failed to persist fallback delete: " + fsErr.message });
      }
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  }
});

// --- USER OTP AUTH ---
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    try {
      const expiresStr = expiresAt.toISOString().slice(0, 19).replace('T', ' '); // format to YYYY-MM-DD HH:MM:SS
      await db.query(
        `INSERT INTO user_otps (email, otp, expiresAt) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE otp = ?, expiresAt = ?`,
        [email, otp, expiresStr, otp, expiresStr]
      );
      console.log(`Saved OTP ${otp} to MySQL for ${email}`);
    } catch (dbErr) {
      console.warn(`Database offline. Falling back to in-memory OTP storage. OTP for ${email} is ${otp}`);
      memoryOtpStore.set(email, { otp, expiresAt });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"SVADA FARMS" <svadafarms@gmail.com>',
      to: email,
      subject: `SVADA FARMS Account Verification Code: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              width: 100% !important;
              background-color: #faf7f2;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
            /* Mobile responsive overrides */
            @media only screen and (max-width: 600px) {
              .email-container {
                width: 100% !important;
                max-width: 100% !important;
                padding: 10px !important;
              }
              .content-card {
                padding: 24px 16px !important;
                border-radius: 16px !important;
              }
              .otp-box {
                font-size: 28px !important;
                letter-spacing: 4px !important;
                padding: 15px !important;
              }
            }
          </style>
        </head>
        <body style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf7f2; margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf7f2; padding: 20px 10px;">
            <tr>
              <td align="center" valign="top">
                <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 20px; border: 1px solid #f3ebe1; box-shadow: 0 4px 10px rgba(59, 30, 10, 0.02); overflow: hidden;">
                  <tr>
                    <td height="6" style="background: linear-gradient(to right, #3b1e0a, #c2824b); line-height: 6px; font-size: 6px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td class="content-card" style="padding: 35px 25px; text-align: center; color: #3b1e0a;">
                      <div style="font-size: 24px; font-weight: 800; letter-spacing: 1px; color: #3b1e0a; margin-bottom: 20px;">
                        SVADA <span style="color: #c2824b;">FARMS</span>
                      </div>
                      <div style="height: 1px; background-color: #f3ebe1; margin-bottom: 25px;"></div>
                      
                      <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 10px 0; color: #3b1e0a;">Account Authentication</h2>
                      <p style="font-size: 13px; line-height: 1.5; color: #736b63; margin: 0 0 25px 0;">
                        Please use the secure verification code below to access your SVADA account. This code is valid for 5 minutes.
                      </p>
                      
                      <div class="otp-box" style="background-color: #faf7f2; border: 1px dashed #c2824b; border-radius: 12px; padding: 18px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #3b1e0a; display: inline-block; padding-left: 24px; margin-bottom: 25px; font-family: Courier, monospace;">
                        ${otp}
                      </div>
                      
                      <p style="font-size: 11px; line-height: 1.4; color: #b0a79f; margin: 0;">
                        If you did not request this code, you can safely ignore this email.
                      </p>
                      
                      <div style="height: 1px; background-color: #f3ebe1; margin-top: 30px; margin-bottom: 20px;"></div>
                      
                      <p style="font-size: 9px; line-height: 1.4; color: #b0a79f; margin: 0;">
                        Freshly prepared, solar-cured, and hygienically packed on demand.<br />
                        © ${new Date().getFullYear()} SVADA Homemade Farms. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ error: "Failed to dispatch verification email. Please try again." });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp, name, phone } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP code are required." });
  }

  try {
    let matchedRecord = null;
    let dbUsed = true;

    try {
      const [rows] = await db.query(
        `SELECT * FROM user_otps WHERE email = ? AND otp = ?`,
        [email, otp]
      );
      if (rows.length > 0) {
        matchedRecord = rows[0];
      }
    } catch (dbErr) {
      console.warn("Database offline. Reading OTP from in-memory storage.");
      dbUsed = false;
      const memRecord = memoryOtpStore.get(email);
      if (memRecord && memRecord.otp === otp) {
        matchedRecord = memRecord;
      }
    }

    if (!matchedRecord) {
      return res.status(401).json({ error: "Invalid verification code." });
    }

    const now = new Date();
    const expiresAt = new Date(matchedRecord.expiresAt);
    if (now > expiresAt) {
      if (dbUsed) {
        await db.query(`DELETE FROM user_otps WHERE email = ?`, [email]);
      } else {
        memoryOtpStore.delete(email);
      }
      return res.status(401).json({ error: "Verification code has expired." });
    }

    if (dbUsed) {
      await db.query(`DELETE FROM user_otps WHERE email = ?`, [email]);
    } else {
      memoryOtpStore.delete(email);
    }
    
    const namePrefix = email.split('@')[0].toUpperCase();
    const finalName = name || namePrefix;
    const finalPhone = phone || '';

    await saveOrUpdateUser(email, finalName, finalPhone);

    res.json({
      success: true,
      user: {
        name: finalName,
        email: email,
        phone: finalPhone
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Verification process encountered an error." });
  }
});

// Record user login details (e.g. from Google Login)
app.post('/api/auth/record-login', async (req, res) => {
  const { email, name, phone, isSync } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    if (isSync) {
      let exists = false;
      try {
        const [rows] = await db.query("SELECT email FROM users WHERE email = ?", [email]);
        if (rows && rows.length > 0) {
          exists = true;
        }
      } catch (dbErr) {
        // Fallback check
        exists = memoryUsers.some(u => u.email === email);
      }
      if (!exists) {
        return res.status(404).json({ error: "User deleted or not found", deleted: true });
      }
    }

    const namePrefix = email.split('@')[0].toUpperCase();
    await saveOrUpdateUser(email, name || namePrefix, phone || '');
    res.json({ success: true });
  } catch (error) {
    console.error("Error recording user login:", error);
    res.status(500).json({ error: "Failed to record login details." });
  }
});

// Fetch all registered/logged-in users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY lastLogin DESC");
    res.json(rows);
  } catch (error) {
    console.warn("Database offline. Returning users from fallback JSON.");
    res.json(memoryUsers.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)));
  }
});

// Delete user by email
app.delete('/api/users/:email', async (req, res) => {
  const { email } = req.params;
  try {
    await db.query("DELETE FROM users WHERE email = ?", [email]);
    const filtered = memoryUsers.filter(u => u.email !== email);
    memoryUsers.length = 0;
    memoryUsers.push(...filtered);
    try {
      fs.writeFileSync(usersFallbackPath, JSON.stringify(memoryUsers, null, 2), 'utf8');
    } catch (_) {}
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in DELETE /api/users/:email:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Deleting user from fallback JSON.");
    const filtered = memoryUsers.filter(u => u.email !== email);
    memoryUsers.length = 0;
    memoryUsers.push(...filtered);
    try {
      fs.writeFileSync(usersFallbackPath, JSON.stringify(memoryUsers, null, 2), 'utf8');
      res.json({ message: "User deleted successfully (Fallback JSON)" });
    } catch (fsErr) {
      console.error(fsErr);
      res.status(500).json({ error: "Failed to persist fallback user deletion: " + fsErr.message });
    }
  }
});

// --- RAZORPAY PAYMENT GATEWAY ---
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: receipt || `svada_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order', details: error.message });
  }
});

// Verify Razorpay payment and record order
app.post('/api/payments/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      customerPhone,
      customerAddress,
      total,
      items
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Payment verification failed. Invalid signature.' });
    }

    // Payment is verified — record the order
    const orderId = `RP-${razorpay_payment_id}`;
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const newOrder = {
      id: orderId,
      customerName,
      customerPhone,
      customerAddress,
      status: 'pending',
      createdAt,
      total,
      razorpay_order_id,
      razorpay_payment_id,
      items: (items || []).map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image || ''
        },
        weight: item.weight,
        quantity: item.quantity,
        price: item.price
      }))
    };

    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      await connection.query(
        `INSERT INTO orders (id, customerName, customerPhone, customerAddress, status, createdAt, total)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, customerName, customerPhone, customerAddress, 'pending', createdAt, total]
      );

      if (items && items.length > 0) {
        for (const item of items) {
          await connection.query(
            `INSERT INTO order_items (orderId, productId, name, weight, quantity, price)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [orderId, item.product.id, item.product.name, item.weight, item.quantity, item.price]
          );
        }
      }

      await connection.commit();
    } catch (dbErr) {
      if (connection) await connection.rollback();
      console.warn('DB offline, saving Razorpay order to fallback:', dbErr.message);
    } finally {
      if (connection) connection.release();
    }

    // Also sync in-memory store
    const existingIdx = memoryOrders.findIndex(o => o.id === newOrder.id);
    if (existingIdx !== -1) {
      memoryOrders[existingIdx] = newOrder;
    } else {
      memoryOrders.unshift(newOrder);
    }
    try { fs.writeFileSync(ordersFallbackPath, JSON.stringify(memoryOrders, null, 2), 'utf8'); } catch (_) {}

    res.json({ success: true, orderId, message: 'Payment verified and order placed successfully.' });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    res.status(500).json({ success: false, error: 'Payment verification error', details: error.message });
  }
});

// --- ADMIN AUTH ---
async function getAdminCredentials() {
  let email = process.env.VITE_ADMIN_EMAIL || 'svadafarms@gmail.com';
  let password = process.env.VITE_ADMIN_PASSWORD || 'admin123';
  
  try {
    const [emailRows] = await db.query("SELECT value_name FROM settings WHERE key_name = 'admin_email'");
    if (emailRows.length > 0) {
      email = emailRows[0].value_name;
    }
    const [passRows] = await db.query("SELECT value_name FROM settings WHERE key_name = 'admin_password'");
    if (passRows.length > 0) {
      password = passRows[0].value_name;
    }
  } catch (err) {
    if (fallbackSettings.admin_email) email = fallbackSettings.admin_email;
    if (fallbackSettings.admin_password) password = fallbackSettings.admin_password;
  }
  return { email, password };
}

async function setAdminPassword(newPassword) {
  try {
    await db.query(
      `INSERT INTO settings (key_name, value_name) 
       VALUES ('admin_password', ?) 
       ON DUPLICATE KEY UPDATE value_name = ?`,
      [newPassword, newPassword]
    );
  } catch (err) {
    console.warn("DB offline, updating admin password in fallback JSON");
  }
  fallbackSettings.admin_password = newPassword;
  try {
    fs.writeFileSync(settingsFallbackPath, JSON.stringify(fallbackSettings, null, 2), 'utf8');
  } catch (fsErr) {
    console.warn("Failed to save settings fallback:", fsErr.message);
  }
}

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await getAdminCredentials();
  
  const isValidEmail = 
    email === admin.email || 
    email === 'admin@svadafarms.com' || 
    email === 'admin@svadafoods.com' || 
    email === 'svadafarms@gmail.com';

  if (isValidEmail && password === admin.password) {
    res.json({ success: true, token: 'admin-session-token' });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post('/api/admin/forgot-password', async (req, res) => {
  const { email } = req.body;
  const admin = await getAdminCredentials();
  
  const isValidEmail = 
    email === admin.email || 
    email === 'admin@svadafarms.com' || 
    email === 'admin@svadafoods.com' || 
    email === 'svadafarms@gmail.com';

  if (!isValidEmail) {
    return res.status(400).json({ error: "Provided email is not a registered admin email address." });
  }

  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    const targetEmail = 'svadafarms@gmail.com';

    let dbUsed = true;
    try {
      const expiresStr = expiresAt.toISOString().slice(0, 19).replace('T', ' ');
      await db.query(
        `INSERT INTO admin_reset_tokens (email, token, expiresAt) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE token = ?, expiresAt = ?`,
        [targetEmail, token, expiresStr, token, expiresStr]
      );
      console.log(`Saved Admin Reset Token for ${targetEmail}`);
    } catch (dbErr) {
      console.warn(`Database offline. Using fallback memory store for Admin Reset Token.`);
      dbUsed = false;
      memoryAdminResetTokens.set(targetEmail, { token, expiresAt });
    }

    const origin = req.headers.origin || 'http://localhost:3000';
    const resetLink = `${origin}/admin-reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || '"SVADA FARMS" <svadafarms@gmail.com>',
      to: 'svadafarms@gmail.com',
      subject: `SVADA FARMS Admin Panel Password Reset Link`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              width: 100% !important;
              background-color: #faf7f2;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
            @media only screen and (max-width: 600px) {
              .email-container {
                width: 100% !important;
                max-width: 100% !important;
                padding: 10px !important;
              }
              .content-card {
                padding: 24px 16px !important;
                border-radius: 16px !important;
              }
            }
          </style>
        </head>
        <body style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf7f2; margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf7f2; padding: 20px 10px;">
            <tr>
              <td align="center" valign="top">
                <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 20px; border: 1px solid #f3ebe1; box-shadow: 0 4px 10px rgba(59, 30, 10, 0.02); overflow: hidden;">
                  <tr>
                    <td height="6" style="background: linear-gradient(to right, #3b1e0a, #c2824b); line-height: 6px; font-size: 6px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td class="content-card" style="padding: 35px 25px; text-align: center; color: #3b1e0a;">
                      <div style="font-size: 24px; font-weight: 800; letter-spacing: 1px; color: #3b1e0a; margin-bottom: 20px;">
                        SVADA <span style="color: #c2824b;">FARMS</span>
                      </div>
                      <div style="height: 1px; background-color: #f3ebe1; margin-bottom: 25px;"></div>
                      
                      <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 10px 0; color: #3b1e0a;">Admin Password Reset Request</h2>
                      <p style="font-size: 13px; line-height: 1.5; color: #736b63; margin: 0 0 25px 0;">
                        We received a request to reset your SVADA admin account password. Click the secure button below to choose a new password. This link is valid for 15 minutes.
                      </p>
                      
                      <a href="${resetLink}" target="_blank" style="background-color: #3b1e0a; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 10px; display: inline-block; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(59, 30, 10, 0.15);">
                        Reset My Password
                      </a>

                      <p style="font-size: 11px; line-height: 1.5; color: #736b63; margin: 0 0 25px 0; text-align: left; word-break: break-all;">
                        If the button doesn't work, copy and paste this URL into your browser:<br/>
                        <span style="color: #c2824b;">${resetLink}</span>
                      </p>
                      
                      <p style="font-size: 11px; line-height: 1.4; color: #b0a79f; margin: 0;">
                        If you did not request a password reset, you can safely ignore this email.
                      </p>
                      
                      <div style="height: 1px; background-color: #f3ebe1; margin-top: 30px; margin-bottom: 20px;"></div>
                      
                      <p style="font-size: 9px; line-height: 1.4; color: #b0a79f; margin: 0;">
                        © ${new Date().getFullYear()} SVADA Homemade Farms. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "A secure password reset link has been sent to svadafarms@gmail.com." });
  } catch (error) {
    console.error("Error sending admin reset link:", error);
    res.status(500).json({ error: "Failed to dispatch recovery email: " + error.message });
  }
});

app.post('/api/admin/reset-password-with-token', async (req, res) => {
  const { token, newPassword } = req.body;
  const targetEmail = 'svadafarms@gmail.com';

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required." });
  }

  try {
    let matchedRecord = null;
    let dbUsed = true;

    try {
      const [rows] = await db.query(
        `SELECT * FROM admin_reset_tokens WHERE token = ?`,
        [token]
      );
      if (rows.length > 0) {
        matchedRecord = rows[0];
      }
    } catch (dbErr) {
      console.warn("Database offline. Checking Reset Token in memory fallback.");
      dbUsed = false;
      for (const [email, record] of memoryAdminResetTokens.entries()) {
        if (record.token === token) {
          matchedRecord = { email, ...record };
          break;
        }
      }
    }

    if (!matchedRecord) {
      return res.status(400).json({ error: "Invalid or expired password reset link." });
    }

    const now = new Date();
    const expiresAt = new Date(matchedRecord.expiresAt);
    if (now > expiresAt) {
      if (dbUsed) {
        await db.query(`DELETE FROM admin_reset_tokens WHERE email = ?`, [matchedRecord.email]);
      } else {
        memoryAdminResetTokens.delete(matchedRecord.email);
      }
      return res.status(400).json({ error: "The password reset link has expired." });
    }

    if (dbUsed) {
      await db.query(`DELETE FROM admin_reset_tokens WHERE email = ?`, [matchedRecord.email]);
    } else {
      memoryAdminResetTokens.delete(matchedRecord.email);
    }

    await setAdminPassword(newPassword);

    res.json({ success: true, message: "Admin password updated successfully. You can now login." });
  } catch (error) {
    console.error("Error resetting admin password via token:", error);
    res.status(500).json({ error: "Password reset process encountered an error: " + error.message });
  }
});

// --- SETTINGS ---
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM settings");
    const settingsMap = {};
    rows.forEach(r => { settingsMap[r.key_name] = r.value_name; });
    res.json(settingsMap);
  } catch (error) {
    console.warn("Database offline. Returning settings from fallback JSON.");
    res.json(fallbackSettings);
  }
});

app.post('/api/settings', async (req, res) => {
  const newSettings = req.body;
  try {
    for (const [key, value] of Object.entries(newSettings)) {
      await db.query(
        `INSERT INTO settings (key_name, value_name) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE value_name = ?`,
        [key, String(value), String(value)]
      );
      fallbackSettings[key] = String(value);
    }
    try { fs.writeFileSync(settingsFallbackPath, JSON.stringify(fallbackSettings, null, 2), 'utf8'); } catch (_) {}
    res.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    if (isDbConfigured) {
      console.error("Database error in POST /api/settings:", error);
      return res.status(500).json({ error: "Database operation failed: " + getDbErrorMessage(error) });
    }
    console.warn("Database offline. Storing settings in fallback JSON.");
    for (const [key, value] of Object.entries(newSettings)) {
      fallbackSettings[key] = String(value);
    }
    try {
      fs.writeFileSync(settingsFallbackPath, JSON.stringify(fallbackSettings, null, 2), 'utf8');
      res.json({ success: true, message: "Settings updated (Fallback JSON)" });
    } catch (fsErr) {
      res.status(500).json({ error: "Failed to persist fallback settings: " + fsErr.message });
    }
  }
});

// Fallback non-API client requests to index.html (React Router)
app.get(/^(?!\/api\/).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await checkAndInitDatabase();
});


