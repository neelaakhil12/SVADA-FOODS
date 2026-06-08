import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { X, ShoppingBag, LogIn, UserCheck } from 'lucide-react';

export default function LoginPromptModal({ isOpen, onClose }) {
  const { setCurrentPage } = useContext(ShopContext);

  if (!isOpen) return null;

  const handleLoginNow = () => {
    onClose();
    setCurrentPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 font-poppins">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-orange-100 z-10 animate-bounce-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-svada-dark transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#3B1E0A] to-[#5A2E10] px-6 pt-8 pb-10 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/5 rounded-full" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20 backdrop-blur-sm">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-outfit font-black text-white text-xl leading-tight">
              Login to Continue
            </h2>
            <p className="text-orange-200 text-xs font-medium mt-1">
              Your cart is waiting for you!
            </p>
          </div>
        </div>

        {/* Negative margin card overlap */}
        <div className="-mt-4 bg-white rounded-t-3xl relative z-10 px-6 pt-6 pb-7">
          <p className="text-center text-sm text-svada-light font-medium leading-relaxed mb-6">
            Please <span className="text-[#3B1E0A] font-bold">login or create an account</span> to add
            items to your cart and track your orders.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { icon: '🛒', text: 'Save your cart' },
              { icon: '📦', text: 'Track orders' },
              { icon: '💸', text: 'Easy checkout' },
              { icon: '🎁', text: 'Exclusive offers' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2"
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-[11px] font-semibold text-svada-dark">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <button
            onClick={handleLoginNow}
            className="w-full bg-gradient-to-r from-[#3B1E0A] to-[#5A2E10] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mb-3"
          >
            <LogIn className="h-4 w-4" />
            Login / Create Account
          </button>

          <button
            onClick={onClose}
            className="w-full bg-orange-50 border border-orange-100 text-svada-dark py-3 rounded-2xl font-semibold text-sm hover:bg-orange-100 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <UserCheck className="h-4 w-4 text-svada-light" />
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
