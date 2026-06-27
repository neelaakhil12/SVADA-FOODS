import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Intercept localStorage.setItem to strip large base64 image strings and handle QuotaExceededError gracefully
const cleanBase64Images = (obj) => {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('data:image/')) {
      return '';
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanBase64Images);
  }
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const [key, val] of Object.entries(obj)) {
      if (key === 'image' && typeof val === 'string' && val.startsWith('data:image/')) {
        cleaned[key] = '';
      } else {
        cleaned[key] = cleanBase64Images(val);
      }
    }
    return cleaned;
  }
  return obj;
};

const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  try {
    let valueToStore = value;
    if (typeof value === 'string' && value.includes('data:image/')) {
      try {
        const parsed = JSON.parse(value);
        const cleaned = cleanBase64Images(parsed);
        valueToStore = JSON.stringify(cleaned);
      } catch (_) {
        if (value.startsWith('data:image/')) {
          valueToStore = '';
        }
      }
    }
    originalSetItem.call(localStorage, key, valueToStore);
  } catch (error) {
    console.warn(`localStorage.setItem failed for key "${key}":`, error);
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



