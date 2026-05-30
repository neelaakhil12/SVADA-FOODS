import React from 'react';
import { Truck, ShieldCheck, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';

export default function ShippingPolicy() {
  const clauses = [
    "SVADA FOODS delivers products across India through trusted courier and logistics partners.",
    "Orders are processed and dispatched within 2–7 business days after successful payment confirmation.",
    "Delivery timelines may vary depending on the destination, courier partner availability, weather conditions, public holidays, and other unforeseen circumstances.",
    "Standard delivery for most locations is completed within 5–7 business days from the date of dispatch.",
    "Deliveries to remote, rural, or non-serviceable areas may require additional transit time.",
    "Once an order has been confirmed and processed, it cannot be modified or cancelled.",
    "Customers will receive order confirmation and shipment tracking details via email, SMS, or WhatsApp (where applicable).",
    "It is the customer's responsibility to provide accurate shipping information, including recipient name, address, phone number, and pincode.",
    "SVADA FOODS shall not be responsible for delays or delivery failures caused by incorrect or incomplete shipping details provided by the customer.",
    "Delivery will be attempted at the address provided during checkout. Additional delivery attempts may be subject to courier partner policies.",
    "If a package is returned due to an incorrect address, customer unavailability, or refusal to accept delivery, additional shipping charges may apply for re-dispatch.",
    "All products are packed with care using appropriate packaging materials to ensure safe transportation.",
    "To be eligible for a replacement claim in cases of missing, incorrect, or incomplete products, customers must record a clear and continuous 360-degree unboxing video of the package from the moment it is opened until all contents are fully displayed.",
    "Shipping charges, if applicable, will be displayed during checkout before order confirmation.",
    "Delivery timelines are estimates and should not be considered guaranteed delivery commitments.",
    "SVADA FOODS is not liable for delays caused by natural disasters, strikes, transportation disruptions, government regulations, or other circumstances beyond our control.",
    "Shipping services may be unavailable on certain national holidays, regional holidays, or non-working days observed by courier partners.",
    "Orders may be shipped in multiple packages depending on product availability and logistics requirements.",
    "SVADA FOODS reserves the right to update or modify this Shipping Policy at any time without prior notice."
  ];

  return (
    <div className="font-poppins py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12" data-aos="fade-up">
        <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
          <Truck className="h-8 w-8 text-primary" />
        </div>
        <span className="text-xs font-bold text-accent tracking-widest uppercase block">
          Logistics & Delivery
        </span>
        <h1 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
          SVADA FOODS Shipping Policy
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
        <p className="text-sm text-svada-light font-light max-w-xl mx-auto leading-relaxed">
          We ensure safe, secure, and clean packaging, bringing natural products directly from SVADA to your doorstep.
        </p>
      </div>

      {/* Grid segments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" data-aos="fade-up" data-aos-delay="100">
        <div className="bg-orange-50/40 border border-orange-100/50 p-6 rounded-3xl text-left space-y-2">
          <div className="flex items-center space-x-2 text-primary font-bold">
            <Clock className="h-4.5 w-4.5" />
            <h4 className="font-outfit text-sm uppercase tracking-wider">Processing Timeline</h4>
          </div>
          <p className="text-xs text-svada-light leading-relaxed">
            Dispatch occurs within <strong>2–7 business days</strong> following successful payment. Delivery typically takes <strong>5–7 business days</strong> depending on destination.
          </p>
        </div>

        <div className="bg-orange-50/40 border border-orange-100/50 p-6 rounded-3xl text-left space-y-2">
          <div className="flex items-center space-x-2 text-primary font-bold">
            <ShieldCheck className="h-4.5 w-4.5" />
            <h4 className="font-outfit text-sm uppercase tracking-wider">Secure Packaging</h4>
          </div>
          <p className="text-xs text-svada-light leading-relaxed">
            All traditional foods are clean-packed using heavy-duty premium transit jars and secure padding to completely eliminate leaks and damage.
          </p>
        </div>
      </div>

      {/* Main clauses list */}
      <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
        {clauses.map((clause, idx) => (
          <div 
            key={idx}
            className="bg-white border border-orange-100/60 rounded-2xl p-5 hover:border-orange-200 transition text-left flex items-start space-x-4 shadow-xs"
          >
            <span className="font-outfit font-black text-sm text-accent bg-[#3B1E0A]/5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <p className="text-xs sm:text-sm text-svada-light leading-relaxed font-light mt-0.5">
              {clause}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
