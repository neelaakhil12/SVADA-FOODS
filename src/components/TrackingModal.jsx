import React, { useState } from 'react';
import { X, ExternalLink, Truck, AlertCircle, Copy, Check, Hash } from 'lucide-react';

export default function TrackingModal({ isOpen, onClose, trackingLink, trackingId }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || (!trackingLink && !trackingId)) return null;

  // Handle Copy Tracking ID to clipboard
  const handleCopyId = () => {
    if (!trackingId) return;
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Normalize tracking URL (default to DTDC portal if link is omitted)
  const getTrackingUrl = (url) => {
    if (!url || !url.trim()) return 'https://www.dtdc.in/';
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
      <div className="relative bg-[#FAF7F2] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-10 border border-orange-100 overflow-hidden text-left">
        
        {/* Header */}
        <div className="bg-white border-b border-orange-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm text-blue-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-outfit font-black text-svada-dark text-base leading-none">Track Parcel Shipment</h2>
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
              Open Website in New Tab
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-svada-dark transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 bg-white p-4 md:p-6 relative flex flex-col min-h-[50vh] md:min-h-[60vh] overflow-y-auto space-y-4">
          
          {/* Tracking ID Section (If available) */}
          {trackingId && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-blue-800 text-xs font-bold uppercase tracking-wider">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <span>Courier Tracking ID / Waybill Number</span>
                </div>
                <p className="font-mono font-black text-lg md:text-xl text-[#3B1E0A] tracking-wider select-all">
                  {trackingId}
                </p>
                <p className="text-[11px] text-blue-700/80">
                  Copy this tracking ID and paste it in the courier portal below to check your status.
                </p>
              </div>

              <button
                onClick={handleCopyId}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer flex-shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white border border-emerald-600'
                    : 'bg-[#3B1E0A] hover:bg-[#5a2e11] text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Tracking ID</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Guidance Info bar */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              We display the official courier tracking website below. If the portal asks for your Tracking ID, paste <strong className="font-mono font-bold text-amber-900">{trackingId || 'your tracking ID'}</strong> into the tracking field. You can also use <strong>"Open Website in New Tab"</strong> to track directly.
            </p>
          </div>

          {/* Actual IFrame Carrier View */}
          <div className="flex-1 min-h-[350px] border border-orange-100 rounded-2xl overflow-hidden shadow-inner bg-[#FAF7F2]">
            <iframe
              src={normalizedUrl}
              title="Courier Tracking Portal"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-orange-50 px-6 py-4 flex justify-between items-center">
          <div className="text-xs text-svada-light font-medium hidden sm:block">
            Need help? Contact support at +91 90009 55239
          </div>
          <button
            onClick={onClose}
            className="bg-[#3B1E0A] hover:bg-[#2B1507] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-md ml-auto"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
