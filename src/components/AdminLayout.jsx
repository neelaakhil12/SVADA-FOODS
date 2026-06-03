import React, { useState } from 'react';
import { LayoutDashboard, Package, FolderTree, LogOut, Menu, X, ImagePlay } from 'lucide-react';

const AdminLayout = ({ children, activePage, setActivePage, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'hero', label: 'Hero Slides', icon: ImagePlay },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#3B1E0A] text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <h1 className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activePage === item.id
                    ? 'bg-white/20 text-white'
                    : 'hover:bg-white/10 text-white/80'
                }`}
              >
                <Icon size={20} />
                <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors"
          >
            <LogOut size={20} />
            <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;


