import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, Heart, Plus, Minus, ArrowRight, Phone } from 'lucide-react';

export default function CartModal({ isOpen, onClose, activeTab = 'cart', setActiveTab }) {
  const { 
    cart, 
    wishlist, 
    products, 
    getProductPrice, 
    updateCartQuantity, 
    removeFromCart, 
    toggleWishlist,
    cartTotal,
    handleWhatsAppCheckout,
    addToCart,
    setCurrentPage
  } = useContext(ShopContext);

  if (!isOpen) return null;

  // Filter products that are in wishlist
  const wishlistItems = products.filter(item => wishlist.includes(item.id));

  const handleWeightLabel = (product, weight) => {
    if (product.weightLabels) {
      const match = product.weightLabels.find(opt => opt.value === weight);
      if (match) return match.label;
    }
    if (product.isEcoPiece) {
      if (weight === '250g') return '1 Piece';
      if (weight === '500g') return '2 Pack';
      if (weight === '1kg') return '4 Pack';
    }
    return weight;
  };

  const handleWishlistToCart = (product) => {
    addToCart(product, '250g', 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-poppins">
      {/* Drawer backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        {/* Sliding Panel */}
        <div 
          className="w-full max-w-md bg-svada-card shadow-2xl border-l border-orange-100 flex flex-col justify-between h-full transform transition duration-500 ease-in-out"
          data-aos="slide-left"
        >
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100/30">
              <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider">
                {activeTab === 'cart' ? (
                  <div className="flex items-center space-x-2 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Shopping Bag ({cart.length})</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-accent">
                    <Heart className="h-5 w-5 fill-accent" />
                    <span>Wishlist ({wishlist.length})</span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-orange-100 text-svada-dark transition duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* CART TAB */}
            {activeTab === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="bg-orange-50 p-6 rounded-full border border-orange-100 mb-4">
                      <ShoppingBag className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="font-outfit font-bold text-svada-dark text-lg mb-1">Your bag is empty</h3>
                    <p className="text-xs text-svada-light font-light max-w-xs mb-6">
                      Add delicious traditional pickles, spices, and snacks to start eating healthy!
                    </p>
                    <button
                      onClick={() => {
                        setCurrentPage('products');
                        onClose();
                      }}
                      className="px-6 py-2.5 bg-primary text-white font-semibold text-xs rounded-xl shadow-md hover:bg-secondary transition duration-300"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, idx) => {
                      const itemPrice = getProductPrice(item.product, item.weight);
                      return (
                        <div 
                          key={`${item.product.id}-${item.weight}-${idx}`}
                          className="flex items-center space-x-4 bg-orange-50/50 border border-orange-100/50 p-3 rounded-2xl relative group"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-orange-100 flex-shrink-0">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-outfit font-bold text-svada-dark text-sm truncate leading-tight mb-0.5">
                              {item.product.name}
                            </h4>
                            <span className="text-[10px] bg-white border border-orange-100 text-primary font-bold px-2 py-0.5 rounded-full inline-block mb-2">
                              Size: {handleWeightLabel(item.product, item.weight)}
                            </span>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-svada-dark">
                                ₹{itemPrice * item.quantity}
                              </span>

                              {/* Quantity Modifier */}
                              <div className="flex items-center bg-white border border-orange-100 rounded-lg p-0.5">
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.weight, item.quantity - 1)}
                                  className="p-1 rounded-sm hover:bg-orange-50 text-svada-dark transition"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2 text-xs font-bold text-svada-dark min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.weight, item.quantity + 1)}
                                  className="p-1 rounded-sm hover:bg-orange-50 text-svada-dark transition"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Delete Item */}
                          <button
                            onClick={() => removeFromCart(item.product.id, item.weight)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <>
                {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="bg-orange-50 p-6 rounded-full border border-orange-100 mb-4">
                      <Heart className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="font-outfit font-bold text-svada-dark text-lg mb-1">Your wishlist is empty</h3>
                    <p className="text-xs text-svada-light font-light max-w-xs mb-6">
                      Tap the heart icon on any product to save it here for later.
                    </p>
                    <button
                      onClick={() => {
                        setCurrentPage('products');
                        onClose();
                      }}
                      className="px-6 py-2.5 bg-primary text-white font-semibold text-xs rounded-xl shadow-md hover:bg-secondary transition duration-300"
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlistItems.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between bg-orange-50/50 border border-orange-100/50 p-3 rounded-2xl relative group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-orange-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-outfit font-bold text-svada-dark text-xs truncate leading-tight mb-0.5">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">
                              {item.category}
                            </span>
                            <span className="text-xs font-black text-primary block mt-1">
                              Starts from ₹{item.price250g}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleWishlistToCart(item)}
                            className="bg-primary text-white p-2 rounded-lg hover:bg-secondary transition shadow-sm text-[10px] font-semibold flex items-center space-x-1"
                          >
                            <span>Add Bag</span>
                          </button>
                          <button
                            onClick={() => toggleWishlist(item.id)}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg border border-orange-100 bg-white"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>

          {/* Checkout Section (Fixed to Bottom) */}
          {activeTab === 'cart' && cart.length > 0 && (
            <div className="p-6 border-t border-orange-100 bg-gradient-to-b from-orange-50/30 to-orange-50">
              
              {/* Billing details */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-svada-light">
                  <span>Bag Subtotal:</span>
                  <span className="font-semibold text-svada-dark">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-svada-light text-xs">
                  <span>Estimated Shipping:</span>
                  <span className="text-accent font-medium">Extra (At actual weight)</span>
                </div>
                
                {/* No-COD reminder */}
                <div className="bg-red-50 border border-red-100 text-red-700 p-2.5 rounded-xl text-[11px] font-bold leading-normal">
                  🛑 Prepaid Orders Only: Cash on Delivery (COD) is NOT available. We cook fresh on order & ship across India.
                </div>

                <div className="flex justify-between text-base pt-2 border-t border-orange-100">
                  <span className="font-bold text-svada-dark font-outfit">Total Payable:</span>
                  <span className="font-black text-xl text-primary font-outfit">₹{cartTotal}</span>
                </div>
              </div>

              {/* Checkout Button via WhatsApp */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 font-bold text-sm flex items-center justify-center space-x-2"
              >
                <Phone className="h-4 w-4 fill-white text-primary" />
                <span>Checkout & Order via WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <p className="text-[10px] text-svada-light text-center mt-3 leading-normal font-light">
                *Clicking checkout opens WhatsApp to finalize payment & address details directly with our team.
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
