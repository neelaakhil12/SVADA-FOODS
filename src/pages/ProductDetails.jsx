import React, { useState, useContext, useEffect, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, ShoppingBag, Heart, Star, ShieldCheck, Minus, Plus, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { activeQuickView, setActiveQuickView, addToCart, wishlist, toggleWishlist, getProductPrice, isLoggedIn, setCurrentPage, products } = useContext(ShopContext);
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const pageContainerRef = useRef(null);

  const handleShare = async () => {
    if (!activeQuickView) return;
    const rawUrl = window.location.origin + `/product?id=${activeQuickView.id}`;
    const textStr = `Check out ${activeQuickView.name} on SVADA Homemade Farms!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeQuickView.name,
          text: textStr,
          url: rawUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for desktop: Redirect to WhatsApp
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textStr + '\n' + rawUrl)}`;
      window.open(waUrl, '_blank');
    }
  };

  const handleCopyLink = () => {
    if (!activeQuickView) return;
    const rawUrl = window.location.origin + `/product?id=${activeQuickView.id}`;
    navigator.clipboard.writeText(rawUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  // Parse product from URL if activeQuickView is null (e.g. direct load/reload)
  useEffect(() => {
    if (!activeQuickView && products && products.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      const productId = searchParams.get('id') || searchParams.get('product');
      if (productId) {
        const found = products.find(p => String(p.id) === String(productId));
        if (found) {
          setActiveQuickView(found);
        }
      }
    }
  }, [products, activeQuickView, setActiveQuickView]);

  // Sync selectedWeight and quantity resets when product changes
  useEffect(() => {
    if (activeQuickView) {
      setSelectedWeight(
        activeQuickView.weightLabels && activeQuickView.weightLabels.length > 0
          ? activeQuickView.weightLabels[0].value
          : '250g'
      );
      setQuantity(1);
      isAdded && setIsAdded(false);
      
      // Scroll to top of the page on product change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeQuickView]);

  if (!activeQuickView) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center font-poppins">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-orange-100/50 rounded-lg w-1/3 mx-auto"></div>
          <div className="h-64 bg-orange-50/50 rounded-2xl w-full max-w-4xl mx-auto"></div>
        </div>
      </div>
    );
  }

  const product = activeQuickView;
  const price = getProductPrice(product, selectedWeight);
  const isInWishlist = wishlist.some(id => String(id) === String(product.id));

  // Helper to generate realistic MRP and discount percentages
  const getMrpAndDiscount = (offerPrice) => {
    const rawMrp = offerPrice * 1.15; // 15% markup as original price
    const mrp = Math.ceil(rawMrp / 5) * 5 - 1; // Ends in 9 or 4
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
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    addToCart(product, selectedWeight, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const shareUrl = encodeURIComponent(window.location.origin + `/product?id=${product.id}`);
  const shareText = encodeURIComponent(`Check out ${product.name} on SVADA FARMS!`);

  const relatedProducts = products
    ? products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 4)
    : [];

  return (
    <div ref={pageContainerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28 font-poppins text-left animate-fade-in">
      {/* Back navigation link */}
      <button
        onClick={() => {
          setCurrentPage('products');
          setActiveQuickView(null);
        }}
        className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-accent hover:text-[#9B5F2A] mb-8 cursor-pointer transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Shop</span>
      </button>

      {/* Main Grid: Image + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
        
        {/* Product Image Section */}
        <div className="bg-white rounded-3xl border border-orange-100/50 p-6 flex items-center justify-center shadow-xs aspect-square md:aspect-auto md:h-[500px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full max-h-[420px] object-contain"
          />
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold text-accent tracking-widest uppercase">
                {product.category}
              </span>
              {product.inStock === false && (
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Out of Stock
                </span>
              )}
            </div>
            
            <h1 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="flex items-center space-x-3 mb-5">
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
            <p className="text-sm text-svada-light font-light leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Ingredients Details */}
            {product.ingredients && (
              <div className="bg-orange-50/70 border border-orange-100/50 rounded-2xl p-4.5 mb-6">
                <span className="text-[11px] font-bold text-primary tracking-widest uppercase block mb-1">
                  🌿 100% Honest Ingredients
                </span>
                <p className="text-xs text-svada-dark font-medium leading-relaxed italic">
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* Trust Badge Grid */}
            <div className="flex items-center space-x-4 mb-8 text-xs text-svada-dark font-semibold">
              <div className="flex items-center text-accent">
                <ShieldCheck className="h-4.5 w-4.5 mr-1.5" />
                <span>Zero Chemicals</span>
              </div>
              <div className="flex items-center text-accent">
                <ShieldCheck className="h-4.5 w-4.5 mr-1.5" />
                <span>Homemade Care</span>
              </div>
            </div>
          </div>

          <div>
            {/* Product Configurations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="text-[11px] text-svada-light font-bold uppercase tracking-wider block mb-2">
                  Choose Pack Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {weightLabels.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => product.inStock !== false && setSelectedWeight(opt.value)}
                      disabled={product.inStock === false}
                      className={`flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold transition duration-300 border ${
                        product.inStock === false
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : selectedWeight === opt.value
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
                <label className="text-[11px] text-svada-light font-bold uppercase tracking-wider block mb-2">
                  Select Quantity
                </label>
                <div className={`flex items-center bg-orange-50 border border-orange-100 rounded-xl px-2 py-2 w-max ${product.inStock === false ? 'opacity-50' : ''}`}>
                  <button
                    onClick={() => product.inStock !== false && quantity > 1 && setQuantity(quantity - 1)}
                    disabled={product.inStock === false}
                    className="p-1 rounded-lg hover:bg-orange-200 text-svada-dark transition disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-5 text-sm font-bold text-svada-dark min-w-[32px] text-center">
                    {product.inStock === false ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => product.inStock !== false && setQuantity(quantity + 1)}
                    disabled={product.inStock === false}
                    className="p-1 rounded-lg hover:bg-orange-200 text-svada-dark transition disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Section & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-orange-100/60 gap-4">
              <div>
                <span className="text-[10px] text-svada-light block font-bold uppercase leading-none mb-1.5">
                  Special Offer Price
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-outfit font-black text-accent">
                    ₹{product.inStock === false ? 0 : price * quantity}
                  </span>
                  <span className="text-sm text-svada-light/60 line-through font-semibold">
                    ₹{product.inStock === false ? 0 : mrp * quantity}
                  </span>
                  <span className="bg-red-50 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Save ₹{product.inStock === false ? 0 : savings * quantity}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border border-orange-100 shadow-xs transition duration-300 ${
                    isInWishlist 
                      ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                      : 'bg-white text-svada-dark hover:bg-orange-50'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
                </button>
                
                <button
                  onClick={product.inStock !== false ? handleAddToCart : undefined}
                  disabled={product.inStock === false}
                  className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-300 ${
                    product.inStock === false
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300/40'
                      : isAdded
                      ? 'bg-accent text-white scale-95'
                      : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 active:scale-95'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>{product.inStock === false ? 'Out of Stock' : isAdded ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Share Button Section */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-4.5 rounded-2xl border border-orange-100/60 bg-[#FAF6F0] select-none my-12 font-poppins text-xs font-bold">
        <span className="text-svada-dark/70 font-outfit text-sm font-black">Share Product:</span>
        <div className="flex items-center gap-3">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-primary hover:bg-[#8B4F1A] text-white shadow-xs cursor-pointer transition active:scale-95 uppercase tracking-wider text-[11px] font-black"
          >
            <span>🔗</span>
            <span>Share</span>
          </button>
          
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl border ${
              isCopied 
                ? 'bg-emerald-55 border-emerald-250 text-emerald-800' 
                : 'bg-white border-orange-100 text-svada-dark hover:bg-orange-50/50'
            } shadow-xs cursor-pointer transition active:scale-95 uppercase tracking-wider text-[11px] font-black`}
          >
            <span>{isCopied ? '✓' : '📋'}</span>
            <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="py-6 border-t border-orange-100/60 bg-transparent">
          <h3 className="font-outfit font-black text-svada-dark text-xl mb-6">
            Related Products
          </h3>
          <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-4 md:gap-6 md:pb-0">
            {relatedProducts.map((item, idx) => (
              <div key={item.id} className="flex-shrink-0 w-[240px] snap-start md:w-auto md:flex-shrink">
                <ProductCard product={item} index={idx} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
