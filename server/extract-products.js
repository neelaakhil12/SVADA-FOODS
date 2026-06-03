import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const shopContextPath = path.join(__dirname, '../src/context/ShopContext.jsx');
let content = fs.readFileSync(shopContextPath, 'utf8');

// Strip React imports and context creation
content = content.replace("import React, { createContext, useState, useEffect } from 'react';", "");
content = content.replace("export const ShopContext = createContext();", "");

// Keep only constants up to the ShopProvider declaration
const providerIndex = content.indexOf('export const ShopProvider');
if (providerIndex !== -1) {
  content = content.substring(0, providerIndex);
}

// Log JSON block at the end
content += "\nconsole.log(JSON.stringify({ PRODUCTS_DATA, DEFAULT_CATEGORY_METADATA }));\n";

const tempPath = path.join(__dirname, 'temp-extract.js');
fs.writeFileSync(tempPath, content, 'utf8');

try {
  // Execute and write output to initial-data.json
  const output = execSync(`node "${tempPath}"`, { maxBuffer: 1024 * 1024 * 10 });
  fs.writeFileSync(path.join(__dirname, 'initial-data.json'), output.toString(), 'utf8');
  console.log("Successfully extracted products and categories to server/initial-data.json!");
} catch (err) {
  console.error("Error during extraction:", err);
} finally {
  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }
}


