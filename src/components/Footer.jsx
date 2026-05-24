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
    <footer className="bg-gradient-to-b from-[#2B1B15] to-[#1A0F0C] text-orange-100 font-poppins pt-16 pb-8 border-t-4 border-primary">
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
              <p className="text-xs text-orange-200/70">Empowering local artisans and organic farmers.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h4 className="font-outfit font-bold text-white text-lg">Pure Organic Ingredients</h4>
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
              Crafting premium homemade pickles, fresh powders, traditional stone-ground flours, and organic eco-friendly utilities with pure Telugu tradition.
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
                <span>Plot 42, Traditional Kitchens Zone, Hyderabad, Telangana, India.</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                <span>+91 90000 00000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span>support@svadafoods.com</span>
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
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition">Terms of Service</a>
            <a href="#" className="hover:text-primary transition">Shipping Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
