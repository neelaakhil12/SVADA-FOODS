import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { IndianRupee, TrendingUp, Clock, CheckCircle, Package, FolderOpen } from 'lucide-react';

const AdminDashboard = () => {
  const { 
    getTodayEarnings, 
    getTotalEarnings, 
    getPendingOrders, 
    getCompletedOrders,
    products,
    categories
  } = useContext(ShopContext);

  const todayEarnings = getTodayEarnings();
  const totalEarnings = getTotalEarnings();
  const pendingOrders = getPendingOrders();
  const completedOrders = getCompletedOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {/* Today's Earnings */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Today's Earnings</p>
              <p className="text-3xl font-bold text-gray-800">₹{todayEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <IndianRupee className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Total Earnings */}
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

        {/* Pending Orders Count */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-800">{pendingOrders.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        {/* Completed Orders Count */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed Orders</p>
              <p className="text-3xl font-bold text-gray-800">{completedOrders.length}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-800">{products.length}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <Package className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        {/* Categories Count */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Categories</p>
              <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-full">
              <FolderOpen className="text-pink-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Overview */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Earnings Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Today's Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{todayEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Lifetime Revenue</p>
            <p className="text-2xl font-bold text-blue-600">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Pending Actions Required</p>
            <p className="text-2xl font-bold text-orange-600">{pendingOrders.length} orders pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
