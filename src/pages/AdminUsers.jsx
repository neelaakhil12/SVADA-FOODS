import React, { useState, useEffect } from 'react';
import { Search, Users, Calendar, Mail, Phone, RefreshCw, Trash2, MessageCircle, Send } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedUserForOffer, setSelectedUserForOffer] = useState(null);
  const [offerMessage, setOfferMessage] = useState('');

  const handleOpenOfferModal = (user) => {
    setSelectedUserForOffer(user);
    setOfferMessage(`Hello ${user.name || 'Customer'},\n\nWe have an exciting offer for you at SVADA Homemade Farms! 🎁\n\n[Write offer details here]\n\nVisit us: ${window.location.origin}`);
    setIsOfferModalOpen(true);
  };

  const handleSendOffer = () => {
    if (!selectedUserForOffer || !selectedUserForOffer.phone) {
      alert('User does not have a valid phone number.');
      return;
    }

    let cleanPhone = selectedUserForOffer.phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    const encodedText = encodeURIComponent(offerMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
    setIsOfferModalOpen(false);
    setSelectedUserForOffer(null);
    setOfferMessage('');
  };


  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
      const res = await fetch(`${apiBase}/users`);
      if (!res.ok) {
        throw new Error('Failed to retrieve logged-in users.');
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (email) => {
    if (window.confirm(`Are you sure you want to remove user "${email}"?`)) {
      try {
        const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
        const res = await fetch(`${apiBase}/users/${email}`, {
          method: 'DELETE'
        });
        if (!res.ok) {
          throw new Error('Failed to delete user.');
        }
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert(err.message || 'Error deleting user.');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  const formatLastLogin = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Users Directory</h1>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="bg-[#3B1E0A] hover:bg-[#2B1507] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm disabled:opacity-50 font-semibold"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100 flex items-center gap-4">
          <div className="p-3.5 bg-[#3B1E0A]/5 rounded-xl text-[#3B1E0A]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Active Users</p>
            <h3 className="text-2xl font-black text-gray-800 mt-0.5">{users.length}</h3>
          </div>
        </div>

        {/* Search Input Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100 md:col-span-2 flex items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-sm"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md border border-orange-100 overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile Number</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 opacity-50" />
                    <span className="text-sm">Loading users registry...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-400">
                    <Users size={40} className="mx-auto mb-3 opacity-25 text-gray-500" />
                    <p className="text-sm">No registered users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50/55 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#3B1E0A]/5 border border-orange-100 flex items-center justify-center font-bold text-[#3B1E0A] text-sm uppercase">
                          {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{user.name || 'User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <span>{user.phone || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{formatLastLogin(user.lastLogin)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                      <button
                        onClick={() => handleOpenOfferModal(user)}
                        className={`p-1 transition-colors ${user.phone ? 'text-green-600 hover:text-green-800' : 'text-gray-300 pointer-events-none'}`}
                        title={user.phone ? "Send Offer via WhatsApp" : "No Phone number available"}
                        disabled={!user.phone}
                      >
                        <MessageCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.email)}
                        className="text-red-600 hover:text-red-900 p-1 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Offer Modal */}
      {isOfferModalOpen && selectedUserForOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MessageCircle className="text-green-600" size={22} />
                  Send Offer to {selectedUserForOffer.name || 'Customer'}
                </h2>
                <button
                  onClick={() => {
                    setIsOfferModalOpen(false);
                    setSelectedUserForOffer(null);
                    setOfferMessage('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none font-bold"
                >
                  &times;
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Recipient Number</p>
                <p className="text-sm font-bold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border">
                  {selectedUserForOffer.phone || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Offer/Promotional Message
                </label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  rows="8"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-sm font-sans"
                  placeholder="Enter offer details..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSendOffer}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold"
                >
                  <Send size={16} />
                  Send via WhatsApp
                </button>
                <button
                  onClick={() => {
                    setIsOfferModalOpen(false);
                    setSelectedUserForOffer(null);
                    setOfferMessage('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
