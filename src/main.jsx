import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ultimate crash-safe Storage Polyfill for Safari / Private Browsing / Quota Limitations
(function() {
  const memStore = {};
  let isAvailable = true;
  
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
  } catch (e) {
    isAvailable = false;
  }

  const cleanBase64Images = (obj) => {
    if (!obj) return obj;
    if (typeof obj === 'string') {
      return obj.startsWith('data:image/') ? '' : obj;
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

  const safeSetItem = (originalFn) => {
    return function(key, value) {
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
        if (isAvailable && originalFn) {
          originalFn.call(localStorage, key, valueToStore);
        } else {
          memStore[key] = String(valueToStore);
        }
      } catch (error) {
        console.warn(`localStorage.setItem failed for key "${key}":`, error);
        memStore[key] = String(value);
      }
    };
  };

  const safeGetItem = (originalFn) => {
    return function(key) {
      try {
        if (isAvailable && originalFn) {
          return originalFn.call(localStorage, key);
        }
        return key in memStore ? memStore[key] : null;
      } catch (error) {
        console.warn(`localStorage.getItem failed for key "${key}":`, error);
        return key in memStore ? memStore[key] : null;
      }
    };
  };

  const safeRemoveItem = (originalFn) => {
    return function(key) {
      try {
        if (isAvailable && originalFn) {
          originalFn.call(localStorage, key);
        }
        delete memStore[key];
      } catch (error) {
        console.warn(`localStorage.removeItem failed for key "${key}":`, error);
        delete memStore[key];
      }
    };
  };

  if (isAvailable) {
    localStorage.setItem = safeSetItem(localStorage.setItem);
    localStorage.getItem = safeGetItem(localStorage.getItem);
    localStorage.removeItem = safeRemoveItem(localStorage.removeItem);
  } else {
    const mockStorage = {
      getItem: safeGetItem(null),
      setItem: safeSetItem(null),
      removeItem: safeRemoveItem(null),
      clear: () => { for (const k in memStore) delete memStore[k]; },
      key: (idx) => Object.keys(memStore)[idx] || null,
      get length() { return Object.keys(memStore).length; }
    };
    try {
      Object.defineProperty(window, 'localStorage', { value: mockStorage, configurable: true });
    } catch (_) {
      try {
        Storage.prototype.getItem = mockStorage.getItem;
        Storage.prototype.setItem = mockStorage.setItem;
        Storage.prototype.removeItem = mockStorage.removeItem;
        Storage.prototype.clear = mockStorage.clear;
      } catch (err) {
        console.error("Storage polyfill error:", err);
      }
    }
  }
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



