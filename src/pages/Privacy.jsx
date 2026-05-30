import React from 'react';
import { Shield, Lock, Eye, Mail, FileText, Info, CheckCircle, HelpCircle } from 'lucide-react';

export default function Privacy() {
  const sections = [
    {
      title: 'Information Collection',
      content: 'We collect personal information such as your name, email address, phone number, billing address, and shipping address when you place an order or contact us.'
    },
    {
      title: 'Order Processing',
      content: 'Your information is used to process, confirm, and deliver your orders efficiently.'
    },
    {
      title: 'Customer Support',
      content: 'We use your contact details to respond to inquiries, complaints, refund requests, and support-related matters.'
    },
    {
      title: 'Payment Security',
      content: 'Payment transactions are processed through secure third-party payment gateways. We do not store your complete card or banking details.'
    },
    {
      title: 'Website Improvement',
      content: 'We may collect anonymous usage data to improve website performance, user experience, and services.'
    },
    {
      title: 'Cookies Usage',
      content: 'Our website may use cookies to remember preferences, enhance functionality, and analyze website traffic.'
    },
    {
      title: 'Marketing Communications',
      content: 'With your consent, we may send promotional offers, product updates, discounts, and newsletters via email or SMS.'
    },
    {
      title: 'Data Protection',
      content: 'We implement appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure.'
    },
    {
      title: 'Third-Party Service Providers',
      content: 'We may share necessary information with delivery partners, payment processors, and technology providers solely for business operations.'
    },
    {
      title: 'No Sale of Personal Data',
      content: 'SVADA FOODS does not sell, rent, or trade customer personal information to third parties.'
    },
    {
      title: 'Legal Compliance',
      content: 'We may disclose information if required by law, court order, government authority, or regulatory requirements.'
    },
    {
      title: 'Data Retention',
      content: 'Customer information is retained only as long as necessary for order fulfillment, legal obligations, and business records.'
    },
    {
      title: 'User Rights',
      content: 'Customers may request access, correction, updating, or deletion of their personal information, subject to applicable laws.'
    },
    {
      title: 'Third-Party Links',
      content: 'Our website may contain links to external websites. We are not responsible for the privacy practices of those websites.'
    },
    {
      title: 'Policy Updates',
      content: 'SVADA FOODS reserves the right to update this Privacy Policy at any time. Changes will be posted on this page with the revised effective date.'
    }
  ];

  return (
    <div className="font-poppins py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12" data-aos="fade-up">
        <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 text-primary">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <span className="text-xs font-bold text-accent tracking-widest uppercase block">
          Legal & Trust
        </span>
        <h1 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
          SVADA FOODS Privacy Policy
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
        <p className="text-sm text-svada-light font-light max-w-xl mx-auto leading-relaxed">
          At SVADA Foods, we value your trust and are fully committed to protecting your personal information. Please review how we collect, safeguard, and use your data.
        </p>
      </div>

      {/* Main content sections grid */}
      <div className="space-y-6" data-aos="fade-up" data-aos-delay="100">
        {sections.map((sec, idx) => (
          <div 
            key={idx}
            className="bg-white border border-orange-100/70 hover:border-primary rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 text-left"
          >
            <div className="flex items-start space-x-3.5">
              <div className="bg-[#3B1E0A]/5 text-[#3B1E0A] p-2 rounded-xl flex-shrink-0 mt-0.5">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-outfit font-black text-svada-dark text-base sm:text-lg">
                  {sec.title}
                </h4>
                <p className="text-xs sm:text-sm text-svada-light font-light leading-relaxed">
                  {sec.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Card */}
      <div 
        className="mt-12 bg-gradient-to-br from-[#2B1B15] to-[#1A0F0C] text-white p-8 rounded-3xl text-left border border-orange-950/60 shadow-lg relative overflow-hidden"
        data-aos="fade-up"
      >
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h3 className="font-outfit font-black text-lg sm:text-xl text-white">Contact Information</h3>
            <p className="text-xs text-orange-200/60 font-light leading-relaxed">
              For any privacy-related questions or concerns, please contact SVADA FOODS through our official customer support channels. We are always ready to help you coordinate your details safely.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:svadatraditionalfoods@gmail.com"
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/15 px-5 py-3 rounded-2xl border border-white/10 transition text-sm font-semibold"
            >
              <Mail className="h-4.5 w-4.5 text-secondary" />
              <span>svadatraditionalfoods@gmail.com</span>
            </a>
            <a 
              href="tel:+919000955239"
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/15 px-5 py-3 rounded-2xl border border-white/10 transition text-sm font-semibold"
            >
              <Info className="h-4.5 w-4.5 text-secondary" />
              <span>Call Support: +91 90009 55239</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
