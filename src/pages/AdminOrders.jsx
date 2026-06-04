import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { 
  CheckCircle, XCircle, Trash2, Search, Calendar, 
  Phone, MapPin, ClipboardCheck, ArrowRight, ExternalLink,
  Truck, ShieldCheck, Eye, AlertCircle, ShoppingCart
} from 'lucide-react';

export default function AdminOrders() {
  const { 
    orders, 
    updateOrderStatus, 
    updateOrderTracking, 
    deleteOrder, 
    getPendingOrders, 
    getCompletedOrders 
  } = useContext(ShopContext);

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'completed' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  const pendingOrders = getPendingOrders();
  const completedOrdersList = getCompletedOrders();
  const cancelledOrdersList = orders.filter(o => o.status === 'cancelled');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order permanently? This cannot be undone.')) {
      deleteOrder(orderId);
    }
  };

  // Filter orders based on active tab and search query
  const getFilteredOrders = () => {
    let list = [];
    if (activeTab === 'pending') list = pendingOrders;
    else if (activeTab === 'completed') list = completedOrdersList;
    else if (activeTab === 'cancelled') list = cancelledOrdersList;

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(order => 
      order.id.toLowerCase().includes(query) ||
      (order.customerName && order.customerName.toLowerCase().includes(query)) ||
      (order.customerPhone && order.customerPhone.includes(query)) ||
      (order.customerAddress && order.customerAddress.toLowerCase().includes(query))
    );
  };

  const filteredOrders = getFilteredOrders();

  const handleDownloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track shipping links, update status, and manage invoices.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search Name, Phone, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]/30 focus:border-[#3B1E0A] shadow-xs"
          />
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => { setActiveTab('pending'); setSearchQuery(''); }}
            className={`flex-grow sm:flex-initial px-6 py-4 font-semibold text-sm transition-colors relative ${
              activeTab === 'pending'
                ? 'text-[#3B1E0A]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Pending Orders ({pendingOrders.length})</span>
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B1E0A]" />
            )}
          </button>
          
          <button
            onClick={() => { setActiveTab('completed'); setSearchQuery(''); }}
            className={`flex-grow sm:flex-initial px-6 py-4 font-semibold text-sm transition-colors relative ${
              activeTab === 'completed'
                ? 'text-[#3B1E0A]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Completed Orders ({completedOrdersList.length})</span>
            {activeTab === 'completed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B1E0A]" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab('cancelled'); setSearchQuery(''); }}
            className={`flex-grow sm:flex-initial px-6 py-4 font-semibold text-sm transition-colors relative ${
              activeTab === 'cancelled'
                ? 'text-[#3B1E0A]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Cancelled ({cancelledOrdersList.length})</span>
            {activeTab === 'cancelled' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B1E0A]" />
            )}
          </button>
        </div>

        {/* List Content */}
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-500 space-y-3">
              <ShoppingCart size={44} className="mx-auto text-gray-300" />
              <h3 className="font-semibold text-gray-600">No Orders Found</h3>
              <p className="text-xs text-gray-400">We couldn't find any orders matching the selected status or search query.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className={`border rounded-2xl p-5 transition-colors ${
                    order.status === 'completed' 
                      ? 'border-green-100 bg-green-50/10' 
                      : order.status === 'cancelled'
                      ? 'border-red-100 bg-red-50/10'
                      : 'border-gray-100 bg-gray-50/30'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-gray-800">Order ID: #{order.id}</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          order.status === 'completed' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : order.status === 'cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar size={13} />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="bg-orange-50 hover:bg-orange-100 text-primary border border-orange-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Invoice
                      </button>

                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle size={14} />
                            Complete
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                          >
                            <XCircle size={14} />
                            Cancel
                          </button>
                        </>
                      )}

                      {order.status === 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'pending')}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          Restore to Pending
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-gray-200"
                        title="Delete order record permanently"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
                    {/* Customer Info */}
                    <div className="lg:col-span-4 bg-white border border-gray-100 p-4 rounded-xl space-y-3.5 text-xs text-gray-700 shadow-2xs">
                      <p className="flex items-center gap-2">
                        <span className="font-bold text-gray-400 w-16 uppercase text-[9px] tracking-wider">Customer</span>
                        <span className="font-semibold text-gray-800">{order.customerName || 'N/A'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-bold text-gray-400 w-16 uppercase text-[9px] tracking-wider">Phone</span>
                        <span className="font-semibold text-gray-800 flex items-center gap-1">
                          <Phone size={12} className="text-gray-400" />
                          {order.customerPhone || 'N/A'}
                        </span>
                      </p>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-gray-400 w-16 uppercase text-[9px] tracking-wider mt-0.5">Address</span>
                        <span className="font-medium text-gray-600 flex items-start gap-1 flex-1 leading-relaxed">
                          <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          {order.customerAddress || 'N/A'}
                        </span>
                      </div>
                      <div className="pt-2.5 border-t border-gray-50 flex justify-between items-center">
                        <span className="font-bold text-gray-400 uppercase text-[9px] tracking-wider">Total Paid</span>
                        <span className="font-black text-sm text-[#3B1E0A]">₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Ordered Items & Tracking Link Input */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Courier Tracking Link Form */}
                      <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-2xs space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Truck size={14} className="text-[#3B1E0A]" />
                          <span>Delivery Courier Tracking Link (DTDC)</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            defaultValue={order.trackingLink || ''}
                            placeholder="e.g. https://www.dtdc.in/tracking/..."
                            className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#3B1E0A] focus:bg-white"
                            onBlur={(e) => {
                              const newLink = e.target.value.trim();
                              if (newLink !== (order.trackingLink || '')) {
                                updateOrderTracking(order.id, newLink);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling;
                              updateOrderTracking(order.id, input.value.trim());
                              alert('Tracking link saved successfully!');
                            }}
                            className="bg-[#3B1E0A] hover:bg-[#5a2e11] text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                          >
                            Save Link
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-2xs">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ordered Delicacies</p>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs text-gray-700 bg-gray-50/50 p-2 rounded-lg border border-gray-100/50">
                                <div className="flex items-center gap-2">
                                  {item.product?.image && (
                                    <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded object-cover bg-orange-50 flex-shrink-0" />
                                  )}
                                  <div>
                                    <p className="font-semibold text-gray-800">{item.product?.name || item.name || 'Specialty Item'}</p>
                                    <p className="text-[10px] text-gray-500">Weight: {item.weight}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                                  <p className="text-[10px] text-gray-400">{item.quantity} x ₹{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
