import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Mail, User, ShieldCheck, ArrowRight, Sparkles, CheckCircle, ShoppingBag, Phone } from 'lucide-react';

export default function Login() {
  const { isLoggedIn, currentUser, setIsLoggedIn, setCurrentUser, setCurrentPage, orders } = useContext(ShopContext);
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [linkingPhone, setLinkingPhone] = useState('');

  // OTP Login states
  const [otpName, setOtpName] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Google pending states (for mandatory Name + Phone input)
  const [googlePending, setGooglePending] = useState(null);
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [googlePhoneInput, setGooglePhoneInput] = useState('');

  // Reset states on mount
  useEffect(() => {
    setSuccessMsg('');
    setErrorMsg('');
    setOtpSent(false);
    setOtpCode('');
    setGooglePending(null);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!otpName || !otpEmail || !otpPhone) return;

    const phoneVal = otpPhone.trim();
    if (phoneVal.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setOtpLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
      const res = await fetch(`${apiBase}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch verification email.");
      }

      setOtpSent(true);
      setSuccessMsg("Verification code dispatched successfully to your inbox!");
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpName || !otpEmail || !otpCode || !otpPhone) return;

    const phoneVal = otpPhone.trim();
    if (phoneVal.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setOtpLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
      const res = await fetch(`${apiBase}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp: otpCode })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed. Check the code.");
      }

      const finalName = otpName.trim();
      setIsLoggedIn(true);
      setCurrentUser({
        name: finalName,
        email: otpEmail,
        phone: phoneVal
      });
      setSuccessMsg(`Welcome, ${finalName}! Logging you in securely...`);
      
      setTimeout(() => {
        setSuccessMsg('');
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSuccessMsg('Logged out successfully from your SVADA account.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT decoding failed:", e);
      return null;
    }
  };

  const handleGoogleLoginResponse = (response) => {
    const decoded = decodeJwt(response.credential);
    if (decoded && decoded.email) {
      setErrorMsg(''); // Clear any previous error banner
      const preFilledPhone = otpPhone ? otpPhone.trim() : '';
      const preFilledName = otpName ? otpName.trim() : (decoded.name || '');

      if (preFilledPhone && preFilledPhone.length === 10) {
        // Direct login if all details are already populated & valid
        setIsLoggedIn(true);
        setCurrentUser({
          name: preFilledName,
          email: decoded.email,
          phone: preFilledPhone,
          picture: decoded.picture || ''
        });
        setSuccessMsg(`Welcome back, ${preFilledName}! Signed in via Google securely.`);
        setGooglePending(null);
        
        setTimeout(() => {
          setSuccessMsg('');
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2500);
      } else {
        // Pre-fill the details on the complete google sign-in view
        setGooglePending({
          email: decoded.email,
          name: preFilledName,
          picture: decoded.picture || ''
        });
        setGoogleNameInput(preFilledName);
        setGooglePhoneInput(preFilledPhone);
        setSuccessMsg("Google authenticated! Please verify your name and mobile number.");
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    }
  };

  const handleGoogleCompleteSubmit = (e) => {
    e.preventDefault();
    if (googlePending && googleNameInput && googlePhoneInput) {
      const phoneVal = googlePhoneInput.trim();
      if (phoneVal.length !== 10) {
        setErrorMsg("Please enter a valid 10-digit mobile number.");
        return;
      }
      
      const finalName = googleNameInput.trim();
      setIsLoggedIn(true);
      setCurrentUser({
        name: finalName,
        email: googlePending.email,
        phone: phoneVal,
        picture: googlePending.picture
      });
      setSuccessMsg(`Welcome, ${finalName}! Signed in via Google securely.`);
      setGooglePending(null);
      
      setTimeout(() => {
        setSuccessMsg('');
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2500);
    }
  };

  useEffect(() => {
    /* global google */
    let intervalId;
    const initGoogleSignIn = () => {
      if (window.google && !isLoggedIn) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "649636660320-u810i44fhp3jol3h31fhd4cf5afa33pg.apps.googleusercontent.com",
            callback: handleGoogleLoginResponse
          });

          const btnEl = document.getElementById("google-signin-btn");
          if (btnEl) {
            window.google.accounts.id.renderButton(
              btnEl,
              { theme: "outline", size: "large", width: "100%" }
            );
            if (intervalId) clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Google Sign-In initialization failed:", err);
        }
      }
    };

    // Try immediately
    initGoogleSignIn();

    // If not loaded yet, check every 500ms
    if (!window.google && !isLoggedIn) {
      intervalId = setInterval(initGoogleSignIn, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoggedIn]);

  const handleLinkPhoneSubmit = (e) => {
    e.preventDefault();
    const phone = linkingPhone.trim();
    if (phone.length === 10) {
      setCurrentUser({
        ...currentUser,
        phone: phone
      });
      setSuccessMsg(`Phone number ${phone} successfully linked to your profile!`);
      setLinkingPhone('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      alert("Please enter a valid 10-digit phone number.");
    }
  };

  const handleDownloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    
    // Format dates nicely
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsRows = order.items.map((item, idx) => {
      const itemPrice = item.price;
      const subtotal = item.price * item.quantity;
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px;">${idx + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px;">
            <strong>${item.product?.name || item.name || 'Specialty Item'}</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px;">${item.weight}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; text-align: right;">₹${itemPrice}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; text-align: right; font-weight: bold;">₹${subtotal}</td>
        </tr>
      `;
    }).join('');

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - Order #${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Poppins:wght@300;400;600;700&display=swap');
            body { font-family: 'Poppins', sans-serif; margin: 40px; color: #444; line-height: 1.5; }
            .invoice-card { max-w: 800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3B1E0A; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; color: #3B1E0A; }
            .logo span { color: #C2824B; }
            .invoice-details { text-align: right; font-size: 13px; }
            .invoice-details h2 { margin: 0 0 5px 0; font-family: 'Outfit', sans-serif; color: #3B1E0A; }
            .section-title { font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; color: #3B1E0A; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .billing-info { display: grid; grid-cols: 1; gap: 20px; margin-bottom: 30px; font-size: 13px; }
            .info-block { background: #faf7f2; padding: 15px; border-radius: 12px; border: 1px solid #f3ebe1; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .items-table th { background: #3B1E0A; color: white; padding: 10px; font-size: 12px; font-weight: bold; text-align: left; text-transform: uppercase; }
            .items-table th:nth-child(4), .items-table th:nth-child(6) { text-align: right; }
            .items-table th:nth-child(5) { text-align: center; }
            .totals-container { margin-top: 30px; display: flex; justify-content: flex-end; }
            .totals-table { width: 250px; border-collapse: collapse; font-size: 14px; }
            .totals-table td { padding: 6px 10px; }
            .totals-table tr.grand-total { font-size: 18px; font-weight: bold; color: #3B1E0A; border-top: 2px solid #3B1E0A; }
            .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
            .watermark { text-align: center; font-size: 10px; font-weight: bold; color: #22c55e; background: #f0fdf4; border: 1px solid #bbf7d0; display: inline-block; padding: 4px 12px; border-radius: 9999px; margin-top: 10px; }
            @media print {
              body { margin: 0; }
              .invoice-card { border: none; box-shadow: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div class="logo">SVADA <span>FARMS</span></div>
              <div class="invoice-details">
                <h2>INVOICE</h2>
                <p style="margin: 0; font-weight: bold;">Order ID: ${order.id}</p>
                <p style="margin: 3px 0 0 0; color: #666;">Date: ${orderDate}</p>
                <span class="watermark">✓ ${order.status.toUpperCase()}</span>
              </div>
            </div>
            
            <div class="billing-info">
              <div class="info-block">
                <div class="section-title">Billed To</div>
                <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">${order.customerName}</p>
                <p style="margin: 0 0 5px 0;">Phone: ${order.customerPhone}</p>
                <p style="margin: 0; color: #555;"><strong>Delivery Address:</strong> ${order.customerAddress}</p>
              </div>
            </div>
            
            <div class="section-title">Order Items</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="border-top-left-radius: 8px; border-bottom-left-radius: 8px; width: 40px;">S.No</th>
                  <th>Delicacy</th>
                  <th>Weight</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="border-top-right-radius: 8px; border-bottom-right-radius: 8px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
            
            <div class="totals-container">
              <table class="totals-table">
                <tr>
                  <td style="color: #666;">Subtotal:</td>
                  <td style="text-align: right; font-weight: bold;">₹${order.total}</td>
                </tr>
                <tr>
                  <td style="color: #666;">Shipping charges:</td>
                  <td style="text-align: right; font-weight: bold; color: #22c55e;">FREE</td>
                </tr>
                <tr class="grand-total">
                  <td>Total Paid:</td>
                  <td style="text-align: right;">₹${order.total}</td>
                </tr>
              </table>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 5px 0; font-weight: bold;">Thank you for shopping with SVADA Homemade Farms!</p>
              <p style="margin: 0; color: #888;">All items are freshly prepared, solar-cured, and hygienically packed on demand.</p>
              <p style="margin: 5px 0 0 0; color: #999; font-size: 9px;">This is a computer generated invoice and does not require signature.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  // If already logged in, show user details & order history
  if (isLoggedIn) {
    // Filter orders matching user's phone number
    const userOrders = orders.filter(
      order => order.customerPhone && currentUser?.phone && order.customerPhone.trim() === currentUser.phone.trim()
    );

    return (
      <div className="max-w-6xl mx-auto px-4 py-12 font-poppins min-h-[75vh]">
        
        {/* Success Banner */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center space-x-2 mb-6 animate-fade-in shadow-sm">
            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: Profile Desk card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-orange-100 p-6 sm:p-8 rounded-3xl text-left space-y-6 shadow-xs sticky top-28">
              <div className="flex flex-col items-center text-center space-y-4">
                {currentUser?.picture ? (
                  <img src={currentUser.picture} alt="profile" className="w-20 h-20 rounded-full border-2 border-primary shadow-sm" />
                ) : (
                  <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center border border-orange-100 text-primary font-black text-xl">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="font-outfit font-black text-svada-dark text-lg">Account Profile Desk</h3>
                  <p className="text-[10px] text-svada-light uppercase tracking-wider font-bold">Secure SVADA Member</p>
                </div>
              </div>

              <div className="bg-orange-50/40 border border-orange-100/50 rounded-2xl p-4 space-y-3.5 text-xs text-svada-dark font-medium">
                <p className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-svada-light font-bold uppercase tracking-wider">Profile Name</span>
                  <span className="font-semibold text-sm">{currentUser?.name}</span>
                </p>
                <p className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-svada-light font-bold uppercase tracking-wider">Email Address</span>
                  <span className="font-mono text-sm break-all">{currentUser?.email}</span>
                </p>
                <p className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-svada-light font-bold uppercase tracking-wider">Phone Link</span>
                  {currentUser?.phone ? (
                    <span className="font-semibold text-sm">{currentUser.phone}</span>
                  ) : (
                    <span className="text-red-500 font-bold italic text-[11px]">No Phone Number Linked</span>
                  )}
                </p>
              </div>

              {/* Link Phone Number Inline Form */}
              {!currentUser?.phone && (
                <div className="bg-orange-50/70 border border-dashed border-orange-200 rounded-2xl p-4 space-y-3 text-left">
                  <h4 className="text-xs font-bold text-svada-dark flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Sync Order History</span>
                  </h4>
                  <p className="text-[10px] text-svada-light font-light leading-relaxed">
                    Link your 10-digit checkout phone number to securely sync and display your traditional order history and invoices.
                  </p>
                  <form onSubmit={handleLinkPhoneSubmit} className="flex gap-2">
                    <input
                      type="tel"
                      required
                      value={linkingPhone}
                      onChange={(e) => setLinkingPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="flex-1 bg-white border border-orange-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-svada-dark focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-secondary text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Link
                    </button>
                  </form>
                </div>
              )}

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    setCurrentPage('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-orange-50 hover:bg-orange-100 text-primary border border-orange-100 py-2.5 rounded-xl font-bold text-xs transition"
                >
                  Log Out of Account
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Order History List */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <div className="bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 shadow-xs min-h-[50vh] flex flex-col justify-between">
              
              <div>
                <div className="pb-4 border-b border-orange-50 mb-6 flex justify-between items-center">
                  <h2 className="font-outfit font-black text-svada-dark text-xl flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <span>My Order History</span>
                  </h2>
                  {currentUser?.phone && (
                    <span className="text-xs text-svada-light font-bold uppercase bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                      Phone: {currentUser.phone}
                    </span>
                  )}
                </div>

                {!currentUser?.phone ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto border border-orange-100 text-svada-light/60">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-outfit font-bold text-svada-dark text-base">Phone Number Required</h4>
                      <p className="text-xs text-svada-light max-w-sm mx-auto leading-relaxed font-light">
                        Please link your phone number using the desk form on the left to securely sync your orders from the database.
                      </p>
                    </div>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto border border-orange-100 text-svada-light/60">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-outfit font-bold text-svada-dark text-base">No Orders Found</h4>
                      <p className="text-xs text-svada-light max-w-sm mx-auto leading-relaxed font-light">
                        We couldn't find any orders placed under the phone number <strong className="text-svada-dark">{currentUser.phone}</strong>. Place an order on checkout with this number to track it here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => {
                      const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      });
                      
                      return (
                        <div 
                          key={order.id} 
                          className="border border-orange-100/75 rounded-2xl p-5 hover:shadow-md transition bg-[#faf7f2]/20 flex flex-col gap-4"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-orange-100/50">
                            <div>
                              <p className="text-xs text-svada-light font-medium">Order ID: <strong className="text-svada-dark font-mono">{order.id}</strong></p>
                              <p className="text-[10px] text-svada-light">Placed on: {orderDate}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                order.status === 'completed' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {order.status}
                              </span>
                              <button
                                onClick={() => handleDownloadInvoice(order)}
                                className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 border-b-2 border-primary/20 pb-0.5 transition cursor-pointer"
                              >
                                <span>Download Invoice</span>
                              </button>
                            </div>
                          </div>

                          {/* Items List */}
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs font-medium text-svada-dark">
                                <div className="flex items-center gap-2">
                                  {item.product?.image && (
                                    <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-contain bg-orange-50/50 border border-orange-100" />
                                  )}
                                  <div>
                                    <p className="font-bold">{item.product?.name || item.name || 'Specialty Item'}</p>
                                    <p className="text-[10px] text-svada-light font-light">Size: {item.weight}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p>{item.quantity} x ₹{item.price}</p>
                                  <p className="font-bold text-svada-light/80">₹{item.price * item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer */}
                          <div className="flex justify-between items-center pt-3 border-t border-orange-100/50 mt-1">
                            <span className="text-[10px] text-svada-light font-bold uppercase tracking-wider">Total Value Paid:</span>
                            <span className="text-base font-black text-[#3B1E0A]">₹{order.total}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Secure guarantee info */}
              <div className="text-center pt-8 text-[10px] text-svada-light/60 font-light border-t border-orange-50 mt-8">
                ✓ All payments are verified securely. Custom packaging for cross-India shipment.
              </div>

            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="font-poppins min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      <div className="bg-white border border-orange-100 rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        
        {/* LEFT COLUMN - SAFFRON DECORATIVE SPLIT */}
        <div className="bg-gradient-to-br from-primary to-secondary text-white p-8 sm:p-12 flex flex-col justify-between text-left relative overflow-hidden">
          {/* Animated decorative sparks */}
          <div className="absolute inset-0 opacity-10 pointer-events-none text-4xl">
            <span className="absolute top-[10%] left-[20%] animate-pulse">🌶️</span>
            <span className="absolute top-[70%] left-[10%] animate-bounce">🥭</span>
            <span className="absolute top-[40%] right-[20%] animate-pulse">🍯</span>
            <span className="absolute bottom-[10%] right-[15%] rotate-12">🌾</span>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
              <Sparkles className="h-3 w-3 text-secondary animate-pulse" />
              <span>Village Traditional Portal</span>
            </div>
            <h2 className="font-outfit font-black text-3xl sm:text-4xl leading-tight">
              Eat Healthy. Choose Traditional.
            </h2>
            <p className="text-xs sm:text-sm text-orange-50/80 font-light leading-relaxed">
              Log in to save your preferred traditional pickle weights, track your shipping parcel status, manage orders, and unlock special festival discounts.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/20 mt-8 relative z-10 text-xs text-orange-100 font-light">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0" />
              <span>100% Hygienic Food Processing Facility</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0" />
              <span>Direct farmers procurement support</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - LOGICAL FORMS */}
        <div className="p-6 sm:p-10 flex flex-col justify-center text-left relative">
          
          {/* Success Banner */}
          {successMsg && (
            <div className="absolute top-4 left-6 right-6 bg-emerald-50 border border-emerald-100 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold leading-relaxed flex items-start space-x-2 z-20 animate-fade-down shadow-md">
              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="absolute top-4 left-6 right-6 bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs font-semibold leading-relaxed flex items-start space-x-2 z-20 animate-fade-down shadow-md">
              <ShieldCheck className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN VIEW */}
          <div className="space-y-6">
            {googlePending ? (
              // Google Sign-In Pending Profile Details
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <h3 className="font-outfit font-black text-svada-dark text-xl sm:text-2xl">Complete Google Sign-In</h3>
                  <p className="text-xs text-svada-light font-light">Verify or customize your name and enter a required mobile number to sync your traditional order histories.</p>
                </div>

                <form onSubmit={handleGoogleCompleteSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={googleNameInput}
                        onChange={(e) => setGoogleNameInput(e.target.value)}
                        className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-svada-dark focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white"
                        placeholder="Your Name"
                      />
                      <User className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Mobile Number *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        pattern="\d{10}"
                        maxLength={10}
                        value={googlePhoneInput}
                        onChange={(e) => setGooglePhoneInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-svada-dark focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white"
                        placeholder="10-digit mobile number"
                      />
                      <Phone className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Complete Google Sign-In</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setGooglePending(null)}
                    className="w-full bg-orange-50 hover:bg-orange-100 text-svada-dark py-2.5 rounded-xl font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            ) : (
              // Standard OTP Sign-In View
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-outfit font-black text-svada-dark text-xl sm:text-2xl">Access Account</h3>
                  <p className="text-xs text-svada-light font-light">Enter your name, email, and mobile number to sign in securely via OTP.</p>
                </div>

                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        disabled={otpSent || otpLoading}
                        value={otpName}
                        onChange={(e) => setOtpName(e.target.value)}
                        className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-svada-dark focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white disabled:opacity-70"
                        placeholder="Your Name"
                      />
                      <User className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Email *</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        disabled={otpSent || otpLoading}
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-svada-dark focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white disabled:opacity-70"
                        placeholder="name@email.com"
                      />
                      <Mail className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Mobile Number *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        disabled={otpSent || otpLoading}
                        pattern="\d{10}"
                        maxLength={10}
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-svada-dark focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white disabled:opacity-70"
                        placeholder="10-digit mobile number"
                      />
                      <Phone className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="animate-fade-down">
                      <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Enter 6-Digit OTP *</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          pattern="\d{6}"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-orange-50 border border-orange-100 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-svada-dark focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white tracking-widest font-mono text-center"
                          placeholder="000000"
                        />
                        <ShieldCheck className="h-4 w-4 text-svada-light/60 absolute left-3 top-2.5" />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-75"
                  >
                    {otpLoading ? (
                      <span>Loading...</span>
                    ) : otpSent ? (
                      <>
                        <span>Verify & Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Send OTP Verification Code</span>
                        <Mail className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {otpSent && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                        }}
                        className="text-[10px] text-primary font-bold hover:underline"
                      >
                        Change Details / Resend OTP
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Social Logins */}
            <div className="space-y-4 pt-4 border-t border-orange-50">
              <span className="text-[9px] text-svada-light font-bold uppercase tracking-wider block text-center">
                Or sign in with
              </span>
              
              {/* Official Google Sign-In Button Container */}
              <div className="flex justify-center w-full py-1">
                <div id="google-signin-btn" className="w-full flex justify-center"></div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}


