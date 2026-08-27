import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminHeroSlides from './AdminHeroSlides';
import AdminVideos from './AdminVideos';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';


import AdminLogin from './AdminLogin';

const AdminPanel = () => {
  const { isAdmin, setIsAdmin } = useContext(ShopContext);
  const [activePage, setActivePage] = useState('dashboard');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('');

  const handleLogout = () => {
    setIsAdmin(false);
  };

  if (!isAdmin) {
    return <AdminLogin />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return (
          <AdminProducts
            categoryFilter={adminCategoryFilter}
            setCategoryFilter={setAdminCategoryFilter}
          />
        );
      case 'categories':
        return (
          <AdminCategories
            onViewProducts={(catName) => {
              setAdminCategoryFilter(catName);
              setActivePage('products');
            }}
          />
        );
      case 'hero':
        return <AdminHeroSlides />;
      case 'videos':
        return <AdminVideos />;
      case 'users':
        return <AdminUsers />;
      case 'settings':
        return <AdminSettings />;
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


