import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { 
  ArrowRight, ShieldCheck, Heart, Award, Leaf, Flame, 
  Sparkles, MessageCircle, Star, Truck, ShieldAlert,
  Play, Volume2, VolumeX, X, Plus, Check, ShoppingBag
} from 'lucide-react';

export default function Home() {
  const { products, setCurrentPage, setSelectedCategory, addToCart } = useContext(ShopContext);

  // Shoppable Video Reels State
  const [activeReel, setActiveReel] = useState(null);
  const [reelMuted, setReelMuted] = useState(true);
  const [cartSuccessId, setCartSuccessId] = useState(null);

  // ------------------------------------------------------------
  // WATCH & BUY SHOPPABLE REELS DATA
  // ------------------------------------------------------------
  const watchBuyVideos = [
    {
      id: 'wb1',
      videoUrl: '/IMG_8230.MP4',
      title: 'Svada Traditional Farm Prep',
      desc: 'Watch our authentic, natural delicacies being handcrafted directly in our traditional village kitchens.',
      keyword: 'pickle',
    },
    {
      id: 'wb2',
      videoUrl: '/whatsapp_video_2.mp4',
      title: 'Svada Traditional Stone Grinding',
      desc: 'See our traditional spices and homemade podis being slow ground to lock in fresh aroma and nutrition.',
      keyword: 'podi',
    },
    {
      id: 'wb3',
      videoUrl: '/whatsapp_video_3.mp4',
      title: 'Svada Pure Homemade Goodness',
      desc: 'Watch our fresh ingredients and traditional products prepared cleanly with pure care.',
      keyword: 'sweet',
    },
    {
      id: 'wb4',
      videoUrl: '/whatsapp_video_4.mp4',
      title: 'Svada Authentic Village Recipes',
      desc: 'Watch our slow wood-fire dry roasting and clay pot recipes made exactly with home rules.',
      keyword: 'ghee',
    }
  ];

  const getProductForVideo = (keyword) => {
    if (!products || products.length === 0) return null;
    const match = products.find(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
    return match || products[0];
  };

  const handleReelAddToCart = (e, product) => {
    e.stopPropagation();
    if (!product) return;
    addToCart(product.id, '250g', product.price || 199);
    setCartSuccessId(product.id);
    setTimeout(() => setCartSuccessId(null), 2000);
  };

  // Filter out bestsellers
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 4);

  // Available categories for featured categories section
  const categoriesList = [
    { name: 'Cold Pressed oils & Ghee & honey', image: '/image copy 138.png', desc: 'A2 Ghee, Honey & Oils' },
    { name: 'Dry fruits, Nuts & seeds', image: '/image copy 139.png', desc: 'Premium Nutrients' },
    { name: 'Herb Extract Foods', image: '/image copy 140.png', desc: 'Infused Wellness' },
    { name: 'Drinks & Tea', image: '/image copy 141.png', desc: 'Herbal Teas & Drinks' },
    { name: 'Herbs & Extracts', image: '/image copy 142.png', desc: 'Shade-Dried Herbs' },
    { name: 'Household supplies', image: '/image copy 143.png', desc: 'Bamboo Utilities' },
    { name: 'Millets & Flakes', image: '/image copy 144.png', desc: 'Healthy Millets' },
    { name: 'Personal hair care', image: '/image copy 145.png', desc: 'Hair Oils & Ubtan' },
    { name: 'Pickles & Powders', image: '/image copy 146.png', desc: 'Avakaya & Podi Karams' },
    { name: 'Pooja supplies', image: '/image copy 147.png', desc: 'Divine Purifiers' },
    { name: 'Ready to eat & cook & fryums', image: '/image copy 148.png', desc: 'Breakfast & Fryums' },
    { name: 'Rices, Flours, Pulses & other', image: '/image copy 149.png', desc: 'Stone-Ground Flours' },
    { name: 'Seasonal Spices & Masala', image: '/image copy 150.png', desc: 'Stone-Ground Spices' },
    { name: 'Sugars, Sweetners & syrups', image: '/image copy 151.png', desc: 'Palm Jaggery & Syrups' },
    { name: 'sweets & snacks', image: '/image copy 152.png', desc: 'Sunnundalu & Hots' },
    { name: 'seeds & Plants', image: '/image copy 153.png', desc: 'Garden Seed Kits' }
  ].map(cat => ({
    ...cat,
    count: products.filter(p => p.category === cat.name).length
  }));

  const heroSlides = [
    { name: 'Pure Natural Traditional Foods', image: '/image copy 157.png', desc: '100% Homemade and Preservative-free Specialties' },
    ...categoriesList
  ];

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setActiveSlideIdx((prevIdx) => (prevIdx + 1) % heroSlides.length);
        setIsFading(false);
      }, 300); // 300ms for exit transition
    }, 2000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[activeSlideIdx];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopNow = () => {
    setSelectedCategory('All');
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-poppins overflow-hidden">
      
      {/* 1. HERO SECTION — FULL-WIDTH PANORAMIC BANNER LAYOUT (Madur.in format) */}
      <section className="relative w-full bg-gradient-to-b from-svada-bg to-white py-8 sm:py-12 md:py-16">
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <span className="absolute top-[20%] left-[10%] text-5xl animate-bounce">🌶️</span>
          <span className="absolute top-[60%] left-[8%] text-6xl rotate-12">🥭</span>
          <span className="absolute top-[30%] right-[15%] text-5xl animate-pulse">🍯</span>
          <span className="absolute bottom-[20%] right-[10%] text-6xl -rotate-45">🌾</span>
        </div>

        <div className="max-w-[1500px] mx-auto px-2 sm:px-4 md:px-6 relative z-10 w-full flex justify-center">
          
          {/* Premium Dynamic Widescreen Banner Slideshow */}
          <div 
            onClick={handleShopNow}
            className="relative w-full rounded-2xl sm:rounded-[32px] shadow-2xl border-2 sm:border-4 border-white transition-all duration-500 bg-gradient-to-br from-[#241206] via-[#3B1E0A] to-stone-900 text-white select-none cursor-pointer group sm:aspect-[2.3/1] md:aspect-[2.8/1] overflow-hidden"
          >
            {/* Inner wrapper — padding & flex layout */}
            <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-8 md:p-10 lg:p-12">
            
              {/* Top Row: Brand tag & Farm Fresh Emblem */}
              <div className="flex items-center justify-between mb-4 sm:mb-0">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15">
                  <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-amber-400">SVADA PREMIUM</span>
                </div>
                
                {/* Circular Fresh Emblem */}
                <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex flex-col items-center justify-center text-[6px] sm:text-[8px] font-bold text-center leading-tight">
                  <span>100%</span>
                  <span className="text-amber-400 font-extrabold">PURE</span>
                  <span>NATURAL</span>
                </div>
              </div>

              {/* ===== MOBILE LAYOUT (< 640px): Stacked vertically ===== */}
              <div className="flex flex-col items-center gap-4 sm:hidden py-2">
                {/* Image first on mobile */}
                <div className="relative flex items-center justify-center w-full">
                  <div className="absolute inset-0 bg-radial from-amber-400/20 to-transparent blur-2xl pointer-events-none" />
                  <img
                    src={activeSlide?.image}
                    alt={activeSlide?.name}
                    className={`h-[140px] w-auto object-contain transition-all duration-500 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] ${
                      isFading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                    }`}
                  />
                </div>

                {/* Text content */}
                <div className="text-center space-y-2 w-full">
                  <div className="inline-flex items-center space-x-1.5 bg-[#B3743B]/20 border border-[#B3743B]/30 px-2.5 py-0.5 rounded-full text-[8px] font-bold text-amber-200 uppercase tracking-wider">
                    <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                    <span>Traditional Homemade Goodness</span>
                  </div>
                  
                  <h3 className="font-outfit font-black text-lg text-white leading-snug uppercase tracking-wide">
                    {activeSlide?.name?.split('&')[0]}<br />
                    <span className="text-amber-300">
                      {activeSlide?.name?.includes('&') 
                        ? `& ${activeSlide?.name?.split('&')[1]}` 
                        : 'Freshly Prepared'}
                    </span>
                  </h3>
                  
                  <p className="text-[10px] text-white/70 font-light leading-relaxed line-clamp-2 px-2">
                    {activeSlide?.desc} — Authentic recipes crafted with love.
                  </p>

                  <div className="flex justify-center pt-1">
                    <button
                      onClick={handleShopNow}
                      className="inline-flex items-center gap-2 bg-[#B3743B] hover:bg-[#9B5F2A] text-white text-[11px] font-bold px-6 py-2.5 rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>SHOP NOW</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ===== DESKTOP LAYOUT (>= 640px): Side-by-side grid ===== */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center my-auto flex-1 w-full">
                {/* Left block: Text & CTA */}
                <div className="col-span-7 space-y-2 md:space-y-4 text-left">
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="inline-flex items-center space-x-1.5 bg-[#B3743B]/20 border border-[#B3743B]/30 px-3 py-0.5 md:py-1 rounded-full text-[10px] font-bold text-amber-200 uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                      <span>Traditional Homemade Goodness</span>
                    </div>
                    
                    <h3 className="font-outfit font-black text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white leading-tight uppercase tracking-wide">
                      {activeSlide?.name?.split('&')[0]}<br />
                      <span className="text-amber-300">
                        {activeSlide?.name?.includes('&') 
                          ? `& ${activeSlide?.name?.split('&')[1]}` 
                          : 'Freshly Prepared'}
                      </span>
                    </h3>
                    
                    <p className="text-xs md:text-sm text-white/80 font-light leading-relaxed max-w-xl line-clamp-1">
                      {activeSlide?.desc} — Authentic recipes crafted cleanly with love.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handleShopNow}
                      className="inline-flex items-center gap-2 bg-[#B3743B] hover:bg-[#9B5F2A] text-white text-xs font-bold px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>SHOP NOW</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] text-white/60 font-semibold hidden md:inline">⚡ Shipped Directly Across India</span>
                  </div>
                </div>

                {/* Right block: Floating Image */}
                <div className="col-span-5 relative flex items-center justify-center min-h-[210px] md:min-h-[300px] lg:min-h-[350px]">
                  <div className="absolute inset-0 bg-radial from-amber-400/20 to-transparent blur-2xl pointer-events-none" />
                  <img
                    src={activeSlide?.image}
                    alt={activeSlide?.name}
                    className={`max-h-[200px] md:max-h-[280px] lg:max-h-[350px] w-auto object-contain transition-all duration-500 drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)] ${
                      isFading ? 'opacity-0 scale-90 -translate-y-3' : 'opacity-100 scale-100 translate-y-0'
                    }`}
                  />
                </div>
              </div>

              {/* Bottom Row: Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-1 pt-3 mt-4 sm:mt-0 border-t border-white/10 text-center">
                <div className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-white/80 leading-tight sm:border-r border-white/10 px-0.5">
                  <span className="block text-amber-400">100% PURE</span>
                  <span>NATURAL &amp; FRESH</span>
                </div>
                <div className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-white/80 leading-tight sm:border-r border-white/10 px-0.5">
                  <span className="block text-amber-400">PREPAID SECURE</span>
                  <span>NO COD SHIPPING</span>
                </div>
                <div className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-white/80 leading-tight sm:border-r border-white/10 px-0.5">
                  <span className="block text-amber-400">NO ADDED</span>
                  <span>PRESERVATIVES</span>
                </div>
                <div className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-white/80 leading-tight px-0.5">
                  <span className="block text-amber-400">SOURCED DIRECT</span>
                  <span>FROM NATURAL FARMS</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION (madur.in inspired format) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block">
              Taste the Goodness
            </span>
            <h2 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
              Shop by Category
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#3B1E0A] to-[#C2824B] rounded-full mx-auto" />
            <p className="text-sm text-svada-light font-light leading-relaxed">
              Fiery traditional pickles, stone-ground flours, aroma-locked spices, hand-pressed sweets, and natural herbal products prepared cleanly with grandmother recipes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoriesList.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleCategorySelect(cat.name)}
                className="bg-white border border-orange-100/70 rounded-2xl text-center cursor-pointer transition-all duration-300 shadow-xs hover:shadow-xl hover:border-accent hover:-translate-y-1.5 group flex flex-col overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                {/* Category Image */}
                <div className="w-full aspect-[3/2] overflow-hidden bg-[#FAF7F2] flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Category Info */}
                <div className="px-3 py-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-outfit font-black text-svada-dark text-xs tracking-wide group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-svada-light font-light mt-0.5 leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="text-[9px] font-extrabold text-accent uppercase tracking-widest mt-2 flex items-center justify-center gap-1 group-hover:text-primary transition-colors duration-300">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. BEST SELLING PRODUCTS (CAROUSEL / GRID) */}
      <section className="py-20 bg-svada-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="text-left space-y-2 max-w-xl">
              <span className="text-xs font-bold text-primary tracking-widest uppercase block">
                Highest Rated Condiments
              </span>
              <h2 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
                Bestselling Traditional Delicacies
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-[#3B1E0A] to-[#C2824B] rounded-full" />
            </div>
            <button
              onClick={handleShopNow}
              className="text-xs font-bold text-primary hover:text-secondary flex items-center space-x-1.5 border-b-2 border-primary/20 pb-1 mt-4 md:mt-0 transition"
            >
              <span>View All 35+ Specialties</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. HEALTHY LIFESTYLE STORY BANNER */}
      <section className="relative py-24 bg-gradient-to-b from-[#2B1B15] to-[#1A0F0C] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-950/20 via-black/40 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story Image container */}
            <div className="relative order-2 lg:order-1" data-aos="fade-right">
              <div className="aspect-video sm:aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border-4 border-orange-950/60 shadow-2xl relative bg-[#F5EDD6]">
                <img
                  src="/image copy 155.png"
                  alt="SVADA Traditional Foods"
                  className="w-full h-full object-contain"
                />
                
                {/* Floating micro highlights */}
                <div className="absolute bottom-6 right-6 bg-[#3B1E0A]/95 text-amber-200 text-xs font-semibold py-1.5 px-3 rounded-xl border border-amber-500/20">
                  🍃 Pure Sesame / Groundnut Oils
                </div>
              </div>
            </div>

            {/* Story Left Description */}
            <div className="space-y-6 text-left order-1 lg:order-2" data-aos="fade-left">
              <span className="text-xs font-bold text-secondary tracking-widest uppercase block">
                The Heritage Kitchen Story
              </span>
              <h2 className="font-outfit font-black text-3xl sm:text-4xl text-white">
                Reviving Traditional Indian Clean Eating
              </h2>
              <div className="h-1 bg-primary w-20 rounded-full" />
              
              <p className="text-sm text-orange-100/80 leading-relaxed font-light">
                In modern times, factory-made foods are laden with chemical shelf-stabilizers, cheap refined oils, artificial coloring, and bulk shortcuts. SVADA was founded to revive the clean, authentic preparation techniques of our grandmothers.
              </p>
              
              <p className="text-sm text-orange-100/80 leading-relaxed font-light">
                We wash our ingredients cleanly, solar-cure raw vegetables under direct sunlight, dry-roast whole spices gently, and stone-grind condiments slow. No machinery shortcuts, no cheap oils, and zero compromises.
              </p>

              {/* Grid highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-950/60">
                <div className="flex items-start space-x-2">
                  <Leaf className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm text-white">Cold-Pressed Oils</h5>
                    <p className="text-xs text-orange-200/50">Groundnut and Gingelly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Award className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm text-white">Natural Sweeteners</h5>
                    <p className="text-xs text-orange-200/50">Pure Dark Jaggery</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('about')}
                  className="bg-primary hover:bg-secondary text-white py-3 px-6 rounded-xl font-bold text-xs shadow-md transition duration-300 flex items-center space-x-2"
                >
                  <span>Explore Our Preparation Process</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE SVADA — PREMIUM DESIGNS SPLIT PRESENTATION IN BRAND BROWN */}
      <section className="py-24 bg-gradient-to-br from-[#3B1E0A] via-[#5C3011] to-[#241206] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-amber-300 tracking-widest uppercase block">
              Our Core Trust Elements
            </span>
            <h2 className="font-outfit font-black text-white text-3xl sm:text-4xl">
              Why Customers Love & Trust SVADA
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up">
            
            {/* Box 1: Celebrating the art of tradition */}
            <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400 hover:shadow-2xl rounded-[32px] p-8 text-left flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-6">
                <div className="bg-white/10 text-amber-300 group-hover:bg-amber-400 group-hover:text-[#3B1E0A] w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-colors duration-300 flex-shrink-0">
                  <Flame className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-outfit font-black text-white text-base tracking-wider uppercase mb-3.5 group-hover:text-amber-300 transition-colors duration-300">
                    Art of Tradition
                  </h4>
                  <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed font-semibold italic border-l-2 border-amber-400 pl-3.5">
                    "Celebrating the art of tradition — from kitchen to craft."
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Where flavors meet craftsmanship */}
            <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400 hover:shadow-2xl rounded-[32px] p-8 text-left flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-6">
                <div className="bg-white/10 text-amber-300 group-hover:bg-amber-400 group-hover:text-[#3B1E0A] w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-colors duration-300 flex-shrink-0">
                  <Sparkles className="h-7 w-7 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-outfit font-black text-white text-base tracking-wider uppercase mb-3.5 group-hover:text-amber-300 transition-colors duration-300">
                    Flavors & Craftsmanship
                  </h4>
                  <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed font-semibold italic border-l-2 border-amber-400 pl-3.5">
                    "Where flavors meet craftsmanship, and culture comes alive."
                  </p>
                </div>
              </div>
            </div>

            {/* Box 3: Preserving heritage */}
            <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400 hover:shadow-2xl rounded-[32px] p-8 text-left flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-6">
                <div className="bg-white/10 text-amber-300 group-hover:bg-amber-400 group-hover:text-[#3B1E0A] w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs transition-colors duration-300 flex-shrink-0">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-outfit font-black text-white text-base tracking-wider uppercase mb-3.5 group-hover:text-amber-300 transition-colors duration-300">
                    Preserving Heritage
                  </h4>
                  <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed font-semibold italic border-l-2 border-amber-400 pl-3.5">
                    "Preserving heritage, one taste and touch at a time."
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SPECIAL OFFERS SAFFRON BANNER */}
      <section className="py-10 bg-gradient-to-r from-[#3B1E0A] to-[#6E3C18] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
          
          <div className="space-y-1">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Limited Festive Special
            </span>
            <h3 className="font-outfit font-black text-2xl sm:text-3xl">
              Buy Fresh Homemade Sweets & Laddus
            </h3>
            <p className="text-sm text-orange-50 font-light">
              Get pure Cow Ghee Bellam Sunnundalu & Ragi Dry Fruit Laddus prepared fresh today!
            </p>
          </div>
          
          <button
            onClick={handleShopNow}
            className="bg-white text-[#3B1E0A] hover:bg-orange-50 py-3.5 px-8 rounded-xl font-bold text-xs shadow-md transition duration-300 cursor-pointer flex items-center space-x-2"
          >
            <span>Order Laddus & Snacks Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-svada-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block">
              Verified User Stories
            </span>
            <h2 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
              What Our Happy Customers Say
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#3B1E0A] to-[#C2824B] rounded-full mx-auto" />
          </div>

          {/* Testimonials Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xs border border-orange-100/50 text-left relative space-y-4" data-aos="fade-up">
              <span className="text-6xl text-primary/10 absolute top-4 left-4 font-serif">“</span>
              <div className="flex text-amber-500 relative z-10">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-xs sm:text-sm text-svada-light font-light leading-relaxed relative z-10">
                "The Mamidikaya Avakaya pickle took me straight back to my childhood. The aroma of raw mangoes and fresh mustard oil is exactly how my grandmother used to prepare it. Absolute perfection, ordering again!"
              </p>
              <div className="border-t border-orange-50 pt-4 flex items-center space-x-3">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary">
                  KR
                </div>
                <div>
                  <h5 className="font-bold text-sm text-svada-dark">Kiran Reddy</h5>
                  <p className="text-[10px] text-svada-light">Hyderabad, Telangana</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xs border border-orange-100/50 text-left relative space-y-4" data-aos="fade-up" data-aos-delay="100">
              <span className="text-6xl text-primary/10 absolute top-4 left-4 font-serif">“</span>
              <div className="flex text-amber-500 relative z-10">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-xs sm:text-sm text-svada-light font-light leading-relaxed relative z-10">
                "Finding chemical-free sugar-free healthy sweets is impossible now. SVADA's Ragi Dry Fruit Laddus are unbelievably tasty and naturally sweetened with dates. Highly recommend for diabetic diets."
              </p>
              <div className="border-t border-orange-50 pt-4 flex items-center space-x-3">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary">
                  PR
                </div>
                <div>
                  <h5 className="font-bold text-sm text-svada-dark">Priya Ramarao</h5>
                  <p className="text-[10px] text-svada-light">Bangalore, Karnataka</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xs border border-orange-100/50 text-left relative space-y-4" data-aos="fade-up" data-aos-delay="200">
              <span className="text-6xl text-primary/10 absolute top-4 left-4 font-serif">“</span>
              <div className="flex text-amber-500 relative z-10">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-xs sm:text-sm text-svada-light font-light leading-relaxed relative z-10">
                "The A2 Vedic Cow Ghee has that perfect grainy texture and amazing aroma! When mixed with hot rice and their Gongura pickle, it's absolute heaven. So happy with the premium quality."
              </p>
              <div className="border-t border-orange-50 pt-4 flex items-center space-x-3">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary">
                  VS
                </div>
                <div>
                  <h5 className="font-bold text-sm text-svada-dark">Venkatesh S.</h5>
                  <p className="text-[10px] text-svada-light">Chennai, Tamil Nadu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
          7.5 WATCH & BUY — DYNAMIC SHOPPABLE VIDEO REELS SECTION
      ------------------------------------------------------------ */}
      <section className="py-24 bg-white border-t border-orange-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Section Title */}
          <div className="max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block">
              shoppable video feed
            </span>
            <h2 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
              Watch & Buy
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#3B1E0A] to-[#C2824B] rounded-full mx-auto" />
            <p className="text-sm text-svada-light font-light leading-relaxed mt-4">
              Watch our traditional preparation videos and shop the authentic ingredients directly from the reel. Hover to play!
            </p>
          </div>

          {/* Shoppable Reels — Horizontal scroll on mobile, Grid on desktop */}
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {watchBuyVideos.map((reel) => {
              const product = getProductForVideo(reel.keyword);
              return (
                <div 
                  key={reel.id}
                  onClick={() => {
                    setActiveReel(reel);
                    setReelMuted(false);
                  }}
                  className="relative flex-shrink-0 w-[180px] sm:w-auto aspect-[9/14] sm:aspect-[9/16] rounded-2xl sm:rounded-[28px] overflow-hidden bg-black shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 select-none group cursor-pointer border border-[#3B1E0A]/10 snap-start"
                  data-aos="fade-up"
                >
                  
                  {/* Playable Video Source */}
                  <video
                    src={reel.videoUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/40 backdrop-blur-xs px-2.5 sm:px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-white">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[8px] sm:text-[9px] font-black tracking-widest uppercase">RECIPES</span>
                  </div>

                  {/* Center Play Icon Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 group-hover:opacity-0 transition duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-lg">
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-3 sm:bottom-4 left-2.5 right-2.5 sm:left-3 sm:right-3 bg-black/45 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-left border border-white/10">
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-amber-300 uppercase tracking-widest block">Video Reel</span>
                    <h4 className="text-[10px] sm:text-[11px] font-bold text-white truncate leading-snug mt-0.5">{reel.title}</h4>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. PREPAID NO COD & SHIPPING SUMMARY NOTE */}
      <section className="py-12 bg-orange-50 border-t border-orange-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-left flex flex-col md:flex-row items-center justify-between gap-6" data-aos="fade-up">
            <div className="space-y-1">
              <h4 className="font-outfit font-black text-red-800 text-lg flex items-center">
                🛑 Crucial Ordering & Payment Note
              </h4>
              <p className="text-xs text-red-700 font-light leading-relaxed">
                As all food products are custom prepared upon order under clean, natural, and preservative-free guidelines, we operate on a <strong>prepaid basis only (No COD available)</strong>. Shipping costs are charged extra based on the dynamic carrier weight rates.
              </p>
            </div>
            <button
              onClick={handleShopNow}
              className="bg-primary text-white hover:bg-secondary py-2.5 px-6 rounded-xl font-bold text-xs shadow-md transition duration-300 w-full md:w-auto text-center"
            >
              Understand & Shop
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
          WATCH & BUY — FULLSCREEN SHOOTABLE REEL OVERLAY MODAL
      ------------------------------------------------------------ */}
      {activeReel && (() => {
        const product = getProductForVideo(activeReel.keyword);
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in text-white">
            
            {/* Modal Box */}
            <div className="relative w-full max-w-4xl bg-[#1A0F0C] rounded-[36px] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-[85vh] max-h-[750px]">
              
              {/* Top Close Button */}
              <button 
                onClick={() => setActiveReel(null)}
                className="absolute top-4 right-4 z-[110] w-10 h-10 rounded-full bg-black/55 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition cursor-pointer"
                title="Close Player"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Column 1: Video Player Container (60% width) */}
              <div className="w-full md:w-3/5 h-1/2 md:h-full bg-black relative flex items-center justify-center">
                <video
                  src={activeReel.videoUrl}
                  autoPlay
                  loop
                  muted={reelMuted}
                  playsInline
                  className="w-full h-full object-cover opacity-90"
                />
                
                {/* Overlay Sound Button */}
                <button
                  onClick={() => setReelMuted(!reelMuted)}
                  className="absolute bottom-6 left-6 z-30 w-10 h-10 rounded-full bg-black/50 border border-white/25 flex items-center justify-center text-white hover:bg-black/75 transition cursor-pointer"
                  title={reelMuted ? 'Unmute Sound' : 'Mute Sound'}
                >
                  {reelMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                </button>
              </div>

              {/* Column 2: Product Shop details (40% width) */}
              <div className="w-full md:w-2/5 h-1/2 md:h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-left space-y-6">
                
                {/* Reel Header */}
                <div className="space-y-2">
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    Shoppable Video
                  </span>
                  <h3 className="font-outfit font-black text-xl sm:text-2xl text-white leading-tight">
                    {activeReel.title}
                  </h3>
                  <p className="text-xs text-orange-100/70 font-light leading-relaxed">
                    {activeReel.desc}
                  </p>
                </div>



                {/* Bottom support text */}
                <div className="text-[10px] text-orange-200/40 text-center leading-normal pt-4 border-t border-white/5">
                  ✓ Hygienic Prepared &amp; Worldwide Packed Delivery
                </div>

              </div>

            </div>

          </div>
        );
      })()}

    </div>
  );
}
