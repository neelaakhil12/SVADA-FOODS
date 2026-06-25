import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminResetPassword() {
  const { setCurrentPage } = useContext(ShopContext);
  const [token, setToken] = useState('');
  
  // Form Fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Status States
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('token');
    if (!t) {
      setError('Invalid reset link. No token found.');
      setIsVerifyingToken(false);
    } else {
      setToken(t);
      setIsVerifyingToken(false);
    }
  }, []);

  const apiBase = (import.meta.env.DEV && window.location.hostname === 'localhost') ? 'http://localhost:5000/api' : '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!token) {
      setError('Missing token. Please request a new reset link.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/admin/reset-password-with-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'Password reset successfully.');
        setTimeout(() => {
          setCurrentPage('admin-login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password. The link may have expired.');
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
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          </div>
          <p className="text-center text-orange-200 text-sm mt-2">
            SVADA FARMS Administrator Management
          </p>
        </div>

        {/* Form Container */}
        <div className="px-8 py-8">
          {isVerifyingToken ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B1E0A]"></div>
              <p className="text-xs text-gray-500">Validating password reset token...</p>
            </div>
          ) : (
            <>
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

              {token && !successMsg && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Choose a strong, secure new password for your admin account. You will be redirected to the login panel immediately after resetting.
                  </p>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] focus:border-transparent text-sm"
                        placeholder="••••••••"
                      />
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
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Redirection Links */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentPage('admin-login')}
                  className="text-sm text-gray-600 hover:text-[#3B1E0A] transition-colors"
                >
                  Go to Login Panel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
