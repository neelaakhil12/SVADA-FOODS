import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, ShoppingBag, Heart, Star, ShieldCheck, Check, Minus, Plus } from 'lucide-react';

export default function QuickViewModal() {
  const { activeQuickView, setActiveQuickView, addToCart, wishlist, toggleWishlist, getProductPrice } = useContext(ShopContext);
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Sync selectedWeight and quantity resets when modal target changes
  useEffect(() => {
    if (activeQuickView) {
      setSelectedWeight(
        activeQuickView.weightLabels && activeQuickView.weightLabels.length > 0
          ? activeQuickView.weightLabels[0].value
          : '250g'
      );
      setQuantity(1);
      isAdded && setIsAdded(false);
    }
  }, [activeQuickView]);

  if (!activeQuickView) return null;

  const product = activeQuickView;
  const price = getProductPrice(product, selectedWeight);
  const isInWishlist = wishlist.includes(product.id);

  // Helper to generate realistic MRP and discount percentages matching madur.in pricing structure
  const getMrpAndDiscount = (offerPrice) => {
    const rawMrp = offerPrice * 1.15; // 15% markup as original price
    const mrp = Math.ceil(rawMrp / 5) * 5 - 1; // Ends in 9 or 4 for psychological pricing
    const discountPct = Math.round(((mrp - offerPrice) / mrp) * 100);
    const savings = mrp - offerPrice;
    return { mrp, discountPct, savings };
  };

  const { mrp, discountPct, savings } = getMrpAndDiscount(price);

  const weightLabels = product.weightLabels
    ? product.weightLabels
    : product.isEcoPiece 
      ? [
          { value: '250g', label: '1 Piece' },
          { value: '500g', label: '2 Pack' },
          { value: '1kg', label: '4 Pack' }
        ]
      : [
          { value: '250g', label: '250 grams' },
          { value: '500g', label: '500 grams' },
          { value: '1kg', label: '1 Kilogram' }
        ];

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark blur backdrop */}
      <div 
        onClick={() => setActiveQuickView(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Box */}
      <div 
        className="bg-svada-card w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-orange-100 relative z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] md:max-h-none overflow-y-auto animate-zoom-in font-poppins"
        data-aos="zoom-in"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveQuickView(null)}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/90 border border-orange-100 text-svada-dark hover:text-primary transition duration-300 shadow-md"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product Image section */}
        <div className="relative bg-white aspect-square md:aspect-auto md:h-full min-h-[300px] flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Info section */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-1.5">
              {product.category}
            </span>
            <h2 className="font-outfit font-black text-svada-dark text-2xl md:text-3xl leading-tight mb-2">
              {product.name}
            </h2>

            {/* Ratings and Reviews */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="text-xs text-amber-800 font-bold ml-1.5">{product.rating}</span>
              </div>
              <span className="text-xs text-svada-light font-medium">({product.reviews} customer reviews)</span>
            </div>

            {/* Description */}
            <p className="text-sm text-svada-light font-light leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Ingredients Disclosure */}
            {product.ingredients && (
              <div className="bg-orange-50/70 border border-orange-100/50 rounded-2xl p-4 mb-6">
                <span className="text-[11px] font-bold text-primary tracking-widest uppercase block mb-1">
                  🌿 100% Honest Ingredients
                </span>
                <p className="text-xs text-svada-dark font-medium leading-relaxed italic">
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* Trust highlights */}
            <div className="flex items-center space-x-4 mb-6 text-xs text-svada-dark font-medium">
              <div className="flex items-center text-accent">
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                <span>Zero Chemicals</span>
              </div>
              <div className="flex items-center text-accent">
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                <span>Homemade Care</span>
              </div>
            </div>
          </div>

          <div>
            {/* Weight and Qty Controls */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-[11px] text-svada-light font-bold uppercase tracking-wider block mb-1.5">
                  Choose Pack Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {weightLabels.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedWeight(opt.value)}
                      className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-bold transition duration-300 border ${
                        selectedWeight === opt.value
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-orange-50/50 text-svada-dark border-orange-100 hover:bg-orange-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-svada-light font-bold uppercase tracking-wider block mb-1.5">
                  Select Quantity
                </label>
                <div className="flex items-center bg-orange-50 border border-orange-100 rounded-xl px-2 py-1.5 w-max">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="p-1 rounded-lg hover:bg-orange-200 text-svada-dark transition"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold text-svada-dark min-w-[30px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded-lg hover:bg-orange-200 text-svada-dark transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions pricing & Add-to-cart */}
            <div className="flex items-center justify-between pt-4 border-t border-orange-100/60">
              <div>
                <span className="text-[10px] text-svada-light block font-bold uppercase leading-none mb-1">
                  Special Offer Price
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl md:text-3xl font-outfit font-black text-accent">
                    ₹{price * quantity}
                  </span>
                  <span className="text-sm text-svada-light/60 line-through font-semibold">
                    ₹{mrp * quantity}
                  </span>
                  <span className="bg-red-50 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Save ₹{savings * quantity}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border border-orange-100 shadow-xs transition duration-300 ${
                    isInWishlist 
                      ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                      : 'bg-white text-svada-dark hover:bg-orange-50'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
                </button>
                
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-300 ${
                    isAdded
                      ? 'bg-accent text-white scale-95'
                      : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 active:scale-95'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>{isAdded ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
