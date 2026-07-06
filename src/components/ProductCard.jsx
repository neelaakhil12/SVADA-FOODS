import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, Eye } from 'lucide-react';

const getShortCategoryName = (category) => {
  const mapping = {
    'Cold Pressed oils & Ghee & honey': 'Oils & Ghee',
    'Drinks & Tea': 'Drinks & Tea',
    'Dry fruits, Nuts & seeds': 'Dry Fruits',
    'Herb Extract Foods': 'Herbs',
    'Herbs & Extracts': 'Herbs',
    'Household supplies': 'Household',
    'Millets & Flakes': 'Millets',
    'Personal hair care': 'Hair Care',
    'Pickles & Powders': 'Pickles & Powders',
    'Pooja supplies': 'Pooja',
    'Ready to eat & cook & fryums': 'Ready to Cook',
    'Rices, Flours, Pulses & other': 'Rices & Flours',
    'Seasonal Spices & Masala': 'Spices',
    'seeds & Plants': 'Seeds & Plants',
    'Sugars, Sweetners & syrups': 'Sweeteners',
    'sweets & snacks': 'Sweets & Snacks'
  };
  return mapping[category] || 'General';
};

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, wishlist, toggleWishlist, getProductPrice, setActiveQuickView, isLoggedIn, setCurrentPage } = useContext(ShopContext);
  
  // Weight Selection State: default is first weight label or 250g
  const [selectedWeight, setSelectedWeight] = useState(
    product.weightLabels && product.weightLabels.length > 0
      ? product.weightLabels[0].value
      : '250g'
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleProductClick = (e) => {
    if (e) e.stopPropagation();
    setActiveQuickView(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const weightLabels = product.weightLabels
    ? product.weightLabels
    : product.isEcoPiece 
      ? [
          { value: '250g', label: '1 Piece' },
          { value: '500g', label: '2 Pack' },
          { value: '1kg', label: '4 Pack' }
        ]
      : [
          { value: '250g', label: '250g' },
          { value: '500g', label: '500g' },
          { value: '1kg', label: '1kg' }
        ];

  const price = getProductPrice(product, selectedWeight);
  const isInWishlist = wishlist.includes(product.id);

  // Helper to generate realistic MRP and discount percentages matching madur.in pricing structure
  const getMrpAndDiscount = (offerPrice) => {
    const rawMrp = offerPrice * 1.15; // 15% markup as original price
    const mrp = Math.ceil(rawMrp / 5) * 5 - 1; // Ends in 9 or 4 for psychological pricing
    const discountPct = Math.round(((mrp - offerPrice) / mrp) * 100);
    return { mrp, discountPct };
  };

  const { mrp, discountPct } = getMrpAndDiscount(price);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    addToCart(product, selectedWeight, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div 
      className="bg-white rounded-[32px] border border-orange-100/60 shadow-xs hover:shadow-xl hover:border-accent transition-all duration-300 flex flex-col group relative overflow-hidden transform hover:-translate-y-1.5 p-4"
      data-aos="fade-up"
      data-aos-delay={(index % 3) * 100}
    >

      {/* 2. WISHLIST BUTTON */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-md text-svada-dark hover:text-red-500 hover:scale-110 transition duration-300 border border-orange-50"
        title="Add to Wishlist"
      >
        <Heart 
          className={`h-4 w-4 transition duration-300 ${
            isInWishlist ? 'fill-red-500 text-red-500' : 'text-svada-dark'
          }`} 
        />
      </button>

      {/* 3. PRODUCT IMAGE CONTAINER */}
      <div 
        className="relative aspect-[4/3] overflow-hidden bg-[#FAF7F2] cursor-pointer rounded-2xl border border-orange-100/40 mb-3" 
        onClick={handleProductClick}
      >
        {product.inStock === false && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
              Out of Stock
            </span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out p-1"
          loading={index < 6 ? 'eager' : 'lazy'}
          fetchPriority={index < 3 ? 'high' : 'auto'}
          decoding={index < 6 ? 'sync' : 'async'}
        />
        {/* Overlay Hover details */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleProductClick}
            className="bg-white text-accent p-2.5 rounded-full shadow-lg hover:bg-accent hover:text-white transform translate-y-4 group-hover:translate-y-0 transition duration-300"
            title="Quick View"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* 4. PRODUCT INFO */}
      <div className="flex-1 flex flex-col justify-between px-1">
        <div>
          {/* Sub-category tag & Weight Tag Row */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold text-accent bg-[#3B1E0A]/5 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {getShortCategoryName(product.category)}
            </span>
            <span className="text-[10px] text-svada-light/80 font-bold uppercase tracking-wider">
              {weightLabels.find(opt => opt.value === selectedWeight)?.label || selectedWeight}
            </span>
          </div>

          {/* Title */}
          <h3 
            className="font-outfit font-black text-svada-dark text-[15px] hover:text-primary transition duration-300 cursor-pointer line-clamp-2 min-h-[40px] mb-1 leading-snug"
            onClick={handleProductClick}
          >
            {product.name}
          </h3>

          {/* View Details Link */}
          <button
            onClick={handleProductClick}
            className="text-[9px] font-extrabold text-accent hover:text-[#9B5F2A] uppercase tracking-widest hover:underline cursor-pointer flex items-center gap-1 mb-2"
          >
            VIEW DETAILS
          </button>

          {/* Pack Size Selector Dropdown */}
          {product.inStock !== false && (
            <div className="mb-3">
              <label className="text-[9px] text-svada-light font-bold uppercase tracking-widest block mb-1">
                Choose Size
              </label>
              <div className="relative">
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className="w-full bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-orange-100 text-xs font-bold text-svada-dark px-3 py-2 rounded-xl focus:outline-none focus:border-accent transition duration-200 cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23B3743B'><path d='M7 10l5 5 5-5H7z'/></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px',
                    paddingRight: '28px'
                  }}
                >
                  {weightLabels.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} - ₹{getProductPrice(product, opt.value)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Pricing & Add to Cart button */}
          <div className="flex items-center justify-between pt-3 border-t border-orange-50/60">
            <div>
              <span className="text-[9px] text-svada-light/80 block leading-none font-bold uppercase mb-1">Special Price</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-outfit font-black text-accent">₹{price}</span>
                <span className="text-xs text-svada-light/60 line-through font-semibold">₹{mrp}</span>
              </div>
            </div>
            <button
              onClick={product.inStock !== false ? handleAddToCart : undefined}
              disabled={product.inStock === false}
              className={`flex items-center space-x-1 px-4 py-2 rounded-xl font-extrabold text-xs shadow-xs hover:shadow-md transition-all duration-300 ${
                product.inStock === false
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300/40'
                  : isAdded
                  ? 'bg-accent text-white scale-95'
                  : 'bg-accent hover:bg-[#9B5F2A] text-white active:scale-95'
              }`}
            >
              <span>{product.inStock === false ? 'No Stock' : isAdded ? 'Added ✓' : 'Add ＋'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
