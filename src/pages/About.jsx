import React from 'react';
import { Leaf, Award, Heart, Check, Smile, Flame } from 'lucide-react';

export default function About() {
  const commitments = [
    {
      title: 'Forest Grown & Tribal Farms',
      desc: 'We source our raw ingredients directly from pristine forest areas and local tribal farms, ensuring absolute purity and supporting sustainable farming practices.',
      icon: '🌳'
    },
    {
      title: 'No Preservatives / Colors / Chemicals',
      desc: 'Our food is 100% natural. We do not use any chemical shelf-stabilizers, artificial colorings, synthetic vinegar, or health-damaging preservatives.',
      icon: '🍃'
    },
    {
      title: 'Empowerment in Locals',
      desc: 'By preparing our food items in local villages, we empower rural women and local artisans, providing sustainable livelihoods and keeping heritage alive.',
      icon: '🤝'
    },
    {
      title: 'Pure / Traditional / Authentic',
      desc: 'Every recipe is prepared exactly the way our ancestors did—handcrafted in small batches, slow-cooked, and bursting with rich natural flavors.',
      icon: '✨'
    }
  ];

  return (
    <div className="font-poppins overflow-x-hidden w-full">
      
      {/* 1. BRAND STORY & HERO */}
      <section className="py-20 bg-gradient-to-b from-[#FFF5E6] to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story description */}
            <div className="text-left space-y-6 animate-fade-right" data-aos="fade-right">
              <span className="text-xs font-bold text-accent tracking-widest uppercase block">
                Deep Telugu Heritage
              </span>
              <h1 className="font-outfit font-black text-4xl sm:text-5xl text-svada-dark leading-tight">
                Preserving Traditional Telugu Kitchen Recipes
              </h1>
              <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full" />
              
              <p className="text-sm sm:text-base text-svada-light font-light leading-relaxed">
                SVADA was born out of a simple, beautiful dream: to bring back the pure, authentic, unadulterated taste of grandmother's kitchen. Modern commercial food manufacturing relies heavily on chemical shelf-stabilizers, flavor boosters, synthetic vinegar, and highly refined cheap oils that impact overall digestive and physical wellness.
              </p>
              
              <p className="text-sm sm:text-base text-svada-light font-light leading-relaxed">
                We believe that food is medicine when crafted right. By partnering directly with local natural farmers in Telugu villages, we source premium handpicked ingredients, preparing pickles, flours, podis, and healthy snacks exactly the way our ancestors did. Clean, pure, slow-cooked, and bursting with rich natural flavors.
              </p>
            </div>

            {/* Visual banner */}
            <div className="relative overflow-hidden" data-aos="zoom-in">
              <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:rotate-0 transition duration-500 bg-[#F5EDD6]">
                <img
                  src="/image copy 155.png"
                  alt="SVADA Traditional Farms"
                  className="w-full h-full object-contain"
                />
                
                {/* Float tag */}
                <div className="absolute bottom-6 right-6 bg-[#D94F04] text-white py-2 px-4 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1">
                  <span>🏡 Authentic Village Prep</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. MISSION & VISION STATEMENTS */}
      <section className="py-20 bg-svada-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-orange-100/50 shadow-xs space-y-4 text-left" data-aos="fade-up">
              <div className="bg-orange-100 text-primary w-12 h-12 rounded-2xl flex items-center justify-center">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="font-outfit font-black text-svada-dark text-2xl">
                Our Sacred Mission
              </h3>
              <p className="text-xs sm:text-sm text-svada-light leading-relaxed font-light">
                To revive and promote pure, natural, and preservative-free eating across modern urban households. We are committed to handcrafting high-quality traditional food items, empowering local village artisans, keeping soil natural, and ensuring that future generations remain rooted in healthy dietary culture.
              </p>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-orange-100/50 shadow-xs space-y-4 text-left" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-orange-100 text-primary w-12 h-12 rounded-2xl flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-outfit font-black text-svada-dark text-2xl">
                Our Culinary Vision
              </h3>
              <p className="text-xs sm:text-sm text-svada-light leading-relaxed font-light">
                To become India's most loved and trusted household brand for authentic, healthy homemade foods and eco-friendly products. We envision a society where people enjoy pure food without chemical ingredients, choosing a lifestyle of wellness, sustainability, and harmony with nature.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR CORE COMMITMENTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block">
              Our Pillars
            </span>
            <h2 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
              Our Core Commitments
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
            <p className="text-sm text-svada-light font-light leading-relaxed">
              At SVADA Farms, we are dedicated to health, heritage, and community. We believe in delivering pure food crafted with traditional care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {commitments.map((st, idx) => (
              <div
                key={idx}
                className="bg-svada-bg p-6 rounded-3xl border border-orange-100/50 text-left relative flex flex-col justify-between"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                <div className="space-y-4">
                  <span className="text-4xl block">{st.icon}</span>
                  <h4 className="font-outfit font-bold text-svada-dark text-base sm:text-lg">
                    {st.title}
                  </h4>
                  <p className="text-xs text-svada-light leading-relaxed font-light">
                    {st.desc}
                  </p>
                </div>
                <span className="text-5xl font-outfit font-black text-orange-200/25 absolute bottom-4 right-4 z-0">
                  0{idx + 1}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. FOUNDER'S PERSONAL MESSAGE */}
      <section className="py-20 bg-gradient-to-b from-[#2B1B15] to-[#1A0F0C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image of Founder */}
            <div className="lg:col-span-4" data-aos="fade-right">
              <div className="aspect-square max-w-xs mx-auto rounded-3xl overflow-hidden border-4 border-orange-950/60 shadow-2xl relative bg-[#F5EDD6]">
                <img
                  src="/image copy 156.png"
                  alt="Soushilya - Founder of Svada Farms"
                  className="w-full h-full object-contain transition-all duration-300 transform hover:scale-105"
                />
              </div>
            </div>

            {/* Founder Message Content */}
            <div className="lg:col-span-8 text-left space-y-6" data-aos="fade-left">
              <span className="text-xs font-bold text-secondary tracking-widest uppercase block">
                Meet Our Founder
              </span>
              <h2 className="font-outfit font-black text-3xl text-white">
                Welcome to Svada Farms!
              </h2>
              <div className="h-1 bg-primary w-20 rounded-full" />
              
              <p className="text-sm sm:text-base text-orange-100/80 leading-relaxed font-light italic">
                "I’m Soushilya, passionate about healthy living and sustainable food practices. At Svada Farms, we are committed to offering pure natural products while creating a positive impact on people and the planet."
              </p>
              
              <p className="text-sm sm:text-base text-orange-100/80 leading-relaxed font-light italic">
                "Thank you for choosing us — I look forward to serving you soon!"
              </p>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h5 className="font-outfit font-bold text-white text-base">Soushilya</h5>
                  <p className="text-xs text-orange-200/50">Founder, Svada Farms</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-xs text-amber-200 max-w-max">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-bold tracking-wider uppercase text-[10px]">FSSAI Lic. No. 23624036000890</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. NATURAL HEALTH VALUE HIGHLIGHTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block">
              Natural Abundance
            </span>
            <h2 className="font-outfit font-black text-svada-dark text-3xl sm:text-4xl">
              Our Non-Negotiable Health Standards
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-svada-bg p-8 rounded-3xl border border-orange-100/50 flex flex-col justify-between text-left space-y-4">
              <div className="text-primary text-2xl">🍯</div>
              <h4 className="font-outfit font-bold text-svada-dark text-lg">Pure Raw Honey & Ghee</h4>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Our forest honey is never heated or pasteurized, retaining raw digestive enzymes. Our A2 ghee churned from curds is loaded with butyric acid for gut wellness.
              </p>
            </div>

            <div className="bg-svada-bg p-8 rounded-3xl border border-orange-100/50 flex flex-col justify-between text-left space-y-4">
              <div className="text-primary text-2xl">🌾</div>
              <h4 className="font-outfit font-bold text-svada-dark text-lg">Sprouted Nutrient Powders</h4>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                We sprout finger millet (ragi) and jowar prior to stone grinding. Sprouting neutralizes phytic acids, unlocking maximum iron, zinc, and bio-available calcium.
              </p>
            </div>

            <div className="bg-svada-bg p-8 rounded-3xl border border-orange-100/50 flex flex-col justify-between text-left space-y-4">
              <div className="text-primary text-2xl">🎋</div>
              <h4 className="font-outfit font-bold text-svada-dark text-lg">Sustainable Living Ethics</h4>
              <p className="text-xs text-svada-light leading-relaxed font-light">
                Healthy life extends past food. Our seasoned bamboo bottles, ridge gourd (tori) bath scrubbers, and neem wood combs reduce plastic toxicity inside your bath and home.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}


