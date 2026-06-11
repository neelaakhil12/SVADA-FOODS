import React, { useContext, useState, useEffect, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import {
  ShoppingBag, Heart, User, LogOut, Phone, MapPin,
  Search, ChevronDown, Menu, X, Truck, Package, Home as HomeIcon, ChevronRight, Settings
} from 'lucide-react';

export default function Navbar({ onOpenCart, onOpenWishlist }) {
  const {
    currentPage, setCurrentPage, cartCount, wishlist,
    isLoggedIn, currentUser, setIsLoggedIn, setSelectedCategory, isAdmin,
    categories: dynamicCategories, freeShippingThreshold,
    products = [], setActiveQuickView, searchQuery: globalSearchQuery, setSearchQuery: setGlobalSearchQuery
  } = useContext(ShopContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const browseDropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const mobileSearchDropdownRef = useRef(null);

  // Sync global search query back to local navbar search query
  useEffect(() => {
    setSearchQuery(globalSearchQuery || '');
  }, [globalSearchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (browseDropdownRef.current && !browseDropdownRef.current.contains(e.target)) {
        setIsBrowseOpen(false);
      }
      if (
        searchDropdownRef.current && !searchDropdownRef.current.contains(e.target) &&
        (!mobileSearchDropdownRef.current || !mobileSearchDropdownRef.current.contains(e.target))
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'products' },
    { label: 'Our Story', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    setIsBrowseOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat) => {
    if (cat !== 'All Categories') {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('All');
    }
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setGlobalSearchQuery(searchQuery);
      setSelectedCategory('All');
      setCurrentPage('products');
      setIsSearchFocused(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredSuggestions = searchQuery.trim()
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.name);
    setGlobalSearchQuery(product.name);
    setSelectedCategory('All');
    setCurrentPage('products');
    setIsSearchFocused(false);
    setActiveQuickView(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-200 text-svada-dark font-bold rounded-xs px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <>
      {/* ============================================================
          DYNAMIC 3-TIER HEADER — UNIFIED FIXED WRAPPER
      ============================================================ */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        
        {/* TIER 1 — TOP INFO BAR (dark brown, like reference) */}
        <div 
          className="w-full h-9 flex items-center px-4 sm:px-8 border-b border-orange-950/20"
          style={{ background: '#3B1E0A' }}
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            {/* Left: Welcome message (static, like reference) */}
            <div className="text-[11px] text-orange-200 font-semibold select-none flex-1 text-left">
              Welcome to SVADA FARMS online store.
            </div>
            {/* Right: Phone number */}
            <a
              href="tel:+919000955239"
              className="hidden sm:flex items-center gap-1.5 text-[11px] text-orange-100 font-semibold hover:text-secondary transition whitespace-nowrap"
            >
              <Phone className="h-3.5 w-3.5 text-secondary" />
              Call Us: +91 90009 55239
            </a>
          </div>
        </div>

        {/* TIER 2 — MAIN HEADER (Logo + Search + Icons) */}
        <div className="w-full bg-white border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 h-20">

              {/* Logo */}
              <div
                className="flex-shrink-0 cursor-pointer flex items-center gap-2"
                onClick={() => handleNavClick('home')}
              >
                <img
                  src="/logo.png?v=2"
                  alt="SVADA FARMS Logo"
                  className="h-14 md:h-18 w-auto object-contain rounded-full hover:scale-105 transition duration-300"
                />
                <span className="block font-outfit font-black text-svada-dark text-sm sm:text-lg lg:text-xl leading-none tracking-wide whitespace-nowrap">
                  SVADA <span className="text-[#3B1E0A]">FARMS</span>
                </span>
              </div>

              {/* Search Bar — desktop */}
              <div className="hidden md:flex flex-1 max-w-lg mx-auto relative" ref={searchDropdownRef}>
                <form onSubmit={handleSearch} className="flex w-full border-2 border-orange-200 rounded-lg overflow-hidden focus-within:border-primary transition-colors duration-200">
                  {/* Search input */}
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="flex-1 min-w-0 px-4 py-2 text-sm text-svada-dark placeholder-svada-light outline-none bg-white"
                  />
                  {/* Search button */}
                  <button
                    type="submit"
                    className="px-5 py-2 hover:bg-[#2B1507] text-white transition-colors duration-200 flex items-center justify-center cursor-pointer"
                    style={{ background: '#3B1E0A' }}
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>

                {isSearchFocused && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-orange-100 rounded-xl shadow-2xl z-[100] max-h-80 overflow-y-auto py-2 divide-y divide-orange-50">
                    {filteredSuggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSuggestionClick(product)}
                        className="w-full text-left px-4 py-3 hover:bg-orange-50/70 transition duration-150 flex items-center gap-3 cursor-pointer"
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded-lg border border-orange-100 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-svada-dark truncate">
                            {highlightText(product.name, searchQuery)}
                          </div>
                          <div className="text-[10px] text-[#3B1E0A] font-bold uppercase tracking-wider mt-0.5">
                            {product.category}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-1 sm:gap-3 ml-auto">

                {/* Location — desktop only */}
                <div className="hidden lg:flex items-center gap-1.5 text-svada-dark text-xs font-medium cursor-pointer hover:text-[#3B1E0A] transition">
                  <MapPin className="h-4 w-4 text-[#3B1E0A]" />
                  <span>India</span>
                </div>

                {/* Account */}
                <button
                  onClick={() => handleNavClick(isLoggedIn ? 'account' : 'login')}
                  className="hidden md:flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-[#3B1E0A]/5 text-svada-dark hover:text-[#3B1E0A] transition group cursor-pointer"
                  title={isLoggedIn ? `Account: ${currentUser?.name}` : 'Login / Register'}
                >
                  <User className="h-5 w-5" />
                  <span className="text-[9px] font-semibold leading-none whitespace-nowrap">
                    {isLoggedIn ? currentUser?.name?.split(' ')[0] : 'Account'}
                  </span>
                  <span className="text-[8px] text-svada-light group-hover:text-[#3B1E0A] leading-none whitespace-nowrap">
                    {isLoggedIn ? 'My Orders' : 'Login / Register'}
                  </span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={onOpenWishlist}
                  className="relative hidden md:flex items-center justify-center p-2.5 rounded-lg hover:bg-[#3B1E0A]/5 text-svada-dark hover:text-[#3B1E0A] transition cursor-pointer"
                  title="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  onClick={onOpenCart}
                  className="relative hidden md:flex items-center justify-center p-2.5 rounded-lg hover:bg-[#2B1507] text-white transition shadow-md cursor-pointer"
                  style={{ background: '#3B1E0A' }}
                  title="Cart"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-white text-[#3B1E0A] text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border border-orange-200">
                      {cartCount}
                    </span>
                  )}
                </button>

              </div>
            </div>

            {/* Mobile search bar & Quick Links */}
            <div className="md:hidden pb-3 relative" ref={mobileSearchDropdownRef}>
              <form onSubmit={handleSearch} className="flex w-full border-2 border-orange-200 rounded-lg overflow-hidden focus-within:border-primary transition-colors duration-200 mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-1 min-w-0 px-3 py-2 text-sm text-svada-dark placeholder-svada-light outline-none bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 hover:bg-[#2B1507] text-white transition-colors duration-200 flex items-center justify-center"
                  style={{ background: '#3B1E0A' }}
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {isSearchFocused && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-0 bg-white border border-orange-100 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto py-2 divide-y divide-orange-50">
                  {filteredSuggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full text-left px-3 py-2.5 hover:bg-orange-50/70 transition duration-150 flex items-center gap-3 cursor-pointer"
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-8 w-8 object-cover rounded-lg border border-orange-100 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-svada-dark truncate">
                          {highlightText(product.name, searchQuery)}
                        </div>
                        <div className="text-[9px] text-[#3B1E0A] font-bold uppercase tracking-wider mt-0.5">
                          {product.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Mobile horizontal quick links */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1.5 border-t border-orange-100/60">

                {/* Links */}
                <div className="flex items-center gap-4 pl-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.page}
                      onClick={() => handleNavClick(link.page)}
                      className={`text-xs font-bold whitespace-nowrap cursor-pointer py-1 transition duration-200 ${
                        currentPage === link.page
                          ? 'text-[#3B1E0A] border-b-2 border-[#3B1E0A]'
                          : 'text-svada-dark hover:text-[#3B1E0A]'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TIER 3 — NAVIGATION BAR (Browse Categories + Links + Offer) */}
        <div className="hidden md:block w-full bg-svada-bg border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-11 gap-0">

              {/* Browse All Categories button */}
              <div className="relative" ref={browseDropdownRef}>
                <button
                  onClick={() => setIsBrowseOpen(!isBrowseOpen)}
                  className="flex items-center gap-2 h-11 px-4 text-xs font-bold text-white hover:bg-[#2B1507] transition-colors duration-200 rounded-none cursor-pointer"
                  style={{ background: '#3B1E0A' }}
                >
                  <Menu className="h-3.5 w-3.5" />
                  <span className="sm:hidden whitespace-nowrap">Categories</span>
                  <span className="hidden sm:inline whitespace-nowrap">Browse All Categories</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isBrowseOpen ? 'rotate-180' : ''}`} />
                </button>
                {/* Browse dropdown */}
                {isBrowseOpen && (
                  <div className="absolute top-full left-0 mt-0 w-64 bg-white border border-orange-100 rounded-b-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                    {dynamicCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs font-medium text-svada-dark hover:bg-[#3B1E0A]/5 hover:text-[#3B1E0A] transition border-b border-[#3B1E0A]/5 last:border-0 cursor-pointer"
                      >
                        <Package className="h-3 w-3 text-svada-light flex-shrink-0" />
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Nav links — desktop */}
              <div className="hidden md:flex items-center h-full ml-2">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className={`relative h-full px-4 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                      currentPage === link.page
                        ? 'text-[#3B1E0A] border-b-2 border-[#3B1E0A]'
                        : 'text-svada-dark hover:text-[#3B1E0A]'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Free shipping notice — desktop */}
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-svada-dark whitespace-nowrap pr-2">
                <Truck className="h-4 w-4 text-[#3B1E0A] flex-shrink-0" />
                <span>
                  Free Shipping in India :{' '}
                  <span className="font-black text-[#3B1E0A]">Order Above ₹{freeShippingThreshold}/-</span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* ============================================================
          MOBILE SLIDE-OUT MENU
      ============================================================ */}
      <div
        className={`fixed inset-y-0 right-0 max-w-xs w-full bg-svada-bg shadow-2xl z-[60] transform transition-transform duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#3B1E0A]/10 bg-[#3B1E0A]/5">
          <span className="font-outfit font-black tracking-wider text-[#3B1E0A] text-lg">SVADA MENU</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-xl hover:bg-[#3B1E0A]/15 transition"
          >
            <X className="h-5 w-5 text-svada-dark" />
          </button>
        </div>

        <div className="px-4 py-5 space-y-2 font-poppins overflow-y-auto h-full pb-24">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNavClick(link.page)}
              className={`w-full text-left px-4 py-3 rounded-xl transition font-semibold text-sm ${
                currentPage === link.page
                  ? 'bg-gradient-to-r from-[#3B1E0A] to-[#5A2E10] text-white shadow-md'
                  : 'text-svada-dark hover:bg-white hover:text-[#3B1E0A]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-4 space-y-2 border-t border-[#3B1E0A]/10 mt-4">
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenCart(); }}
              className="flex items-center justify-between w-full px-4 py-3 bg-white hover:bg-[#3B1E0A]/5 text-svada-dark hover:text-[#3B1E0A] rounded-xl transition font-semibold text-sm border border-[#3B1E0A]/10 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#3B1E0A]" />
                <span>My Cart</span>
              </div>
              {cartCount > 0 ? (
                <span className="bg-[#3B1E0A] text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount} items</span>
              ) : (
                <span className="text-xs text-svada-light">Empty</span>
              )}
            </button>

            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenWishlist(); }}
              className="flex items-center justify-between w-full px-4 py-3 bg-white hover:bg-[#3B1E0A]/5 text-svada-dark hover:text-[#3B1E0A] rounded-xl transition font-semibold text-sm border border-[#3B1E0A]/10 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-accent" />
                <span>My Wishlist</span>
              </div>
              {wishlist.length > 0 ? (
                <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">{wishlist.length} items</span>
              ) : (
                <span className="text-xs text-svada-light">Empty</span>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-[#3B1E0A]/10 mt-4">
            {isLoggedIn ? (
              <div className="p-4 bg-white border border-[#3B1E0A]/10 rounded-2xl shadow-sm">
                <p className="text-xs text-svada-light">Logged in as</p>
                <p className="font-semibold text-svada-dark text-sm mb-3">{currentUser?.name}</p>
                <button
                  onClick={() => { setIsLoggedIn(false); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center w-full py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition text-sm font-semibold"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-3 bg-gradient-to-r from-[#3B1E0A] to-[#5A2E10] text-white rounded-xl shadow-lg font-semibold text-sm hover:scale-[1.02] transition"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Free shipping notice mobile */}
          <div className="flex items-center gap-2 bg-[#3B1E0A]/5 border border-[#3B1E0A]/10 rounded-xl p-3 mt-2">
            <Truck className="h-4 w-4 text-[#3B1E0A] flex-shrink-0" />
            <p className="text-xs font-semibold text-svada-dark">
              Free Shipping above <span className="text-[#3B1E0A] font-black">₹{freeShippingThreshold}/-</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] md:hidden"
        />
      )}

      {/* ============================================================
          MOBILE CATEGORIES SLIDE-OUT DRAWER
      ============================================================ */}
      {isMobileCategoriesOpen && (
        <div className="fixed inset-0 z-[70] md:hidden overflow-hidden">
          <div 
            onClick={() => setIsMobileCategoriesOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />
          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col justify-between h-full transform transition duration-500 ease-in-out border-r border-orange-100">
              <div>
                <div className="flex items-center justify-between p-6 border-b border-orange-100 bg-[#3B1E0A]/5">
                  <h3 className="font-outfit font-black text-[#3B1E0A] text-base flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    <span>Browse Categories</span>
                  </h3>
                  <button
                    onClick={() => setIsMobileCategoriesOpen(false)}
                    className="p-1 rounded-lg hover:bg-orange-200 text-svada-dark transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 space-y-1.5 overflow-y-auto max-h-[80vh] scrollbar-hide">
                  {dynamicCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        handleCategorySelect(cat);
                        setIsMobileCategoriesOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-svada-dark hover:bg-[#3B1E0A]/5 hover:text-primary transition duration-300 flex items-center justify-between border-b border-orange-50/50 last:border-0 cursor-pointer"
                    >
                      <span>{cat}</span>
                      <ChevronRight className="h-3 w-3 text-orange-200" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          STICKY BOTTOM MOBILE TAB BAR
      ============================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden py-2 px-3 flex justify-around items-center select-none font-poppins">
        {/* Home */}
        <button
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-200 cursor-pointer ${
            currentPage === 'home' ? 'text-[#3B1E0A]' : 'text-svada-dark hover:text-[#3B1E0A]'
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => setIsMobileCategoriesOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-200 cursor-pointer ${
            isMobileCategoriesOpen ? 'text-[#3B1E0A]' : 'text-svada-dark hover:text-[#3B1E0A]'
          }`}
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">Categories</span>
        </button>


        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-200 relative cursor-pointer text-svada-dark hover:text-[#3B1E0A]"
        >
          <Heart className="h-5 w-5" />
          {wishlist.length > 0 && (
            <span className="absolute top-0.5 right-3.5 bg-accent text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] font-bold mt-1">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-200 relative cursor-pointer text-svada-dark hover:text-[#3B1E0A]"
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-3.5 bg-[#3B1E0A] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-bold mt-1">Cart</span>
        </button>

        {/* Account */}
        <button
          onClick={() => handleNavClick(isLoggedIn ? 'account' : 'login')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-200 cursor-pointer ${
            currentPage === 'account' || currentPage === 'login' ? 'text-[#3B1E0A]' : 'text-svada-dark hover:text-[#3B1E0A]'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">
            {isLoggedIn ? 'Account' : 'Login'}
          </span>
        </button>
      </div>

      {/* Unified page spacer to push down page content perfectly without manual overlaps! */}
      <div className="h-[205px] md:h-[162px]" />
    </>
  );
}


