import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const { orders, getTodayEarnings, getTotalEarnings, getPendingOrders, getCompletedOrders, updateOrderStatus, deleteOrder } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('earnings');

  const todayEarnings = getTodayEarnings();
  const totalEarnings = getTotalEarnings();
  const pendingOrders = getPendingOrders();
  const completedOrdersList = getCompletedOrders();

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
    updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Today's Earnings</p>
              <p className="text-3xl font-bold text-gray-800">₹{todayEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-800">₹{totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'earnings'
                ? 'text-[#3B1E0A] border-b-2 border-[#3B1E0A]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Earnings Overview
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-[#3B1E0A] border-b-2 border-[#3B1E0A]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Orders ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'completed'
                ? 'text-[#3B1E0A] border-b-2 border-[#3B1E0A]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed Orders ({completedOrdersList.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'earnings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Earnings Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="text-2xl font-bold text-green-600">₹{todayEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-blue-600">₹{totalEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Pending Orders</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingOrders.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Pending Orders</h3>
              {pendingOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending orders</p>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Order #{order.id.slice(-6)}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <CheckCircle size={16} />
                            Complete
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <XCircle size={16} />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <p className="text-sm text-gray-600 mb-2"><strong>Customer:</strong> {order.customerName || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mb-2"><strong>Phone:</strong> {order.customerPhone || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mb-2"><strong>Address:</strong> {order.customerAddress || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Total:</strong> ₹{order.total.toLocaleString()}</p>
                        
                        {/* Ordered Items List */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Ordered Items:</p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs text-gray-600 bg-orange-50/40 p-2 rounded-lg border border-orange-100/30">
                                  <div className="flex items-center gap-2">
                                    {item.product.image && (
                                      <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-md object-cover bg-orange-100 flex-shrink-0" />
                                    )}
                                    <div>
                                      <p className="font-semibold text-svada-dark">{item.product.name}</p>
                                      <p className="text-[10px] text-gray-500">Weight/Size: {item.weight}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-svada-dark">₹{item.price * item.quantity}</p>
                                    <p className="text-[10px] text-gray-500">{item.quantity} x ₹{item.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Completed Orders</h3>
              {completedOrdersList.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No completed orders</p>
              ) : (
                <div className="space-y-4">
                  {completedOrdersList.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Order #{order.id.slice(-6)}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Completed</span>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <p className="text-sm text-gray-600 mb-2"><strong>Customer:</strong> {order.customerName || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mb-2"><strong>Phone:</strong> {order.customerPhone || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mb-2"><strong>Address:</strong> {order.customerAddress || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Total:</strong> ₹{order.total.toLocaleString()}</p>
                        
                        {/* Ordered Items List */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Ordered Items:</p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs text-gray-600 bg-orange-50/40 p-2 rounded-lg border border-orange-100/30">
                                  <div className="flex items-center gap-2">
                                    {item.product.image && (
                                      <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-md object-cover bg-orange-100 flex-shrink-0" />
                                    )}
                                    <div>
                                      <p className="font-semibold text-svada-dark">{item.product.name}</p>
                                      <p className="text-[10px] text-gray-500">Weight/Size: {item.weight}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-svada-dark">₹{item.price * item.quantity}</p>
                                    <p className="text-[10px] text-gray-500">{item.quantity} x ₹{item.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


