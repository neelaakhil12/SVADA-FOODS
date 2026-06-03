import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './db.js';
import nodemailer from 'nodemailer';
import multer from 'multer';

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

// In-Memory Fallback Stores (used if MySQL is offline)
const memoryOtpStore = new Map();
const memoryOrders = [];
let fallbackProducts = [];
let fallbackCategories = [];
let fallbackVideos = [];

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

try {
  const initialDataPath = path.join(__dirname, 'initial-data.json');
  if (fs.existsSync(initialDataPath)) {
    const { PRODUCTS_DATA, DEFAULT_CATEGORY_METADATA } = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
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
    fallbackCategories = Object.entries(DEFAULT_CATEGORY_METADATA).map(([name, meta]) => ({
      name,
      image: meta.image || '',
      description: meta.desc || ''
    }));
  }
} catch (err) {
  console.warn("Failed to load initial fallback data:", err.message);
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
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));


// Serve React build static files in production
app.use(express.static(path.join(__dirname, '../dist')));

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
  try {
    const p = req.body;
    const id = p.id || Date.now().toString();
    const weightLabels = p.weightLabels ? JSON.stringify(p.weightLabels) : null;
    
    await db.query(
      `INSERT INTO products (id, name, category, price250g, price500g, price1kg, rating, reviews, description, image, ingredients, isBestseller, inStock, isEcoPiece, weightLabels)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, p.name, p.category, p.price250g || 0, p.price500g || 0, p.price1kg || 0,
        p.rating || 0, p.reviews || 0, p.description || '', p.image || '', p.ingredients || '',
        p.isBestseller ? 1 : 0, p.inStock !== false ? 1 : 0, p.isEcoPiece ? 1 : 0, weightLabels
      ]
    );
    res.status(201).json({ message: "Product created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;
    const weightLabels = p.weightLabels ? JSON.stringify(p.weightLabels) : null;

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
    res.json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  try {
    const { name, image, description } = req.body;
    await db.query(
      "INSERT INTO categories (name, image, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE image = ?, description = ?",
      [name, image || '', description || '', image || '', description || '']
    );
    res.status(201).json({ message: "Category created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:name', async (req, res) => {
  try {
    const { name } = req.params;
    await db.query("DELETE FROM categories WHERE name = ?", [name]);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories/:oldName/rename', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { oldName } = req.params;
    const { newName, image, description } = req.body;
    
    // 1. Insert new category
    await connection.query(
      "INSERT INTO categories (name, image, description) VALUES (?, ?, ?)",
      [newName, image || '', description || '']
    );
    // 2. Update products category
    await connection.query("UPDATE products SET category = ? WHERE category = ?", [newName, oldName]);
    // 3. Delete old category
    await connection.query("DELETE FROM categories WHERE name = ?", [oldName]);
    
    await connection.commit();
    res.json({ message: "Category renamed successfully" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
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

    // Sync in-memory store
    memoryOrders.unshift({
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
    });

    res.status(201).json({ message: "Order placed successfully", id: orderId });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.warn("Database offline. Saving order in-memory.");
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
    memoryOrders.unshift(newOrder);
    res.status(201).json({ message: "Order placed successfully (In-Memory Fallback)", id: orderId });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    const order = memoryOrders.find(o => o.id === id);
    if (order) order.status = status;
    res.json({ message: "Order status updated" });
  } catch (error) {
    console.warn("Database offline. Updating order status in-memory.");
    const order = memoryOrders.find(o => o.id === id);
    if (order) {
      order.status = status;
      res.json({ message: "Order status updated (In-Memory Fallback)" });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM orders WHERE id = ?", [id]);
    const idx = memoryOrders.findIndex(o => o.id === id);
    if (idx !== -1) memoryOrders.splice(idx, 1);
    res.json({ message: "Order deleted" });
  } catch (error) {
    console.warn("Database offline. Deleting order in-memory.");
    const idx = memoryOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
      memoryOrders.splice(idx, 1);
      res.json({ message: "Order deleted (In-Memory Fallback)" });
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
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hero-slides', async (req, res) => {
  try {
    const { id, name, image, desc } = req.body;
    const slideId = id || `hs-${Date.now()}`;
    await db.query(
      `INSERT INTO hero_slides (id, name, image, \`desc\`) VALUES (?, ?, ?, ?)`,
      [slideId, name || '', image, desc || '']
    );
    res.status(201).json({ message: "Hero slide added", id: slideId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/hero-slides/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, desc } = req.body;
    await db.query(
      `UPDATE hero_slides SET name = ?, image = ?, \`desc\` = ? WHERE id = ?`,
      [name || '', image, desc || '', id]
    );
    res.json({ message: "Hero slide updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/hero-slides/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM hero_slides WHERE id = ?", [id]);
    res.json({ message: "Hero slide deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      console.warn("Database offline. Falling back to in-memory OTP storage.");
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
  const { email, otp } = req.body;
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

    res.json({
      success: true,
      user: {
        name: namePrefix,
        email: email
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Verification process encountered an error." });
  }
});

// --- ADMIN AUTH ---
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@svadafarms.com' && password === 'admin123') {
    res.json({ success: true, token: 'admin-session-token' });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Fallback all other client requests to index.html (React routing)
app.get(/^(.*)$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await checkAndInitDatabase();
});


