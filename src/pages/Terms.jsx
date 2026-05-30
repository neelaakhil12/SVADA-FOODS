import React from 'react';
import { Scale, FileText, Info, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Terms() {
  const clauses = [
    "By accessing and using the SVADA FOODS website, you agree to be bound by these Terms & Conditions.",
    "All products displayed on the website are subject to availability and may be discontinued or modified without prior notice.",
    "We strive to ensure that product descriptions, images, pricing, and other information are accurate; however, errors may occasionally occur.",
    "All prices listed on the website are in Indian Rupees (INR) and are subject to change without prior notice.",
    "An order is considered confirmed only after successful payment and receipt of an order confirmation from SVADA FOODS.",
    "SVADA FOODS reserves the right to refuse, cancel, or limit any order at its sole discretion.",
    "Once an order is confirmed and processed, it cannot be cancelled or modified.",
    "Customers are responsible for providing accurate billing, shipping, and contact information while placing an order.",
    "SVADA FOODS is not responsible for delivery delays or failures resulting from incorrect address details, incorrect contact information, or circumstances beyond our control.",
    "No monetary refunds will be provided. In cases of damaged, missing, or incorrectly delivered products, eligible customers will receive a replacement or redelivery after verification.",
    "All content on the website, including logos, images, text, graphics, and product information, is the intellectual property of SVADA FOODS and may not be copied or reproduced without permission.",
    "Users must not misuse the website, attempt unauthorized access, distribute malicious software, or engage in any unlawful activity.",
    "SVADA FOODS shall not be liable for any indirect, incidental, or consequential damages arising from the use of its products, services, or website.",
    "SVADA FOODS reserves the right to update, modify, or revise these Terms & Conditions at any time without prior notice.",
    "These Terms & Conditions shall be governed by the laws of India, and any disputes shall be subject to the jurisdiction of the competent courts in India."
  ];

  return (
    <div className="font-poppins py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12" data-aos="fade-up">
        <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
          <Scale className="h-8 w-8 text-primary" />
        </div>
        <span className="text-xs font-bold text-accent tracking-widest uppercase block">
          Legal Agreement
        </span>
        <h1 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
          SVADA FOODS Terms & Conditions
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
        <p className="text-sm text-svada-light font-light max-w-xl mx-auto leading-relaxed">
          Please review the Terms & Conditions governing the use of our website, product purchases, and order processing rules.
        </p>
      </div>

      {/* Grid segments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" data-aos="fade-up" data-aos-delay="100">
        <div className="bg-orange-50/40 border border-orange-100/50 p-6 rounded-3xl text-left space-y-2">
          <div className="flex items-center space-x-2 text-primary font-bold">
            <ShieldCheck className="h-4.5 w-4.5" />
            <h4 className="font-outfit text-sm uppercase tracking-wider">Safe Platform</h4>
          </div>
          <p className="text-xs text-svada-light leading-relaxed">
            By using our website, you agree to our platform standards, clean cooking commitments, and secure payment handling guidelines.
          </p>
        </div>

        <div className="bg-orange-50/40 border border-orange-100/50 p-6 rounded-3xl text-left space-y-2">
          <div className="flex items-center space-x-2 text-primary font-bold">
            <Info className="h-4.5 w-4.5" />
            <h4 className="font-outfit text-sm uppercase tracking-wider">Fair Trading Rules</h4>
          </div>
          <p className="text-xs text-svada-light leading-relaxed">
            All prices and custom food descriptions are maintained with highest accuracy. Dispatch, shipping, and replacement policies are strictly executed under Indian jurisdictions.
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
