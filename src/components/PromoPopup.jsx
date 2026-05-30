import React, { useEffect, useState, useContext } from 'react';
import { X, Truck } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

export default function PromoPopup({ showTrigger }) {
  const { setCurrentPage } = useContext(ShopContext);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Only show if the splash screen is done AND it hasn't been shown in the current session
    if (showTrigger) {
      const hasShown = sessionStorage.getItem('svada_shipping_popup_shown');
      if (!hasShown) {
        // Delay showing the popup slightly after the splash screen finishes for a smooth, premium feel
        const delayTimer = setTimeout(() => {
          setShouldRender(true);
          // Let it mount in DOM first, then trigger animation classes
          const animTimer = setTimeout(() => {
            setIsOpen(true);
          }, 50);
          return () => clearTimeout(animTimer);
        }, 1000);

        return () => clearTimeout(delayTimer);
      }
    }
  }, [showTrigger]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('svada_shipping_popup_shown', 'true');
    // Unmount after animation finishes
    setTimeout(() => {
      setShouldRender(false);
    }, 300);
  };

  const handleViewPolicy = () => {
    handleClose();
    setCurrentPage('shipping');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity duration-300 ease-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      {/* Circular Modal Container */}
      <div
        className={`relative bg-white w-[310px] h-[310px] sm:w-[370px] sm:h-[370px] rounded-full flex flex-col items-center justify-center p-8 text-center border-4 border-[#3B1E0A] shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out transform ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-4 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the circle
      >
        {/* Close Button X (Matches layout of reference screenshot) */}
        <button
          onClick={handleClose}
          className="absolute -top-1 -right-1 sm:top-2 sm:right-2 bg-white text-gray-700 hover:text-[#3B1E0A] rounded-full p-2 shadow-lg border border-orange-100 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200"
          title="Close Popup"
        >
          <X className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Truck Emoji */}
        <div className="text-5xl sm:text-6xl mb-3 filter drop-shadow-md select-none transform hover:scale-110 transition duration-300">
          🚚
        </div>

        {/* Free Shipping Headline */}
        <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#3B1E0A] tracking-wider leading-none select-none uppercase">
          Free Shipping !!
        </h2>

        {/* Region */}
        <span className="text-[10px] sm:text-xs font-black text-amber-900/60 tracking-widest mt-1.5 uppercase select-none">
          All Over India
        </span>

        {/* Minimum Purchase Requirement */}
        <p className="text-xs sm:text-sm font-black text-[#B3743B] tracking-wide mt-3 max-w-[210px] sm:max-w-[250px] leading-relaxed uppercase select-none">
          On Purchase of Rs. 3500/- and Above
        </p>

        {/* Button to view policy */}
        <button
          onClick={handleViewPolicy}
          className="bg-[#3B1E0A] hover:bg-[#B3743B] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full mt-4.5 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center space-x-1"
        >
          <span>View Shipping Policy</span>
        </button>
      </div>
    </div>
  );
}
