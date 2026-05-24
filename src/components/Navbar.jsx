import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, Heart, Menu, X, User, LogOut } from 'lucide-react';

export default function Navbar({ onOpenCart, onOpenWishlist }) {
  const { currentPage, setCurrentPage, cartCount, wishlist, isLoggedIn, currentUser, setIsLoggedIn } = useContext(ShopContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll for solid background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop Products', page: 'products' },
    { label: 'Our Story', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Notification Announcement Ribbon (madur.in inspired) */}
      <div className="fixed top-0 left-0 w-full z-50 bg-accent text-white h-8 text-[10px] font-extrabold tracking-wider overflow-hidden select-none flex items-center border-b border-emerald-700/35">
        <div className="animate-marquee flex whitespace-nowrap gap-10">
          <div className="flex gap-10">
            <span>🌿 100% HOMEMADE, PRESERVATIVE-FREE & ORGANIC FOODS</span>
            <span>•</span>
            <span>⚡ PREPAID SHIPMENTS ONLY (NO COD) | DIRECT SHIPPING ACROSS INDIA</span>
            <span>•</span>
            <span>🥭 AUTHENTIC TELUGU HERITAGE RECIPES CRAFTED WITH LOVE</span>
            <span>•</span>
            <span>🍯 PURE A2 COW GHEE & RAW WILD FOREST HONEY</span>
          </div>
          <div className="flex gap-10" aria-hidden="true">
            <span>🌿 100% HOMEMADE, PRESERVATIVE-FREE & ORGANIC FOODS</span>
            <span>•</span>
            <span>⚡ PREPAID SHIPMENTS ONLY (NO COD) | DIRECT SHIPPING ACROSS INDIA</span>
            <span>•</span>
            <span>🥭 AUTHENTIC TELUGU HERITAGE RECIPES CRAFTED WITH LOVE</span>
            <span>•</span>
            <span>🍯 PURE A2 COW GHEE & RAW WILD FOREST HONEY</span>
          </div>
        </div>
      </div>

      <nav
        className="fixed left-0 w-full z-40 bg-svada-bg shadow-md py-3 border-b border-orange-100 top-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 md:h-28">
            
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer flex items-center" onClick={() => handleNavClick('home')}>
              <img
                src="/logo.png"
                alt="SVADA Logo"
                className="h-20 md:h-24 w-auto object-contain transform hover:scale-105 transition duration-300 rounded-xl"
              />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 font-poppins font-medium text-sm">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`relative py-2 transition duration-300 ${
                    currentPage === link.page
                      ? 'text-primary font-semibold'
                      : 'text-svada-dark hover:text-primary'
                  }`}
                >
                  {link.label}
                  {currentPage === link.page && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transform scale-x-100 transition-transform duration-300" />
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              
              {/* User Login Portal Button */}
              <button
                onClick={() => handleNavClick('login')}
                className={`hidden md:inline-flex p-2.5 rounded-full transition-all duration-300 ${
                  currentPage === 'login'
                    ? 'bg-primary text-white'
                    : 'text-svada-dark hover:bg-orange-100 hover:text-primary'
                }`}
                title={isLoggedIn ? `Account: ${currentUser?.name}` : 'Login/Signup'}
              >
                <User className="h-5 w-5" />
              </button>

              {/* Wishlist Button with Badge */}
              <button
                onClick={onOpenWishlist}
                className="hidden md:inline-flex p-2.5 rounded-full text-svada-dark hover:bg-orange-100 hover:text-primary transition-all duration-300 relative"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-svada-bg animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag Button with Badge */}
              <button
                onClick={onOpenCart}
                className="hidden md:inline-flex p-2.5 rounded-full text-svada-dark hover:bg-orange-100 hover:text-primary transition-all duration-300 relative bg-orange-50 border border-orange-100"
                title="Cart"
              >
                <ShoppingBag className="h-5 w-5 text-primary" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-svada-bg">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-svada-dark hover:bg-orange-100 hover:text-primary transition duration-300"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

            </div>
          </div>
        </div>

        {/* Animated Mobile Slide-out Menu */}
        <div
          className={`fixed inset-y-0 right-0 max-w-xs w-full bg-svada-bg shadow-2xl z-50 transform transition-transform duration-500 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-orange-100/60 bg-orange-50/40">
            <span className="font-outfit font-black tracking-wider text-primary text-xl">SVADA MENU</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-orange-200 transition duration-300"
            >
              <X className="h-6 w-6 text-svada-dark" />
            </button>
          </div>
          <div className="px-4 py-6 space-y-3 font-poppins">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`w-full text-left px-4 py-3 rounded-xl transition duration-300 font-medium text-base ${
                  currentPage === link.page
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'text-svada-dark hover:bg-white hover:text-primary'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Cart & Wishlist Mobile Actions */}
            <div className="pt-4 space-y-3 border-t border-orange-100/50 mt-4">
              {/* Shopping Cart Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="flex items-center justify-between w-full px-4 py-3.5 bg-white hover:bg-orange-50 text-svada-dark hover:text-primary rounded-xl transition duration-300 font-semibold text-base border border-orange-100/70 shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <span>My Cart</span>
                </div>
                {cartCount > 0 ? (
                  <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount} items
                  </span>
                ) : (
                  <span className="text-xs text-svada-light font-normal">Empty</span>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenWishlist();
                }}
                className="flex items-center justify-between w-full px-4 py-3.5 bg-white hover:bg-orange-50 text-svada-dark hover:text-primary rounded-xl transition duration-300 font-semibold text-base border border-orange-100/70 shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-accent" />
                  <span>My Wishlist</span>
                </div>
                {wishlist.length > 0 ? (
                  <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {wishlist.length} items
                  </span>
                ) : (
                  <span className="text-xs text-svada-light font-normal">Empty</span>
                )}
              </button>
            </div>

            <div className="pt-6 border-t border-orange-100 mt-6">
              {isLoggedIn ? (
                <div className="p-4 bg-white border border-orange-100/70 rounded-2xl shadow-xs">
                  <p className="text-xs text-svada-light">Logged in as</p>
                  <p className="font-semibold text-svada-dark text-sm mb-3">{currentUser?.name}</p>
                  <button 
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition text-sm font-semibold"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg font-semibold text-center text-sm transform hover:scale-[1.02] transition"
                >
                  Access Account
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Overlay backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden"
          />
        )}
      </nav>
      {/* Spacer to prevent header overlay on page content */}
      {currentPage !== 'home' && <div className="h-36 md:h-44" />}
    </>
  );
}
