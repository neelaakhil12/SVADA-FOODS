import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Search, Filter, X, ChevronRight, Sparkles, Smile } from 'lucide-react';
import AOS from 'aos';

export default function Products() {
  const { 
    products, 
    filteredProducts, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory 
  } = useContext(ShopContext);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Preload the first 6 product images so they appear instantly when the grid renders
  useEffect(() => {
    const preloadLinks = [];
    const imagesToPreload = filteredProducts.slice(0, 6);
    imagesToPreload.forEach((product) => {
      if (!product.image) return;
      const existing = document.querySelector(`link[rel="preload"][href="${product.image}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = product.image;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
        preloadLinks.push(link);
      }
    });
    return () => {
      preloadLinks.forEach((link) => {
        if (link.parentNode) link.parentNode.removeChild(link);
      });
    };
  }, [filteredProducts]);

  // Re-scan all AOS elements when products update (handles dynamic filtering/search)
  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refreshHard();
    }, 150);
    return () => clearTimeout(timer);
  }, [filteredProducts]);

  const categories = [
    'All',
    'Cold Pressed oils & Ghee & honey',
    'Drinks & Tea',
    'Dry fruits, Nuts & seeds',
    'Herb Extract Foods',
    'Herbs & Extracts',
    'Household supplies',
    'Millets & Flakes',
    'Personal hair care',
    'Pickles & Powders',
    'Pooja supplies',
    'Ready to eat & cook & fryums',
    'Rices, Flours, Pulses & other',
    'Seasonal Spices & Masala',
    'seeds & Plants',
    'Sugars, Sweetners & syrups',
    'sweets & snacks'
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins min-h-[80vh]">
      
      {/* Page Header */}
      <div className="text-center space-y-3 mb-10" data-aos="fade-up">
        <span className="text-xs font-bold text-accent tracking-widest uppercase block">
          Taste of Heritage
        </span>
        <h1 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
          SVADA Fresh Traditional Catalog
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
        <p className="text-sm text-svada-light font-light max-w-xl mx-auto leading-relaxed">
          Order premium homemade pickles, roasted podi karams, Bilona cow ghee, healthy millet flours, and eco-friendly bamboo bottles. Cooked fresh under premium hygienic rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP SIDEBAR - CATEGORIES */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-orange-50 mb-4">
              <h3 className="font-outfit font-bold text-svada-dark text-base flex items-center">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                <span>Categories</span>
              </h3>
              {(selectedCategory !== 'All' || searchQuery !== '') && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] text-primary font-bold hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition duration-300 flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-accent text-white shadow-xs'
                      : 'text-svada-dark hover:bg-orange-50 hover:text-primary'
                  }`}
                >
                  <span>{cat}</span>
                  <ChevronRight className={`h-3 w-3 ${selectedCategory === cat ? 'text-white' : 'text-orange-200'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCTS MAIN CONTENT AREA */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* SEARCH & MOBILE FILTER TRIGGERS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-orange-100 rounded-3xl p-4 shadow-xs">
            
            {/* Search Box */}
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search pickles, ghee, laddus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-orange-50 border border-orange-100 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold text-svada-dark placeholder-svada-light/60 focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300"
              />
              <Search className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
              {/* Product Count Display */}
              <span className="text-xs text-svada-light font-medium whitespace-nowrap">
                Showing <strong className="text-svada-dark">{filteredProducts.length}</strong> delicacies
              </span>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center space-x-1.5 bg-orange-50 hover:bg-orange-100 text-svada-dark px-4 py-2 rounded-xl text-xs font-bold transition duration-300 border border-orange-100"
              >
                <Filter className="h-3.5 w-3.5 text-primary" />
                <span>Filters</span>
              </button>
            </div>

          </div>

          {/* ACTIVE FILTER PIN TAGS */}
          {(selectedCategory !== 'All' || searchQuery !== '') && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-svada-light font-bold uppercase tracking-wider">Active Filters:</span>
              
              {selectedCategory !== 'All' && (
                <span className="bg-orange-100 text-primary border border-orange-200/50 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <span>Category: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="h-3 w-3 hover:text-red-500" />
                  </button>
                </span>
              )}

              {searchQuery !== '' && (
                <span className="bg-orange-100 text-primary border border-orange-200/50 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <span>Search: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')}>
                    <X className="h-3 w-3 hover:text-red-500" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* PRODUCT CARDS GRID */}
          {selectedCategory === 'Personal hair care' ? (
            // Minimal Upcoming Products Card
            <div className="bg-white border border-orange-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs font-poppins">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h3 className="font-outfit font-bold text-svada-dark text-lg mb-2">Upcoming Products</h3>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Premium, hand-crafted hair care formulations are currently in preparation. Coming soon to our catalog!
              </p>
            </div>
          ) : selectedCategory === 'Pooja supplies' ? (
            // Minimal Upcoming Products Card
            <div className="bg-white border border-orange-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs font-poppins">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h3 className="font-outfit font-bold text-svada-dark text-lg mb-2">Upcoming Products</h3>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Pure, traditional pooja essentials and sacred supplies are currently in preparation. Coming soon to our catalog!
              </p>
            </div>
          ) : selectedCategory === 'Ready to eat & cook & fryums' ? (
            // Minimal Upcoming Products Card
            <div className="bg-white border border-orange-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs font-poppins">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h3 className="font-outfit font-bold text-svada-dark text-lg mb-2">Upcoming Products</h3>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Wholesome ready-to-eat mixes, fryums, and instant meal kits are currently in preparation. Coming soon to our catalog!
              </p>
            </div>
          ) : selectedCategory === 'Rices, Flours, Pulses & other' ? (
            // Minimal Upcoming Products Card
            <div className="bg-white border border-orange-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs font-poppins">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h3 className="font-outfit font-bold text-svada-dark text-lg mb-2">Upcoming Products</h3>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Premium quality rices, flours, pulses, and grains are currently in preparation. Coming soon to our catalog!
              </p>
            </div>
          ) : selectedCategory === 'seeds & Plants' ? (
            // Minimal Upcoming Products Card
            <div className="bg-white border border-orange-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs font-poppins">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h3 className="font-outfit font-bold text-svada-dark text-lg mb-2">Upcoming Products</h3>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Organic seeds, gardening kits, and green plant supplies are currently in preparation. Coming soon to our catalog!
              </p>
            </div>
          ) : selectedCategory === 'Sugars, Sweetners & syrups' ? (
            // Minimal Upcoming Products Card
            <div className="bg-white border border-orange-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs font-poppins">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h3 className="font-outfit font-bold text-svada-dark text-lg mb-2">Upcoming Products</h3>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Natural sugars, healthy sweeteners, and organic syrups are currently in preparation. Coming soon to our catalog!
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            
            // Empty State
            <div className="bg-white border border-orange-100 rounded-3xl p-12 text-center max-w-lg mx-auto">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <Smile className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-outfit font-bold text-svada-dark text-lg mb-1">No delicacy matches your criteria</h3>
              <p className="text-xs text-svada-light leading-relaxed mb-6 font-light">
                We couldn\'t find any products matching your search filters. Try checking spelling or browsing another category.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xs rounded-xl shadow-md"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            
            // The Grid
            <div 
              key={selectedCategory + '-' + searchQuery + '-' + filteredProducts.length} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* MOBILE FILTERS SIDE PANEL DRAWER */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <div className="w-screen max-w-xs bg-svada-card shadow-2xl flex flex-col justify-between h-full transform transition duration-500 ease-in-out border-l border-orange-100">
              <div>
                <div className="flex items-center justify-between p-6 border-b border-orange-100 bg-orange-50">
                  <h3 className="font-outfit font-black text-primary text-base flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Select Category</span>
                  </h3>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1 rounded-lg hover:bg-orange-200 text-svada-dark transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 space-y-1.5 overflow-y-auto max-h-[75vh]">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition duration-300 flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-accent text-white shadow-md'
                          : 'text-svada-dark hover:bg-orange-50 hover:text-primary'
                      }`}
                    >
                      <span>{cat}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom reset actions */}
              <div className="p-6 border-t border-orange-100 bg-orange-50/50">
                <button
                  onClick={() => {
                    clearFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                  className="w-full bg-white text-primary border border-orange-100 py-2.5 rounded-xl text-xs font-bold hover:bg-orange-50 transition duration-300"
                >
                  Reset Active Filters
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
