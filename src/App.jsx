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

// AOS Scroll Animations
import AOS from 'aos';
import 'aos/dist/aos.css';

// Lucide icon for support
import { MessageCircle } from 'lucide-react';

function AppContent() {
  const { currentPage } = useContext(ShopContext);
  
  // Sidebar drawers active states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartActiveTab, setCartActiveTab] = useState('cart'); // 'cart' | 'wishlist'

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
      case 'privacy':
        return <Privacy />;
      case 'shipping':
        return <ShippingPolicy />;
      case 'refund':
        return <RefundPolicy />;
      case 'terms':
        return <Terms />;
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
      
      {/* Sticky Responsive Header Menu */}
      <Navbar onOpenCart={handleOpenCart} onOpenWishlist={handleOpenWishlist} />

      {/* Main Single Page Router Content */}
      <main className="flex-grow pb-16 md:pb-0">
        {renderActivePage()}
      </main>

      {/* Multi-column Premium Footer */}
      <Footer />

      {/* Pop-up Modals & Drawers */}
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

    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ShopProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <AppContent />
    </ShopProvider>
  );
}
