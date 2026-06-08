import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { User, Package, LogOut, ChevronRight, Clock, CheckCircle, Truck, XCircle, AlertCircle, FileText, ShoppingBag } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';
import TrackingModal from '../components/TrackingModal';

export default function Account() {
  const { isLoggedIn, currentUser, setIsLoggedIn, setCurrentUser, setCurrentPage, orders } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [trackingLink, setTrackingLink] = useState('');
  const [showTracking, setShowTracking] = useState(false);

  // Filter orders matching user's phone number
  const userOrders = orders ? orders.filter(
    order => order.customerPhone && currentUser?.phone && order.customerPhone.trim() === currentUser.phone.trim()
  ) : [];

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-svada-bg flex flex-col items-center justify-center p-6 font-poppins">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center border border-orange-100">
          <div className="w-20 h-20 bg-[#3B1E0A]/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-[#3B1E0A]" />
          </div>
          <h2 className="font-outfit font-black text-svada-dark text-2xl mb-2">My Account</h2>
          <p className="text-sm text-svada-light mb-6">Please login to view your account and order history.</p>
          <button
            onClick={() => { setCurrentPage('login'); window.scrollTo({ top: 0 }); }}
            className="w-full bg-gradient-to-r from-[#3B1E0A] to-[#5A2E10] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
          >
            Login / Register
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'accepted': return <CheckCircle className="h-4 w-4 text-indigo-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'processing': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'accepted': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch {
      return dateStr || '—';
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0 });
  };

  const handleViewInvoice = (order) => {
    setInvoiceOrder(order);
    setShowInvoice(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-poppins pb-12">
      {/* Page Hero */}
      <div className="bg-gradient-to-br from-[#3B1E0A] to-[#5A2E10] pt-12 pb-24 px-4 text-left">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm flex-shrink-0">
              <span className="text-white font-outfit font-black text-2xl">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-orange-300 text-xs font-semibold uppercase tracking-widest">Welcome back,</p>
              <h1 className="font-outfit font-black text-white text-2xl md:text-3xl leading-tight truncate">
                {currentUser?.name || 'Customer'}
              </h1>
              <p className="text-orange-200 text-xs mt-0.5 font-mono">{currentUser?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-fit flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition flex-shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* Sidebar Menu */}
          <div className="md:col-span-1 bg-white rounded-3xl shadow-xl border border-orange-100 p-6 space-y-6">
            <div className="hidden md:block pb-4 border-b border-orange-50 text-left">
              <h3 className="font-outfit font-black text-svada-dark text-sm leading-tight">Account settings</h3>
              <p className="text-[10px] text-svada-light font-bold uppercase tracking-wider mt-0.5">SVADA Member</p>
            </div>

            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
              {[
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'profile', label: 'Profile details', icon: User },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-1 md:flex-initial text-left ${
                    activeTab === id
                      ? 'bg-[#3B1E0A] text-white shadow-md'
                      : 'text-svada-light hover:bg-orange-50/50 hover:text-svada-dark bg-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50/80 transition-all text-left mt-4 border-t border-orange-50 pt-4"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Active Tab Panel */}
          <div className="md:col-span-3 bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden min-h-[500px] text-left">
            
            {/* Header section inside main panel */}
            <div className="px-6 py-5 border-b border-orange-100 bg-orange-50/20">
              <h2 className="font-outfit font-black text-svada-dark text-lg">
                {activeTab === 'orders' ? 'My Order History' : 'Personal Details'}
              </h2>
              <p className="text-xs text-svada-light font-light mt-0.5">
                {activeTab === 'orders' 
                  ? 'Review, download invoices, and track your traditional orders.' 
                  : 'Manage and review your profile contact information and details.'}
              </p>
            </div>

            {/* ===== MY ORDERS TAB ===== */}
            {activeTab === 'orders' && (
              <div className="p-6">
                {userOrders && userOrders.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-xs text-svada-light font-semibold uppercase tracking-wider mb-2">
                      {userOrders.length} order{userOrders.length !== 1 ? 's' : ''} found
                    </p>
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-orange-100 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-md transition-all duration-300"
                      >
                        {/* Order Header */}
                        <div className="bg-orange-50/60 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-orange-100">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-[10px] font-bold text-svada-light uppercase tracking-wider">Order ID</p>
                              <p className="text-xs font-black text-[#3B1E0A] font-mono">
                                #{order.id?.slice(-12) || order.id}
                              </p>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-orange-200" />
                            <div className="hidden sm:block">
                              <p className="text-[10px] font-bold text-svada-light uppercase tracking-wider">Date</p>
                              <p className="text-xs font-semibold text-svada-dark">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status === 'accepted' ? 'Order Accepted' : (order.status || 'Pending')}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="px-4 py-3">
                          {order.items && order.items.length > 0 ? (
                            <div className="space-y-2">
                              {order.items.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  {item.product?.image && (
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-10 h-10 rounded-xl object-cover bg-orange-50 border border-orange-100 flex-shrink-0"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-svada-dark truncate">
                                      {item.product?.name || item.name || '—'}
                                    </p>
                                    <p className="text-[10px] text-svada-light">
                                      {item.weight} · Qty {item.quantity} · ₹{item.price * item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <p className="text-[11px] text-svada-light font-semibold">
                                  +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-svada-light italic">No item details available</p>
                          )}
                        </div>

                        {/* Order Footer */}
                        <div className="bg-orange-50/40 px-4 py-3 flex items-center justify-between border-t border-orange-100">
                          <div>
                            <p className="text-[10px] font-bold text-svada-light uppercase tracking-wider">Total Paid</p>
                            <p className="text-base font-outfit font-black text-[#3B1E0A]">
                              ₹{(order.total || 0).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.trackingLink && (
                              <button
                                onClick={() => {
                                  setTrackingLink(order.trackingLink);
                                  setShowTracking(true);
                                }}
                                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl hover:bg-blue-100 transition cursor-pointer"
                              >
                                <Truck className="h-3.5 w-3.5" />
                                Track
                              </button>
                            )}
                            <button
                              onClick={() => handleViewInvoice(order)}
                              className="flex items-center gap-1.5 text-xs font-bold text-[#3B1E0A] bg-[#3B1E0A]/5 border border-[#3B1E0A]/10 px-3 py-2 rounded-xl hover:bg-[#3B1E0A]/10 transition"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Invoice
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4 border border-orange-100">
                      <ShoppingBag className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-outfit font-bold text-svada-dark text-lg mb-1">No orders yet</h3>
                    <p className="text-sm text-svada-light max-w-xs mb-6">
                      Your order history will appear here once you place your first order.
                    </p>
                    <button
                      onClick={() => { setCurrentPage('products'); window.scrollTo({ top: 0 }); }}
                      className="px-6 py-2.5 bg-[#3B1E0A] text-white font-semibold text-sm rounded-xl shadow-md hover:bg-[#2B1507] transition"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ===== PROFILE TAB ===== */}
            {activeTab === 'profile' && (
              <div className="p-6 space-y-6">
                <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-5">
                  <h3 className="font-bold text-svada-dark text-sm mb-4 uppercase tracking-wider">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#3B1E0A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="h-4.5 w-4.5 text-[#3B1E0A]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-svada-light uppercase tracking-wider">Full Name</p>
                        <p className="text-sm font-semibold text-svada-dark">{currentUser?.name || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#3B1E0A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-[#3B1E0A] font-outfit font-black text-sm">@</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-svada-light uppercase tracking-wider">Email Address</p>
                        <p className="text-sm font-semibold text-svada-dark font-mono">{currentUser?.email || '—'}</p>
                      </div>
                    </div>
                    {currentUser?.phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#3B1E0A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-[#3B1E0A] font-outfit font-black text-xs">📞</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-svada-light uppercase tracking-wider">Linked Mobile</p>
                          <p className="text-sm font-semibold text-svada-dark">{currentUser.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#3B1E0A]/5 to-orange-50 border border-orange-100 rounded-2xl p-5">
                  <p className="text-[11px] text-svada-light font-semibold leading-relaxed">
                    🌿 Thank you for being part of the SVADA family! Your support helps us bring authentic, homemade goodness from our farms directly to your home.
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold text-sm hover:bg-red-100 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={invoiceOrder}
        isOpen={showInvoice}
        onClose={() => { setShowInvoice(false); setInvoiceOrder(null); }}
      />

      {/* Tracking Modal */}
      <TrackingModal
        isOpen={showTracking}
        onClose={() => setShowTracking(false)}
        trackingLink={trackingLink}
      />
    </div>
  );
}
