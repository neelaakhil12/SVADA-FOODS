import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle, KeyRound, CheckCircle } from 'lucide-react';

const ADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@svadafarms.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
};

export default function AdminLogin() {
  const { isAdmin, setIsAdmin, currentPage, setCurrentPage } = useContext(ShopContext);
  
  // Views: 'login' | 'forgot'
  const [view, setView] = useState('login');
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Status States
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAdmin && currentPage === 'admin-login') {
      setCurrentPage('admin');
    }
  }, [isAdmin, currentPage, setCurrentPage]);

  const apiBase = (import.meta.env.DEV && window.location.hostname === 'localhost') ? 'http://localhost:5000/api' : '/api';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch(`${apiBase}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdmin(true);
        setCurrentPage('admin');
      } else {
        setError(data.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'A secure password reset link has been sent to svadafarms@gmail.com.');
      } else {
        setError(data.error || 'Failed to request reset. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#3B1E0A] px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-center text-orange-200 text-sm mt-2">
            {view === 'login' && 'Secure access to SVADA FARMS management system'}
            {view === 'forgot' && 'Reset your admin account password'}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 mb-6">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-start gap-3 mb-6">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{successMsg}</span>
            </div>
          )}

          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] focus:border-transparent text-sm"
                    placeholder="svadafarms@gmail.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-[#3B1E0A] hover:text-[#2B1507] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] focus:border-transparent text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3B1E0A] hover:bg-[#2B1507] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Login to Admin Panel</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              {!successMsg && (
                <>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Enter your registered admin email. A secure password reset link will be sent to recover access.
                  </p>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] focus:border-transparent text-sm"
                        placeholder="svadafarms@gmail.com"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {!successMsg && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#3B1E0A] hover:bg-[#2B1507] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Password Reset Link</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg transition-colors duration-200 text-sm cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-sm text-gray-600 hover:text-[#3B1E0A] transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


