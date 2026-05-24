import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, HelpCircle, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'How do I place an order?',
      a: 'Browse our Products page, add the delicacies to your shopping cart with your preferred pack size, and click "Checkout via WhatsApp". This automatically compiles your order list and opens WhatsApp to finalize delivery address and shipping with our customer desk.'
    },
    {
      q: 'Why is Cash on Delivery (COD) not available?',
      a: 'We prepare all food items freshly upon receiving orders under organic, preservative-free rules. To avoid food waste during transit and ensure absolute authenticity, we operate solely on a prepaid basis.'
    },
    {
      q: 'What are the shipping charges?',
      a: 'Shipping charges are extra and calculated dynamically at actual carrier rates based on the total weight of your package and delivery pincode.'
    },
    {
      q: 'How long does shipping take?',
      a: 'Since we cook/pack fresh on order, dispatch occurs within 24-48 hours. Delivery takes 3-5 business days depending on your location across India.'
    },
    {
      q: 'Do you ship internationally?',
      a: 'Currently, our standard WhatsApp checkout supports shipping across India. For bulk international orders, please email support@svadafoods.com directly to coordinate customs and courier.'
    }
  ];

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 5000);
    }
  };

  return (
    <div className="font-poppins py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[85vh] overflow-x-hidden">
      
      {/* Page Header */}
      <div className="text-center space-y-3 mb-12" data-aos="fade-up">
        <span className="text-xs font-bold text-accent tracking-widest uppercase block">
          Connect with Us
        </span>
        <h1 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
          We Would Love to Hear From You
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
        <p className="text-sm text-svada-light font-light max-w-xl mx-auto leading-relaxed">
          Have queries about traditional recipes, bulk ordering, customized sweet packs, or shipping? Reach out to our village desk directly!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* LEFT COLUMN - CONTACT INFORMATION */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Connect Cards */}
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="font-outfit font-bold text-svada-dark text-lg border-b border-orange-50 pb-3">
              Direct Contact Channels
            </h3>

            <div className="space-y-4">
              <a 
                href="https://api.whatsapp.com/send?phone=919000000000&text=Hi%20SVADA%20Foods!%20I%20have%20a%20query%20about..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 rounded-2xl transition duration-300"
              >
                <div className="bg-emerald-500 text-white p-3 rounded-xl">
                  <MessageCircle className="h-5 w-5 fill-white text-emerald-500" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Live Chat desk</span>
                  <span className="font-bold text-sm text-emerald-950">Chat via WhatsApp Desk</span>
                  <p className="text-[11px] text-emerald-700/80 font-light leading-normal">Fastest support for order bookings.</p>
                </div>
              </a>

              <div className="flex items-start space-x-4 p-4 bg-orange-50/50 border border-orange-100/50 rounded-2xl">
                <div className="bg-primary text-white p-3 rounded-xl">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Phone support</span>
                  <span className="font-bold text-sm text-svada-dark">+91 90000 00000</span>
                  <p className="text-[11px] text-svada-light font-light leading-normal">Mon - Sat: 9:00 AM to 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-orange-50/50 border border-orange-100/50 rounded-2xl">
                <div className="bg-primary text-white p-3 rounded-xl flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="text-left min-w-0 overflow-hidden">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Email inbox</span>
                  <span className="font-bold text-sm text-svada-dark break-all block">support@svadafoods.com</span>
                  <p className="text-[11px] text-svada-light font-light leading-normal">Response within 12 business hours.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-orange-50/50 border border-orange-100/50 rounded-2xl">
                <div className="bg-primary text-white p-3 rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Kitchen headquarters</span>
                  <span className="font-bold text-sm text-svada-dark">SVADA Foods, Hyderabad</span>
                  <p className="text-[11px] text-svada-light font-light leading-relaxed">
                    Plot 42, Traditional Kitchens Zone, Hyderabad, Telangana, India.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Vector Theme Map Container */}
          <div className="bg-gradient-to-br from-[#2B1B15] to-[#1A0F0C] text-white p-6 rounded-3xl space-y-4 shadow-md text-left">
            <h4 className="font-outfit font-bold text-base text-white">📍 Kitchen Location</h4>
            <div className="bg-[#1F120E] aspect-video rounded-2xl border border-orange-950/60 p-4 flex flex-col justify-center items-center text-center relative overflow-hidden">
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
              <div className="bg-primary/20 text-primary w-12 h-12 rounded-full flex items-center justify-center border border-primary/30 animate-pulse mb-3 z-10">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="font-outfit font-bold text-sm text-white relative z-10">SVADA Traditional Central Kitchen</span>
              <span className="text-[10px] text-orange-200/50 mt-1 relative z-10">Kukatpally Food Park, Hyderabad, India</span>
              <span className="text-[9px] text-accent font-bold uppercase tracking-widest mt-3 border border-accent/20 px-2 py-0.5 rounded-full relative z-10 bg-emerald-950/40">
                ✓ Fully Hygienic Certified
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - FEEDBACK FORM */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 shadow-xs text-left">
            <h3 className="font-outfit font-bold text-svada-dark text-xl border-b border-orange-50 pb-3 mb-6">
              Send an Instant Message
            </h3>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4 animate-zoom-in">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                <h4 className="font-outfit font-bold text-emerald-950 text-lg">Thank you! Message Received</h4>
                <p className="text-xs text-emerald-800 font-light leading-relaxed max-w-sm mx-auto">
                  Your inquiry has been logged successfully at our village support desk. One of our recipe curators will coordinate and write back to your email/phone shortly.
                </p>
                <div className="h-1 w-24 bg-emerald-500 rounded-full mx-auto" />
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleInputChange}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 text-xs font-semibold text-svada-dark placeholder-svada-light/40 focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleInputChange}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 text-xs font-semibold text-svada-dark placeholder-svada-light/40 focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white"
                      placeholder="name@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 text-xs font-semibold text-svada-dark placeholder-svada-light/40 focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white"
                      placeholder="10 digit number"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formState.subject}
                      onChange={handleInputChange}
                      className="w-full bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 text-xs font-semibold text-svada-dark placeholder-svada-light/40 focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white"
                      placeholder="e.g. Bulk sweets request"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-svada-light font-bold uppercase block mb-1">Your Message *</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formState.message}
                    onChange={handleInputChange}
                    className="w-full bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 text-xs font-semibold text-svada-dark placeholder-svada-light/40 focus:outline-hidden focus:ring-1 focus:ring-primary focus:bg-white"
                    placeholder="Write details about your request..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message to Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 shadow-xs text-left" data-aos="fade-up">
        <h3 className="font-outfit font-black text-svada-dark text-xl border-b border-orange-50 pb-3 mb-6 flex items-center">
          <HelpCircle className="h-5 w-5 mr-2 text-primary" />
          <span>Ordering Support Desk FAQs</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-orange-50 rounded-2xl overflow-hidden bg-orange-50/20"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-4 font-bold text-xs sm:text-sm text-svada-dark flex justify-between items-center hover:bg-orange-50/50 transition duration-300"
              >
                <span>{faq.q}</span>
                <span className="text-primary font-bold text-lg leading-none">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              
              {activeFaq === idx && (
                <div className="px-5 pb-4 text-xs text-svada-light leading-relaxed font-light border-t border-orange-100/30 pt-3 bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
