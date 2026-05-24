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
  const { addToCart, wishlist, toggleWishlist, getProductPrice, setActiveQuickView } = useContext(ShopContext);
  
  // Weight Selection State: default is first weight label or 250g
  const [selectedWeight] = useState(
    product.weightLabels && product.weightLabels.length > 0
      ? product.weightLabels[0].value
      : '250g'
  );
  const [isAdded, setIsAdded] = useState(false);

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
        onClick={() => setActiveQuickView(product)}
      >
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
            onClick={(e) => {
              e.stopPropagation();
              setActiveQuickView(product);
            }}
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
            <span className="text-[9px] font-bold text-accent bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {getShortCategoryName(product.category)}
            </span>
            <span className="text-[10px] text-svada-light/80 font-bold uppercase tracking-wider">
              {product.weightLabels 
                ? (product.weightLabels.find(opt => opt.value === selectedWeight)?.label || selectedWeight)
                : selectedWeight === '250g' ? (product.isEcoPiece ? '1 Pc' : '250g') : 
                  selectedWeight === '500g' ? (product.isEcoPiece ? '2 Pcs' : '500g') : 
                  (product.isEcoPiece ? '4 Pcs' : '1kg')}
            </span>
          </div>

          {/* Title */}
          <h3 
            className="font-outfit font-black text-svada-dark text-[15px] hover:text-primary transition duration-300 cursor-pointer line-clamp-2 min-h-[40px] mb-1 leading-snug"
            onClick={() => setActiveQuickView(product)}
          >
            {product.name}
          </h3>

          {/* View Details Link */}
          <button
            onClick={() => setActiveQuickView(product)}
            className="text-[9px] font-extrabold text-accent hover:text-emerald-700 uppercase tracking-widest hover:underline cursor-pointer flex items-center gap-1 mb-2.5"
          >
            VIEW DETAILS
          </button>
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
              onClick={handleAddToCart}
              className={`flex items-center space-x-1 px-4 py-2 rounded-xl font-extrabold text-xs shadow-xs hover:shadow-md transition-all duration-300 ${
                isAdded
                  ? 'bg-accent text-white scale-95'
                  : 'bg-accent hover:bg-emerald-700 text-white active:scale-95'
              }`}
            >
              <span>{isAdded ? 'Added ✓' : 'Add ＋'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
