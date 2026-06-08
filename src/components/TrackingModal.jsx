import React from 'react';
import { X, ExternalLink, Truck, AlertCircle } from 'lucide-react';

export default function TrackingModal({ isOpen, onClose, trackingLink }) {
  if (!isOpen || !trackingLink) return null;

  // Normalize tracking URL
  const getTrackingUrl = (url) => {
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const normalizedUrl = getTrackingUrl(trackingLink);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-poppins">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Box */}
      <div className="relative bg-[#FAF7F2] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-10 border border-orange-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b border-orange-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm text-blue-600">
              <Truck className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h2 className="font-outfit font-black text-svada-dark text-base leading-none">Track Order Dispatch</h2>
              <p className="text-[10px] text-svada-light font-medium mt-1 uppercase tracking-wider">Courier Parcel Live Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={normalizedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-svada-dark transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* IFrame Container */}
        <div className="flex-1 bg-white p-4 relative flex flex-col min-h-[50vh] md:min-h-[60vh]">
          {/* Info bar explaining frame restrictions */}
          <div className="mb-3 bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-800 text-left">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              We are displaying the carrier's portal directly on our site. If the screen remains blank or indicates connection blocks, please use the **"Open in New Tab"** button at the top right to track your package directly on the courier website.
            </p>
          </div>

          {/* Actual IFrame */}
          <div className="flex-1 border border-orange-50 rounded-2xl overflow-hidden shadow-inner bg-[#FAF7F2]">
            <iframe
              src={normalizedUrl}
              title="Courier Tracking Link"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-orange-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#3B1E0A] hover:bg-[#2B1507] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-md"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
