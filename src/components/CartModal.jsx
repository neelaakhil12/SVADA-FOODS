import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, Heart, Plus, Minus, ArrowRight, Phone, ArrowLeft, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE = (import.meta.env.DEV && window.location.hostname === 'localhost') ? 'http://localhost:5000/api' : '/api';
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TAEkhCvQWZFv5D';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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
    setCurrentPage,
    addOrder,
    clearCart,
    isLoggedIn,
    currentUser,
    fetchOrders,
    shippingCost,
    freeShippingThreshold
  } = useContext(ShopContext);

  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const shipping = cartTotal >= freeShippingThreshold ? 0 : shippingCost;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    alternatePhone: '',
    courierService: '',
    googleMapsLink: ''
  });
  const [errors, setErrors] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [whatsappMessageText, setWhatsappMessageText] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const constructOnlinePaymentWhatsAppMessage = (orderId, paymentId, totalAmount, itemsList, customerDetails, shippingCharge) => {
    let message = `*SVADA Homemade Farms - Online Order Confirmed* ✅\n`;
    message += `=============================\n\n`;
    
    message += `*Order Reference:*\n`;
    message += `• Order ID: ${orderId}\n`;
    message += `• Payment ID: ${paymentId}\n`;
    message += `• Payment Status: Paid Online (Razorpay)\n\n`;

    if (customerDetails) {
      message += `*Customer Details:*\n`;
      message += `• Name: ${customerDetails.customerName}\n`;
      message += `• Phone: ${customerDetails.customerPhone}\n`;
      message += `• Delivery Address: ${customerDetails.customerAddress}\n\n`;
    }

    message += `*Ordered Items:*\n`;
    itemsList.forEach((item, idx) => {
      const label = item.product.weightLabels
        ? (item.product.weightLabels.find(opt => opt.value === item.weight)?.label || item.weight)
        : item.product.isEcoPiece 
        ? (item.weight === '250g' ? '1 Pc' : item.weight === '500g' ? '2 Pcs' : '4 Pcs')
        : item.weight;
      message += `${idx + 1}. *${item.product.name || item.name}*\n   Qty: ${item.quantity} x Size: ${label} (₹${item.price} each)\n   Subtotal: ₹${item.price * item.quantity}\n\n`;
    });

    message += `=============================\n`;
    message += `*Bag Subtotal:* ₹${totalAmount - shippingCharge}\n`;
    message += `*Shipping:* ${shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}\n`;
    message += `=============================\n`;
    message += `*Total Amount Paid:* ₹${totalAmount}\n\n`;
    message += `This is a pre-paid online order. Please prepare for shipping and share tracking link. Thank you!`;
    
    return message;
  };

  useEffect(() => {
    if (!isOpen) {
      setIsCheckoutMode(false);
      setPaymentSuccess(false);
      setPaymentError('');
      setSuccessData(null);
      setFormData({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        alternatePhone: '',
        courierService: '',
        googleMapsLink: ''
      });
      setErrors({});
    } else if (isLoggedIn && currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        phone: currentUser.phone || ''
      }));
    }
  }, [isOpen, isLoggedIn, currentUser]);

  useEffect(() => {
    setIsCheckoutMode(false);
    setPaymentSuccess(false);
    setPaymentError('');
  }, [activeTab]);

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          if (!response.ok) throw new Error("Reverse geocoding failed");
          const data = await response.json();
          
          if (data && data.address) {
            const address = data.address;
            
            const road = address.road || '';
            const suburb = address.suburb || address.neighbourhood || '';
            const village = address.village || address.town || '';
            const streetAddressParts = [road, suburb, village].filter(Boolean);
            const streetAddress = streetAddressParts.length > 0 
              ? streetAddressParts.join(', ')
              : (data.display_name || '');

            const city = address.city || address.town || address.county || '';
            const state = address.state || '';
            const pincode = address.postcode || '';

            setFormData(prev => ({
              ...prev,
              address: streetAddress,
              city: city,
              state: state,
              pincode: pincode,
              googleMapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`
            }));
            
            setErrors(prev => ({
              ...prev,
              address: '',
              city: '',
              state: '',
              pincode: ''
            }));
          } else {
            alert("Unable to parse address from location.");
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          alert("Failed to retrieve address details. Please fill manually.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let msg = "Failed to retrieve your location. Please check your browser permissions.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please allow access to fetch your address.";
        }
        alert(msg);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,12}$/.test(formData.phone.trim().replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (formData.alternatePhone.trim() && !/^[0-9]{10,12}$/.test(formData.alternatePhone.trim().replace(/\D/g, ''))) {
      newErrors.alternatePhone = 'Please enter a valid alternate phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCustomerDetails = () => {
    let customerAddress = `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`;
    if (formData.alternatePhone.trim()) {
      customerAddress += `\n📞 Alternate Phone: ${formData.alternatePhone.trim()}`;
    }
    if (formData.courierService.trim()) {
      customerAddress += `\n🚚 Courier: ${formData.courierService.trim()}`;
    }
    if (formData.googleMapsLink) {
      customerAddress += `\n📍 Map Link: ${formData.googleMapsLink}`;
    }
    return {
      customerName: formData.name.trim(),
      customerPhone: formData.phone.trim(),
      customerAddress
    };
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    setPaymentLoading(true);
    setPaymentError('');

    try {
      // 1. Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setPaymentError('Failed to load payment gateway. Please check your internet connection.');
        setPaymentLoading(false);
        return;
      }

      // 2. Create order on backend
      const orderRes = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal + shipping, currency: 'INR', receipt: `svada_${Date.now()}` })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        setPaymentError(orderData.error || 'Failed to initiate payment. Please try again.');
        setPaymentLoading(false);
        return;
      }

      const customerDetails = getCustomerDetails();
      const cartItems = cart.map(item => ({
        product: { id: item.product.id, name: item.product.name, image: item.product.image || '' },
        weight: item.weight,
        quantity: item.quantity,
        price: getProductPrice(item.product, item.weight)
      }));

      setPaymentLoading(false);

      // 3. Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SVADA Homemade Farms',
        description: `Order for ${cart.length} item(s)`,
        image: '/desi-cow-ghee.png',
        order_id: orderData.orderId,
        prefill: {
          name: customerDetails.customerName,
          contact: customerDetails.customerPhone,
        },
        notes: {
          address: customerDetails.customerAddress
        },
        theme: {
          color: '#c2410c'
        },
        handler: async (response) => {
          // 4. Verify payment on backend
          try {
            setPaymentLoading(true);
            const verifyRes = await fetch(`${API_BASE}/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                ...customerDetails,
                total: cartTotal + shipping,
                items: cartItems
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const orderId = verifyData.orderId;
              const paymentId = response.razorpay_payment_id;
              
              const msg = constructOnlinePaymentWhatsAppMessage(
                orderId,
                paymentId,
                cartTotal + shipping,
                cart.map(item => ({
                  product: item.product,
                  weight: item.weight,
                  quantity: item.quantity,
                  price: getProductPrice(item.product, item.weight)
                })),
                customerDetails,
                shipping
              );
              setWhatsappMessageText(msg);

              clearCart();
              fetchOrders();
              setSuccessData({
                orderId: orderId,
                paymentId: paymentId,
                amount: cartTotal + shipping
              });
              setPaymentSuccess(true);
            } else {
              setPaymentError(verifyData.error || 'Payment verification failed. Please contact support.');
            }
          } catch (err) {
            setPaymentError('Payment completed but verification failed. Please contact us with your Payment ID: ' + response.razorpay_payment_id);
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setPaymentError(`Payment failed: ${response.error.description}`);
        setPaymentLoading(false);
      });
      rzp.open();

    } catch (err) {
      setPaymentError('Something went wrong. Please try again.');
      setPaymentLoading(false);
    }
  };

  const onSubmitCheckout = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    const customerDetails = getCustomerDetails();

    // Open WhatsApp URL
    handleWhatsAppCheckout(customerDetails);
    
    // Add Order to context (which records it and clears the cart)
    addOrder(customerDetails);

    // Reset and close
    setIsCheckoutMode(false);
    onClose();
  };

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
    <>
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
                {isCheckoutMode ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsCheckoutMode(false)}
                      className="flex items-center space-x-1 text-xs font-bold text-svada-light hover:text-primary transition mb-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Cart</span>
                    </button>
                    
                    <div className="space-y-3">
                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-svada-dark/80 mb-1 uppercase tracking-wider">Full Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full bg-white border ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-orange-100 focus:ring-orange-200'} rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 transition-all`}
                          placeholder="e.g. Rama Rao"
                        />
                        {errors.name && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.name}</p>}
                      </div>

                      {/* Address with Location fetch */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[11px] font-bold text-svada-dark/80 uppercase tracking-wider mb-0">Street Address *</label>
                          <button
                            type="button"
                            onClick={handleFetchLocation}
                            disabled={locationLoading}
                            className="text-[10px] text-primary hover:text-secondary font-extrabold flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                          >
                            {locationLoading ? (
                              <>
                                <svg className="animate-spin h-3 w-3 text-primary animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Locating...</span>
                              </>
                            ) : (
                              <>
                                <span>📍</span>
                                <span>Use Current Location</span>
                              </>
                            )}
                          </button>
                        </div>
                        <textarea
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          rows={2}
                          className={`w-full bg-white border ${errors.address ? 'border-red-400 focus:ring-red-200' : 'border-orange-100 focus:ring-orange-200'} rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 transition-all resize-none`}
                          placeholder="House/Flat No, Street, Landmark"
                        />
                        {errors.address && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.address}</p>}
                        
                        {formData.googleMapsLink && (
                          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 rounded-xl text-[10px] font-bold flex items-center justify-between mt-2 animate-fade-in shadow-xs">
                            <span className="flex items-center gap-1">
                              <span>✓</span>
                              <span>Map Coordinates Linked!</span>
                            </span>
                            <a 
                              href={formData.googleMapsLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:text-secondary font-black underline uppercase tracking-wider text-[9px]"
                            >
                              Verify Map Link
                            </a>
                          </div>
                        )}
                      </div>

                      {/* City and State side by side */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-svada-dark/80 mb-1 uppercase tracking-wider">City *</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className={`w-full bg-white border ${errors.city ? 'border-red-400 focus:ring-red-200' : 'border-orange-100 focus:ring-orange-200'} rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 transition-all`}
                            placeholder="City"
                          />
                          {errors.city && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-svada-dark/80 mb-1 uppercase tracking-wider">State *</label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className={`w-full bg-white border ${errors.state ? 'border-red-400 focus:ring-red-200' : 'border-orange-100 focus:ring-orange-200'} rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 transition-all`}
                            placeholder="State"
                          />
                          {errors.state && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.state}</p>}
                        </div>
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-[11px] font-bold text-svada-dark/80 mb-1 uppercase tracking-wider">Pincode *</label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          className={`w-full bg-white border ${errors.pincode ? 'border-red-400 focus:ring-red-200' : 'border-orange-100 focus:ring-orange-200'} rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 transition-all`}
                          placeholder="6-digit Pincode"
                        />
                        {errors.pincode && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.pincode}</p>}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-[11px] font-bold text-svada-dark/80 mb-1 uppercase tracking-wider">Phone Number *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full bg-white border ${errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-orange-100 focus:ring-orange-200'} rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 transition-all`}
                          placeholder="10-digit mobile number"
                        />
                        {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.phone}</p>}
                      </div>

                      {/* Alternate Number */}
                      <div>
                        <label className="block text-[11px] font-bold text-svada-dark/80 mb-1 uppercase tracking-wider">Alternate Number</label>
                        <input
                          type="tel"
                          value={formData.alternatePhone}
                          onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                          className={`w-full bg-white border ${errors.alternatePhone ? 'border-red-400 focus:ring-red-200' : 'border-orange-100 focus:ring-orange-200'} rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 transition-all`}
                          placeholder="Optional alternate mobile number"
                        />
                        {errors.alternatePhone && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.alternatePhone}</p>}
                      </div>

                      {/* Courier Service Available in your area */}
                      <div>
                        <label className="block text-[11px] font-bold text-svada-dark/80 mb-1 uppercase tracking-wider">Courier Service Available in your area</label>
                        <input
                          type="text"
                          value={formData.courierService}
                          onChange={(e) => setFormData({ ...formData, courierService: e.target.value })}
                          className="w-full bg-white border border-orange-100 focus:ring-orange-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 transition-all"
                          placeholder="e.g. DTDC, Professional, Post Office, BlueDart"
                        />
                      </div>
                    </div>
                  </div>
                ) : cart.length === 0 ? (
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
                            {item.inStock === false && (
                              <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded inline-block mt-0.5 uppercase tracking-wider">
                                Out of Stock
                              </span>
                            )}
                            <span className="text-xs font-black text-primary block mt-1">
                              Starts from ₹{item.price250g}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => item.inStock !== false && handleWishlistToCart(item)}
                            disabled={item.inStock === false}
                            className={`p-2 rounded-lg transition shadow-sm text-[10px] font-semibold flex items-center space-x-1 ${
                              item.inStock === false
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300/40'
                                : 'bg-primary text-white hover:bg-secondary'
                            }`}
                          >
                            <span>{item.inStock === false ? 'No Stock' : 'Add Bag'}</span>
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
          {activeTab === 'cart' && cart.length > 0 && !paymentSuccess && (
            <div className="p-6 border-t border-orange-100 bg-gradient-to-b from-orange-50/30 to-orange-50">
              
              {/* Billing details */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-svada-light">
                  <span>Bag Subtotal:</span>
                  <span className="font-semibold text-svada-dark">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-svada-light text-xs">
                  <span>Estimated Shipping:</span>
                  <span className="font-semibold text-svada-dark">
                    {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                
                {/* No-COD reminder */}
                <div className="bg-red-50 border border-red-100 text-red-700 p-2.5 rounded-xl text-[11px] font-bold leading-normal">
                  🛑 Prepaid Orders Only: Cash on Delivery (COD) is NOT available. We cook fresh on order & ship across India.
                </div>

                <div className="flex justify-between text-base pt-2 border-t border-orange-100">
                  <span className="font-bold text-svada-dark font-outfit">Total Payable:</span>
                  <span className="font-black text-xl text-primary font-outfit">₹{cartTotal + shipping}</span>
                </div>
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="flex items-start space-x-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-[11px] font-semibold mb-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{paymentError}</span>
                </div>
              )}

              {isCheckoutMode ? (
                <div className="space-y-2.5">
                  {/* Razorpay Pay Online Button */}
                  <button
                    onClick={handleRazorpayPayment}
                    disabled={paymentLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 font-bold text-sm flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {paymentLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>Pay Online ₹{cartTotal + shipping}</span>
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-bold">Razorpay</span>
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 border-t border-orange-200"></div>
                    <span className="text-[10px] text-svada-light font-semibold uppercase tracking-wider">or</span>
                    <div className="flex-1 border-t border-orange-200"></div>
                  </div>

                  {/* WhatsApp Button */}
                  <button
                    onClick={onSubmitCheckout}
                    disabled={paymentLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 font-bold text-sm flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Phone className="h-4 w-4 fill-white text-emerald-600" />
                    <span>Order via WhatsApp</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="text-[10px] text-svada-light text-center leading-normal font-light">
                    💙 Pay Online — instant confirmation &nbsp;|&nbsp; 💬 WhatsApp — talk to our team
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setIsCheckoutMode(true)}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 font-bold text-sm flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              
              {!isCheckoutMode && (
                <p className="text-[10px] text-svada-light text-center mt-3 leading-normal font-light">
                  *We offer online payment via Razorpay & WhatsApp order coordination.
                </p>
              )}

            </div>
          )}

          {/* Payment Success Screen */}
          {activeTab === 'cart' && paymentSuccess && successData && (
            <div className="p-6 border-t border-green-100 bg-gradient-to-b from-green-50 to-emerald-50 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg mb-4 animate-bounce">
                <CheckCircle className="h-9 w-9 text-white" />
              </div>
              <h3 className="font-outfit font-black text-emerald-700 text-lg mb-1">Payment Successful! 🎉</h3>
              <p className="text-xs text-emerald-600 font-medium mb-4">Your order has been placed. We'll prepare it fresh for you!</p>
              <div className="w-full bg-white border border-green-100 rounded-xl p-4 space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-svada-light font-medium">Order ID:</span>
                  <span className="font-bold text-svada-dark truncate max-w-[160px]">{successData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-svada-light font-medium">Payment ID:</span>
                  <span className="font-bold text-svada-dark truncate max-w-[160px]">{successData.paymentId}</span>
                </div>
                <div className="flex justify-between border-t border-green-100 pt-2 mt-1">
                  <span className="text-svada-light font-bold">Amount Paid:</span>
                  <span className="font-black text-emerald-600 text-base">₹{successData.amount}</span>
                </div>
              </div>
              <p className="text-[10px] text-svada-light leading-normal mb-4">
                Save your Payment ID for reference. Our team will contact you for shipping details shortly.
              </p>
              <button
                onClick={() => {
                  const encodedMessage = encodeURIComponent(whatsappMessageText);
                  const whatsappNumber = '919000955239';
                  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
                  window.open(whatsappUrl, '_blank');
                  onClose();
                  setCurrentPage('account');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4 fill-white text-emerald-600" />
                Send to WhatsApp & View Account
              </button>
            </div>
          )}

        </div>
      </div>
    </div>

    {/* ====== FULL-SCREEN ORDER SUCCESS OVERLAY ====== */}
    {paymentSuccess && successData && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-poppins">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Success Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-green-100 z-10">

          {/* Green Header */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 px-6 pt-8 pb-12 text-center relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
            <div className="relative z-10">
              {/* Animated checkmark */}
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/40 shadow-xl">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="font-outfit font-black text-white text-xl leading-tight">
                Order Received! 🎉
              </h2>
            </div>
          </div>

          {/* Card overlap */}
          <div className="-mt-6 bg-white rounded-t-3xl relative z-10 px-6 pt-5 pb-6">
            {/* Brand message */}
            <div className="text-center mb-5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img
                  src="/logo.png?v=2"
                  alt="SVADA FARMS Logo"
                  className="w-8 h-8 rounded-full border border-orange-100 object-contain shadow-sm"
                />
                <span className="font-outfit font-black text-[#3B1E0A] text-base">SVADA FARMS</span>
              </div>
              <p className="text-sm font-semibold text-svada-dark leading-relaxed">
                has received your order and your
              </p>
              <p className="text-sm font-black text-emerald-600">
                payment is successful! ✅
              </p>
            </div>

            {/* Order details card */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-2 text-xs mb-5">
              <div className="flex justify-between items-center">
                <span className="text-svada-light font-medium">Order ID</span>
                <span className="font-black text-svada-dark font-mono text-[11px] truncate max-w-[140px]">
                  {successData.orderId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-svada-light font-medium">Payment ID</span>
                <span className="font-bold text-indigo-600 font-mono text-[11px] truncate max-w-[140px]">
                  {successData.paymentId}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-emerald-200 mt-1">
                <span className="text-svada-dark font-bold">Amount Paid</span>
                <span className="font-outfit font-black text-emerald-600 text-lg">
                  ₹{successData.amount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-center text-svada-light leading-relaxed mb-5">
              Your fresh homemade food is being prepared with love. 🌿<br />
              We'll reach out for shipping details soon.
            </p>

            {/* OK Button */}
            <button
              onClick={() => {
                const encodedMessage = encodeURIComponent(whatsappMessageText);
                const whatsappNumber = '919000955239';
                const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
                onClose();
                setCurrentPage('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white py-4 rounded-2xl font-black text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4 fill-white text-emerald-600" />
              Send to WhatsApp & View Account
            </button>

            <button
              onClick={onClose}
              className="w-full mt-2 py-2.5 text-svada-light text-xs font-semibold hover:text-svada-dark transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}


