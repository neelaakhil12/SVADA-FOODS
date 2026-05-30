import React from 'react';
import { HelpCircle, AlertTriangle, ShieldCheck, Heart, Info, Send } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="font-poppins py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12" data-aos="fade-up">
        <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
          <ShieldCheck className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <span className="text-xs font-bold text-accent tracking-widest uppercase block">
          Returns & Replacements
        </span>
        <h1 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
          Refund & Replacement Policy
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
        <p className="text-sm text-svada-light font-light max-w-xl mx-auto leading-relaxed">
          At SVADA FOODS, customer satisfaction is our priority. We take utmost care in packaging and delivering our products. However, if any item is missing from your order, we will gladly arrange a replacement or redelivery.
        </p>
      </div>

      {/* Main Policy Cards */}
      <div className="space-y-6 text-left" data-aos="fade-up" data-aos-delay="100">
        
        {/* Clause 1 - No Monetary Refunds */}
        <div className="bg-red-50/30 border border-red-100 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center space-x-3 text-red-700 font-bold">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <h4 className="font-outfit text-base uppercase tracking-wider">1. No Monetary Refunds</h4>
          </div>
          <p className="text-xs sm:text-sm text-svada-light leading-relaxed font-light pl-8">
            SVADA FOODS does not offer refunds of money for any products purchased through our website.
          </p>
        </div>

        {/* Clause 2 - Missing Products */}
        <div className="bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h4 className="font-outfit font-black text-svada-dark text-base sm:text-lg uppercase tracking-wider flex items-center gap-2">
            <span className="bg-[#3B1E0A]/5 text-[#3B1E0A] p-2 rounded-xl flex-shrink-0">2</span>
            <span>Missing Products</span>
          </h4>
          <p className="text-xs sm:text-sm text-svada-light leading-relaxed font-light pl-11">
            If any product is missing from your order, please contact our customer support team within 48 hours of delivery. After verification, the missing item will be redelivered to you without any additional charges.
          </p>
        </div>

        {/* Clause 3 - Replacement Eligibility */}
        <div className="bg-emerald-50/30 border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-4">
          <h4 className="font-outfit font-black text-emerald-950 text-base sm:text-lg uppercase tracking-wider flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-700 p-2 rounded-xl flex-shrink-0">3</span>
            <span>Replacement Eligibility</span>
          </h4>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-light pl-11">
            Replacement requests will be considered only for:
          </p>
          <ul className="list-disc pl-16 text-xs sm:text-sm text-emerald-900 space-y-1.5 font-light">
            <li>Products missing from the delivered order.</li>
            <li>Incorrect products delivered by SVADA FOODS.</li>
          </ul>
        </div>

        {/* Clause 4 - Non-Eligible Cases */}
        <div className="bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h4 className="font-outfit font-black text-svada-dark text-base sm:text-lg uppercase tracking-wider flex items-center gap-2">
            <span className="bg-[#3B1E0A]/5 text-[#3B1E0A] p-2 rounded-xl flex-shrink-0">4</span>
            <span>Non-Eligible Cases</span>
          </h4>
          <p className="text-xs sm:text-sm text-svada-light leading-relaxed font-light pl-11">
            Replacement or redelivery will not be provided for:
          </p>
          <ul className="list-disc pl-16 text-xs sm:text-sm text-svada-light space-y-1.5 font-light">
            <li>Products damaged during shipping, transit, or after delivery.</li>
            <li>Incorrect orders placed by the customer.</li>
            <li>Requests made after the specified reporting period.</li>
            <li>Minor variations in product appearance, color, or packaging.</li>
          </ul>
        </div>

        {/* Clause 5 - Contact for Replacement Requests */}
        <div className="bg-gradient-to-br from-[#2B1B15] to-[#1A0F0C] text-white p-6 sm:p-8 rounded-3xl border border-orange-950/60 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3 text-secondary font-bold">
              <Info className="h-5 w-5" />
              <h4 className="font-outfit text-base uppercase tracking-wider">5. Contact for Replacement Requests</h4>
            </div>
            <p className="text-xs sm:text-sm text-orange-100/80 leading-relaxed font-light pl-8">
              To request a replacement or report a missing item, please contact our customer support team with your order details and supporting evidence.
            </p>
            <p className="text-xs text-orange-200/50 font-bold pl-8 uppercase tracking-widest">
              * SVADA FOODS reserves the right to verify all claims before approving a replacement or redelivery request.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
