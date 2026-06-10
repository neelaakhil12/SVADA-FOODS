import React, { useState, useEffect, useContext } from 'react';
import { ShopProvider, ShopContext } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import QuickViewModal from './components/QuickViewModal';
import SplashScreen from './components/SplashScreen';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Privacy from './pages/Privacy';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import Terms from './pages/Terms';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Account from './pages/Account';
import PromoPopup from './components/PromoPopup';

// AOS Scroll Animations
import AOS from 'aos';
import 'aos/dist/aos.css';

// Lucide icon for support
import { MessageCircle } from 'lucide-react';

function AppContent({ showSplash }) {
  const { currentPage, setCurrentPage } = useContext(ShopContext);
  
  // Sidebar drawers active states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartActiveTab, setCartActiveTab] = useState('cart'); // 'cart' | 'wishlist'

  // URL-based routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path === '/admin-login') {
      setCurrentPage('admin-login');
    } else if (path === '/products') {
      setCurrentPage('products');
    } else if (path === '/about') {
      setCurrentPage('about');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/account') {
      setCurrentPage('account');
    }
  }, [setCurrentPage]);

  // Update browser URL and dynamic SEO page headers when page changes
  useEffect(() => {
    const urlMap = {
      'home': '/',
      'products': '/products',
      'about': '/about',
      'contact': '/contact',
      'login': '/login',
      'account': '/account',
      'admin-login': '/admin-login',
      'admin': '/admin',
      'privacy': '/privacy',
      'shipping': '/shipping',
      'refund': '/refund',
      'terms': '/terms'
    };
    
    if (urlMap[currentPage] && window.location.pathname !== urlMap[currentPage]) {
      window.history.pushState({}, '', urlMap[currentPage]);
    }

    // Dynamic SEO Configuration Map
    const seoConfig = {
      'home': {
        title: 'SVADA Homemade Farms - Authentic Telugu Pickles, Sweets & Healthy Organic Products',
        description: 'Savor SVADA\'s authentic Telugu homemade foods, pickles (Mamidikaya Avakaya, Gongura, Kakarakaya), fresh spices, stone-ground flours, dry-fruit laddus, and eco-friendly utilities made cleanly with love and zero chemical preservatives.'
      },
      'products': {
        title: 'Authentic Telugu Foods, Pickles & Sweets Collection | SVADA Homemade Farms',
        description: 'Explore our collection of natural, wood-pressed cold pressed oils, pure forest honey, A2 cow ghee, traditional pickles, dry fruits, millets, organic rices, and home essentials.'
      },
      'about': {
        title: 'Our Story - Traditional Recipes & Organic Farming | SVADA Homemade Farms',
        description: 'Learn about SVADA\'s mission to revive traditional wood-pressed oils, handmade pickles, and organic farm food directly from village kitchens to your table.'
      },
      'contact': {
        title: 'Contact Us - SVADA Homemade Farms Support',
        description: 'Reach out to SVADA for orders, bulk inquiries, or support. We deliver fresh, authentic homemade foods all across India. Call or WhatsApp us today.'
      },
      'login': {
        title: 'Customer Access Portal - Login / Sign Up | SVADA',
        description: 'Access your SVADA account to view your past orders, update shipping addresses, and manage your wishlist.'
      },
      'account': {
        title: 'My Account Profile & Order History | SVADA',
        description: 'Manage your orders, update shipping addresses, track deliveries, and check your saved items in your SVADA account.'
      },
      'admin-login': {
        title: 'Secure Admin Access Portal | SVADA',
        description: 'Authorized personnel login gate for the SVADA Homemade Farms administration panel.'
      },
      'admin': {
        title: 'SVADA Control Center - Admin Panel',
        description: 'Manage products, orders, slide images, categories, and settings for SVADA Homemade Farms dashboard.'
      },
      'privacy': {
        title: 'Privacy Policy | SVADA Homemade Farms',
        description: 'Read the SVADA privacy policy outlining how we store, secure, and process customer information and transaction details.'
      },
      'shipping': {
        title: 'Shipping & Delivery Policy | SVADA Homemade Farms',
        description: 'Check SVADA\'s shipping policies, free shipping thresholds, delivery timelines across India, and packaging details.'
      },
      'refund': {
        title: 'Returns & Refund Policy | SVADA Homemade Farms',
        description: 'Learn about SVADA\'s simple returns, exchanges, and refund procedures for pickles, ghee, sweets, and other products.'
      },
      'terms': {
        title: 'Terms of Service & Conditions | SVADA Homemade Farms',
        description: 'Review the terms of service, payment options, order acceptances, and user guidelines for the SVADA online store.'
      }
    };

    const config = seoConfig[currentPage] || seoConfig['home'];

    // 1. Update document title
    document.title = config.title;

    // 2. Helper to set/update metadata tags
    const updateMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updateOgTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 3. Apply updates to DOM head
    updateMetaTag('description', config.description);
    updateOgTag('og:title', config.title);
    updateOgTag('og:description', config.description);
    updateMetaTag('twitter:title', config.title);
    updateMetaTag('twitter:description', config.description);

  }, [currentPage]);

  // Initialize AOS scroll trigger library
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
      easing: 'ease-out-cubic',
      offset: 50,
      delay: 0,
      disable: false,
    });
  }, []);

  // Re-scan and re-animate all AOS elements on page changes
  useEffect(() => {
    // Use refreshHard to fully re-parse and reset all AOS elements on page switch
    const timer = setTimeout(() => {
      AOS.refreshHard();
    }, 150);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'products':
        return <Products />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login />;
      case 'account':
        return <Account />;
      case 'privacy':
        return <Privacy />;
      case 'shipping':
        return <ShippingPolicy />;
      case 'refund':
        return <RefundPolicy />;
      case 'terms':
        return <Terms />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Home />;
    }
  };

  const handleOpenCart = () => {
    setCartActiveTab('cart');
    setIsCartOpen(true);
  };

  const handleOpenWishlist = () => {
    setCartActiveTab('wishlist');
    setIsCartOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-svada-bg text-svada-dark antialiased">
      
      {/* Sticky Responsive Header Menu - Hide on admin pages */}
      {currentPage !== 'admin' && currentPage !== 'admin-login' && (
        <Navbar onOpenCart={handleOpenCart} onOpenWishlist={handleOpenWishlist} />
      )}

      {/* Main Single Page Router Content */}
      <main className="flex-grow pb-16 md:pb-0">
        {renderActivePage()}
      </main>

      {/* Multi-column Premium Footer - Hide on admin pages */}
      {currentPage !== 'admin' && currentPage !== 'admin-login' && <Footer />}

      {/* Pop-up Modals & Drawers - Hide on admin pages */}
      {currentPage !== 'admin' && currentPage !== 'admin-login' && (
        <>
          {/* 1. Dynamic Quick View Popup */}
          <QuickViewModal />

          {/* 2. Side-out Shopping Bag & Wishlist Drawer */}
          <CartModal 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            activeTab={cartActiveTab} 
            setActiveTab={setCartActiveTab} 
          />

          {/* 3. Floating WhatsApp Support widget */}
          <a
            href="https://api.whatsapp.com/send?phone=919000955239&text=Hi%20SVADA!%20I'm%20visiting%20your%20website%20and%20need%20some%20help."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-28 md:bottom-6 right-6 z-30 bg-[#3B1E0A] hover:bg-[#2B1507] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border border-white/20 group cursor-pointer"
            title="WhatsApp Support Desk"
          >
            <MessageCircle className="h-6 w-6 fill-white text-[#3B1E0A]" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              WhatsApp Support
            </span>
          </a>

          {/* 4. Shipping Promo Popup (displayed once per session after splash screen ends) */}
          <PromoPopup showTrigger={!showSplash} />
        </>
      )}

    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ShopProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <AppContent showSplash={showSplash} />
    </ShopProvider>
  );
}


