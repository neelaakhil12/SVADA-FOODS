import React, { useRef } from 'react';
import { X, Download, CheckCircle, Package, MapPin, Phone, User, Calendar, Hash } from 'lucide-react';

export default function InvoiceModal({ order, isOpen, onClose }) {
  const invoiceRef = useRef(null);

  if (!isOpen || !order) return null;

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
    } catch {
      return dateStr || '—';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const handleDownload = () => {
    // Add print-only class to body to isolate invoice print styles
    document.body.classList.add('printing-invoice');
    window.print();
    setTimeout(() => document.body.classList.remove('printing-invoice'), 1000);
  };

  const itemsSubtotal = order.items && order.items.length > 0 
    ? order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) 
    : order.total || 0;
  const shippingCharge = order.items && order.items.length > 0
    ? (order.total || 0) - itemsSubtotal
    : 0;

  return (
    <>
      {/* Print-specific styles injected into document */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          body.printing-invoice #svada-invoice, 
          body.printing-invoice #svada-invoice * { visibility: visible !important; }
          body.printing-invoice #svada-invoice {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important;
            z-index: 9999 !important;
            background: white !important;
            padding: 24px !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 font-poppins">
        {/* Backdrop */}
        <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Invoice Modal Box */}
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10 border border-orange-100">

          {/* Action Bar */}
          <div className="sticky top-0 z-20 bg-white border-b border-orange-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
            <h2 className="font-outfit font-black text-[#3B1E0A] text-lg flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Order Invoice
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-[#3B1E0A] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#2B1507] transition shadow-md"
              >
                <Download className="h-3.5 w-3.5" />
                Download / Print
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-svada-dark transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ===== INVOICE CONTENT (printable) ===== */}
          <div id="svada-invoice" ref={invoiceRef} className="p-6 md:p-8 bg-white">

            {/* Invoice Header */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-[#3B1E0A]/10">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png?v=2"
                  alt="SVADA FARMS Logo"
                  className="w-20 h-20 rounded-2xl border border-orange-100 object-contain shadow-md"
                />
                <div>
                  <h1 className="font-outfit font-black text-[#3B1E0A] text-xl leading-none">SVADA FARMS</h1>
                  <p className="text-xs text-svada-light font-medium mt-0.5">Homemade Foods & Natural Products</p>
                  <p className="text-[10px] text-svada-light mt-0.5">📞 +91 90009 55239 | svadafarms@gmail.com</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-[#3B1E0A]/5 border border-[#3B1E0A]/10 rounded-2xl px-4 py-3">
                  <p className="text-[10px] font-bold text-svada-light uppercase tracking-wider">Invoice</p>
                  <p className="font-outfit font-black text-[#3B1E0A] text-sm mt-0.5">
                    #{order.id?.slice(-10) || order.id}
                  </p>
                  <p className="text-[10px] text-svada-light mt-1">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Status + IDs */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                ● {order.status === 'accepted' ? 'Order Accepted' : (order.status || 'Pending')}
              </span>
              {order.razorpay_payment_id && (
                <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                  💳 {order.razorpay_payment_id}
                </span>
              )}
            </div>

            {/* Customer + Billing Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-svada-light uppercase tracking-widest mb-2 flex items-center gap-1">
                  <User className="h-3 w-3" /> Customer Details
                </p>
                <p className="font-bold text-svada-dark text-sm">{order.customerName || '—'}</p>
                <p className="text-xs text-svada-light mt-0.5 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {order.customerPhone || '—'}
                </p>
              </div>
              <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-svada-light uppercase tracking-widest mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Delivery Address
                </p>
                <p className="text-xs text-svada-dark font-medium leading-relaxed">{order.customerAddress || '—'}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <p className="text-[10px] font-black text-svada-light uppercase tracking-widest mb-3 flex items-center gap-1">
                <Package className="h-3 w-3" /> Ordered Items
              </p>
              <div className="border border-orange-100 rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-[#3B1E0A] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5">
                  <span className="col-span-6">Product</span>
                  <span className="col-span-2 text-center">Size</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-2 text-right">Amount</span>
                </div>
                {/* Table Rows */}
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-12 px-4 py-3 text-xs items-center ${i % 2 === 0 ? 'bg-white' : 'bg-orange-50/40'} border-b border-orange-100 last:border-0`}
                    >
                      <span className="col-span-6 font-semibold text-svada-dark leading-tight pr-2">
                        {item.product?.name || item.name || '—'}
                      </span>
                      <span className="col-span-2 text-center text-svada-light font-medium">{item.weight || '—'}</span>
                      <span className="col-span-2 text-center font-bold text-svada-dark">×{item.quantity}</span>
                      <span className="col-span-2 text-right font-black text-[#3B1E0A]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-xs text-svada-light">No item details available</div>
                )}
              </div>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-6">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-xs text-svada-light">
                  <span>Subtotal</span>
                  <span className="font-semibold text-svada-dark">₹{itemsSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-svada-light">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shippingCharge > 0 ? 'text-svada-dark' : 'text-emerald-600 font-bold'}`}>
                    {shippingCharge > 0 ? `₹${shippingCharge.toLocaleString('en-IN')}` : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-svada-light">
                  <span>Payment Mode</span>
                  <span className="font-semibold text-indigo-600">
                    {order.razorpay_payment_id ? 'Online (Razorpay)' : 'WhatsApp Order'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black border-t-2 border-[#3B1E0A]/20 pt-2 mt-1">
                  <span className="text-svada-dark">Total Paid</span>
                  <span className="text-[#3B1E0A] text-lg font-outfit">
                    ₹{(order.total || itemsSubtotal).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Thank You Footer */}
            <div className="text-center bg-gradient-to-r from-[#3B1E0A]/5 to-orange-50 border border-orange-100 rounded-2xl p-5">
              <CheckCircle className="h-7 w-7 text-emerald-500 mx-auto mb-2" />
              <p className="font-outfit font-black text-[#3B1E0A] text-base">Thank you for your order! 🙏</p>
              <p className="text-xs text-svada-light mt-1 leading-relaxed">
                Your food is being prepared fresh with love. Questions? Reach us at{' '}
                <span className="font-semibold text-[#3B1E0A]">+91 90009 55239</span>
              </p>
              <p className="text-[10px] text-svada-light mt-3 font-medium">
                SVADA Homemade Farms — Authentic Telugu Goodness Since 2024
              </p>
            </div>

          </div>
          {/* ===== END INVOICE CONTENT ===== */}

        </div>
      </div>
    </>
  );
}
