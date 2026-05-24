import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ShieldCheck, Heart, Award, Flame, Sparkles, MessageCircle, Star, Truck, ShieldAlert } from 'lucide-react';

export default function Home() {
  const { products, setCurrentPage, setSelectedCategory } = useContext(ShopContext);

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

  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setActiveCategoryIdx((prevIdx) => (prevIdx + 1) % categoriesList.length);
        setIsFading(false);
      }, 300); // 300ms for exit transition
    }, 2000);
    return () => clearInterval(timer);
  }, [categoriesList.length]);

  const activeCategory = categoriesList[activeCategoryIdx];

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
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen bg-gradient-to-br from-svada-bg via-[#FFF5E6] to-orange-50 flex items-center pt-48 md:pt-56 pb-16">
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <span className="absolute top-[20%] left-[10%] text-5xl animate-bounce">🌶️</span>
          <span className="absolute top-[60%] left-[8%] text-6xl rotate-12">🥭</span>
          <span className="absolute top-[30%] right-[15%] text-5xl animate-pulse">🍯</span>
          <span className="absolute bottom-[20%] right-[10%] text-6xl -rotate-45">🌾</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="text-left space-y-6" data-aos="fade-right">
              <div className="inline-flex items-center space-x-2 bg-orange-100 border border-orange-200 px-4 py-2 rounded-full text-xs font-bold text-primary">
                <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
                <span>100% HOMEMADE & FRESHLY PREPARED</span>
              </div>
              
              <h1 className="font-outfit font-black text-4xl sm:text-5xl lg:text-6xl text-svada-dark leading-tight">
                Authentic Telugu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Homemade Foods</span> Crafted with Love.
              </h1>
              
              <p className="text-sm sm:text-base text-svada-light font-light leading-relaxed max-w-xl">
                Relish the rich, authentic taste of traditional Andhra and Telangana kitchens. Healthy pickles, stone-ground flours, aroma-locked spices, hand-pressed sweets, and organic herbal products prepared cleanly with heritage recipes.
              </p>

              {/* No COD & Free Shipping info bar */}
              <div className="bg-white/80 backdrop-blur-xs border border-orange-100 p-4 rounded-2xl flex items-start space-x-3 max-w-md">
                <ShieldAlert className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-svada-dark block">⚡ Prepaid Shipment Policy</span>
                  <span className="text-svada-light">No Cash on Delivery. Made fresh on order and shipped directly across India. Shipping charges extra.</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={handleShopNow}
                  className="bg-gradient-to-r from-primary to-secondary text-white py-3.5 px-8 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Shop Traditional Foods</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="bg-white border border-orange-200 text-svada-dark hover:text-primary hover:bg-orange-50/50 py-3.5 px-8 rounded-xl font-bold text-sm shadow-xs transition duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Our Story & Values</span>
                </button>
              </div>
            </div>

            {/* Hero Right Banner Image */}
            <div className="relative" data-aos="zoom-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-3xl" />
              
              {/* Premium Image Container */}
              <div className="relative mx-auto w-full max-w-xl aspect-[3/2] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-500 bg-white flex items-center justify-center">
                <img
                  src={activeCategory?.image}
                  alt={activeCategory?.name}
                  className={`w-full h-full object-cover transition-all duration-300 ease-in-out ${
                    isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                />
                
                {/* Floating Category overlay */}
                <div className={`absolute bottom-3 left-3 sm:bottom-6 sm:left-6 glass p-2.5 sm:p-4 rounded-2xl shadow-lg border border-white/40 flex items-center space-x-2 sm:space-x-3 transition-all duration-300 max-w-[85%] z-10 ${
                  isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}>
                  <div className="bg-gradient-to-r from-primary to-secondary p-1.5 sm:p-2 rounded-xl text-white font-bold text-xs sm:text-sm flex-shrink-0">
                    5.0 ★
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-[10px] sm:text-xs text-svada-dark leading-tight truncate">{activeCategory?.name}</h5>
                    <p className="text-[8px] sm:text-[10px] text-svada-light truncate">{activeCategory?.desc}</p>
                  </div>
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
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
            <p className="text-sm text-svada-light font-light leading-relaxed">
              Fiery traditional pickles, stone-ground flours, aroma-locked spices, hand-pressed sweets, and organic herbal products prepared cleanly with grandmother recipes.
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
              <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full" />
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
                <div className="absolute top-6 left-6 bg-[#D94F04]/90 text-white text-xs font-semibold py-1.5 px-3 rounded-xl">
                  🥣 Slow Cooked in Copper
                </div>
                <div className="absolute bottom-6 right-6 bg-emerald-950/90 text-emerald-300 text-xs font-semibold py-1.5 px-3 rounded-xl border border-emerald-500/20">
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

      {/* 5. WHY CHOOSE SVADA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block">
              Our Core Trust Elements
            </span>
            <h2 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
              Why Customers Love & Trust SVADA
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-svada-bg rounded-3xl border border-orange-100/50 hover:shadow-md transition duration-300 text-center" data-aos="fade-up">
              <div className="bg-orange-100 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="font-outfit font-bold text-svada-dark text-lg mb-2">100% Preservative Free</h4>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Zero vinegar, chemical coloring, citric acid, or synthetic stabilizers. Made only with premium sea-salt and organic oil.
              </p>
            </div>
            
            <div className="p-6 bg-svada-bg rounded-3xl border border-orange-100/50 hover:shadow-md transition duration-300 text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-orange-100 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6" />
              </div>
              <h4 className="font-outfit font-bold text-svada-dark text-lg mb-2">Cold Pressed Oil Only</h4>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                We never use cheap palm, cottonseed, or refined sunflower oil. We utilize authentic, aromatic wood-pressed oils.
              </p>
            </div>

            <div className="p-6 bg-svada-bg rounded-3xl border border-orange-100/50 hover:shadow-md transition duration-300 text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-orange-100 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="font-outfit font-bold text-svada-dark text-lg mb-2">Stone Ground Quality</h4>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Fresh powders, spice mixes, and podi are stone-ground to preserve flavor and locking original nutrient structures.
              </p>
            </div>

            <div className="p-6 bg-svada-bg rounded-3xl border border-orange-100/50 hover:shadow-md transition duration-300 text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-orange-100 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h4 className="font-outfit font-bold text-svada-dark text-lg mb-2">Pan India Direct Shipping</h4>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Carefully double-packed in leak-proof jars and vacuum bags, safely delivered straight to your home across India.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SPECIAL OFFERS SAFFRON BANNER */}
      <section className="py-10 bg-gradient-to-r from-primary to-secondary text-white relative">
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
            className="bg-white text-primary hover:bg-orange-50 py-3.5 px-8 rounded-xl font-bold text-xs shadow-md transition duration-300 cursor-pointer flex items-center space-x-2"
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
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
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

      {/* 8. PREPAID NO COD & SHIPPING SUMMARY NOTE */}
      <section className="py-12 bg-orange-50 border-t border-orange-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-left flex flex-col md:flex-row items-center justify-between gap-6" data-aos="fade-up">
            <div className="space-y-1">
              <h4 className="font-outfit font-black text-red-800 text-lg flex items-center">
                🛑 Crucial Ordering & Payment Note
              </h4>
              <p className="text-xs text-red-700 font-light leading-relaxed">
                As all food products are custom prepared upon order under clean, organic, and preservative-free guidelines, we operate on a <strong>prepaid basis only (No COD available)</strong>. Shipping costs are charged extra based on the dynamic carrier weight rates.
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

    </div>
  );
}
