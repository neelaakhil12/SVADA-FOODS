import React, { useState, useContext, useEffect, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, ShoppingBag, Heart, Star, ShieldCheck, Minus, Plus, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { activeQuickView, setActiveQuickView, addToCart, wishlist, toggleWishlist, getProductPrice, isLoggedIn, setCurrentPage, products } = useContext(ShopContext);
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const pageContainerRef = useRef(null);

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
  const isInWishlist = wishlist.includes(product.id);

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
      <div className="flex items-center space-x-3 px-6 py-5 rounded-2xl border border-orange-100/60 bg-[#FAF6F0] text-sm font-semibold text-svada-dark select-none my-12">
        <span className="text-svada-dark/70 font-outfit font-bold">Share:</span>
        <div className="flex items-center space-x-3.5 text-svada-dark/80">
          {/* Facebook */}
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition duration-200 cursor-pointer"
            title="Share on Facebook"
          >
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
            </svg>
          </a>
          {/* X */}
          <a 
            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition duration-200 cursor-pointer"
            title="Share on X"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          {/* Pinterest */}
          <a 
            href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${encodeURIComponent(product.image)}&description=${shareText}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition duration-200 cursor-pointer"
            title="Share on Pinterest"
          >
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.27 2.68 7.91 6.48 9.39-.08-.8-.16-2.02.03-2.9.18-.79 1.17-5.06 1.17-5.06s-.3-.6-.3-1.48c0-1.39.8-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24 1.01.5 1.83 1.5 1.83 1.8 0 3.18-1.9 3.18-4.65 0-2.43-1.75-4.13-4.24-4.13-2.89 0-4.59 2.17-4.59 4.41 0 .88.34 1.81.76 2.31.08.1.1.17.07.28l-.29 1.19c-.05.18-.16.22-.36.13-1.3-.61-2.11-2.53-2.11-4.07 0-3.3 2.4-6.33 6.92-6.33 3.63 0 6.45 2.59 6.45 6.04 0 3.61-2.27 6.52-5.43 6.52-1.06 0-2.06-.55-2.4-.1.19.72.69 2.06.69 2.76 0 .55-.2 1.22-.35 1.5C10.74 21.6 11.36 21.7 12 21.7c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
          </a>
          {/* LinkedIn */}
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition duration-200 cursor-pointer"
            title="Share on LinkedIn"
          >
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          {/* Telegram */}
          <a 
            href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition duration-200 cursor-pointer"
            title="Share on Telegram"
          >
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="py-6 border-t border-orange-100/60 bg-transparent">
          <h3 className="font-outfit font-black text-svada-dark text-xl mb-6">
            Related Products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((item, idx) => (
              <ProductCard key={item.id} product={item} index={idx} isRelated={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
