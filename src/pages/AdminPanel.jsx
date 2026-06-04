import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminHeroSlides from './AdminHeroSlides';
import AdminVideos from './AdminVideos';
import AdminOrders from './AdminOrders';

const AdminPanel = () => {
  const { isAdmin, setIsAdmin, setCurrentPage } = useContext(ShopContext);
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentPage('admin-login');
  };

  useEffect(() => {
    if (!isAdmin) {
      setCurrentPage('admin-login');
    }
  }, [isAdmin, setCurrentPage]);

  if (!isAdmin) {
    return null;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'hero':
        return <AdminHeroSlides />;
      case 'videos':
        return <AdminVideos />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={handleLogout}
    >
      {renderActivePage()}
    </AdminLayout>
  );
};

export default AdminPanel;


