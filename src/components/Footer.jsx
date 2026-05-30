import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Phone, Mail, MapPin, Sparkles, Send } from 'lucide-react';

export default function Footer() {
  const { setCurrentPage, setSelectedCategory } = useContext(ShopContext);

  const handleNavClick = (page) => {
    setSelectedCategory('All');
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#2B1B15] to-[#1A0F0C] text-orange-100 font-poppins pt-16 pb-20 md:pb-8 border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Highlight Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-orange-950/40">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h4 className="font-outfit font-bold text-white text-lg">100% Traditional Prep</h4>
              <p className="text-xs text-orange-200/70">No artificial preservatives or colorings added.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h4 className="font-outfit font-bold text-white text-lg">Direct From Village</h4>
              <p className="text-xs text-orange-200/70">Empowering local artisans and natural farmers.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h4 className="font-outfit font-bold text-white text-lg">Pure Natural Ingredients</h4>
              <p className="text-xs text-orange-200/70">Carefully handpicked raw materials for high purity.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
              <img
                src="/logo.png"
                alt="SVADA Logo"
                className="h-24 md:h-28 w-auto object-contain rounded-2xl transform hover:scale-105 transition duration-300"
              />
            </div>
            <p className="text-sm text-orange-200/70 leading-relaxed font-light">
              Crafting premium homemade pickles, fresh powders, traditional stone-ground flours, and natural eco-friendly utilities with pure Telugu tradition.
            </p>
            
            {/* Business Policy Badges */}
            <div className="space-y-2 pt-2">
              <div className="inline-block bg-red-950/50 border border-red-500/30 px-3 py-1.5 rounded-xl text-red-300 text-xs font-semibold">
                ⚠️ No Cash on Delivery (Prepaid Only)
              </div>
              <p className="text-[11px] text-orange-200/50 italic">
                *Shipping charges calculated additionally based on delivery location weight.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.instagram.com/svada_traditional_foods?igsh=NjN3cWMyNWRhdjZp&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#B3743B] text-orange-100 hover:text-white p-2.5 rounded-xl border border-white/10 transition duration-300 flex items-center justify-center"
                title="Instagram"
              >
                <svg
                  className="h-5 w-5 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@soushilyas?si=TtZoQpsoQKkdJPT4"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#B3743B] text-orange-100 hover:text-white p-2.5 rounded-xl border border-white/10 transition duration-300 flex items-center justify-center"
                title="YouTube"
              >
                <svg
                  className="h-5 w-5 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1HmtGFyvRr/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#B3743B] text-orange-100 hover:text-white p-2.5 rounded-xl border border-white/10 transition duration-300 flex items-center justify-center"
                title="Facebook"
              >
                <svg
                  className="h-5 w-5 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-outfit font-bold text-white text-lg border-b border-primary/20 pb-2">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-orange-200/80 font-light">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-primary transition duration-300">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('products')} className="hover:text-primary transition duration-300">
                  Shop Food Products
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-primary transition duration-300">
                  Our Story & Preparation
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')} className="hover:text-primary transition duration-300">
                  Get in Touch
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('login')} className="hover:text-primary transition duration-300">
                  User Account / Login
                </button>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="font-outfit font-bold text-white text-lg border-b border-primary/20 pb-2">Our Offerings</h4>
            <ul className="space-y-2 text-sm text-orange-200/80 font-light">
              <li>
                <button onClick={() => handleCategoryClick('Pickles & Powders')} className="hover:text-primary transition duration-300 text-left">
                  Pickles & Powders
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Cold Pressed oils & Ghee & honey')} className="hover:text-primary transition duration-300 text-left">
                  Oils, Ghee & Honey
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Seasonal Spices & Masala')} className="hover:text-primary transition duration-300 text-left">
                  Spices & Masalas
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('sweets & snacks')} className="hover:text-primary transition duration-300 text-left">
                  Sweets & Snacks
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Personal hair care')} className="hover:text-primary transition duration-300 text-left">
                  Personal Hair Care
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-outfit font-bold text-white text-lg border-b border-primary/20 pb-2">Business Desk</h4>
            <ul className="space-y-3 text-sm text-orange-200/80 font-light">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>18-115/13, Vidhya nagar, Khanapur, Nirmal, Telangana, India - 504203</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                <span>+91 90009 55239</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span>svadatraditionalfoods@gmail.com</span>
              </li>
            </ul>
            
            {/* Premium Mini Newsletter */}
            <div className="pt-2">
              <p className="text-xs text-orange-200/60 mb-2">Subscribe for traditional food preparation stories.</p>
              <div className="flex bg-orange-950/40 rounded-xl overflow-hidden border border-orange-900/60 p-1">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="bg-transparent text-white px-3 py-1.5 text-xs focus:outline-hidden w-full placeholder-orange-200/30"
                />
                <button className="bg-primary text-white p-2 rounded-lg hover:bg-secondary transition duration-300">
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom copyright */}
        <div className="pt-8 border-t border-orange-950/40 text-center text-xs text-orange-200/40 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} SVADA Homemade Foods. All Rights Reserved. Crafted with love in India.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <button onClick={() => handleNavClick('privacy')} className="hover:text-primary transition cursor-pointer">Privacy Policy</button>
            <a href="#" className="hover:text-primary transition">Terms of Service</a>
            <button onClick={() => handleNavClick('shipping')} className="hover:text-primary transition cursor-pointer">Shipping Policy</button>
            <button onClick={() => handleNavClick('refund')} className="hover:text-primary transition cursor-pointer">Refund Policy</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
