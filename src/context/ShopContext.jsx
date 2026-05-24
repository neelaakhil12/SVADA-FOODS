import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

const PRODUCTS_DATA = [
  // 1. Cold Pressed oils & Ghee & honey
  {
    id: 'hp2',
    name: 'Desi Cow Ghee (A2 Vedic Bilona)',
    category: 'Cold Pressed oils & Ghee & honey',
    price250g: 350,
    price500g: 680,
    price1kg: 1300,
    rating: 4.9,
    reviews: 178,
    description: 'Premium A2 cow ghee prepared traditional Bilona way: curdling A2 milk, churning to butter (makkhan), and heating slowly. Extremely aromatic, grainy, and packed with health benefits.',
    image: '/desi-cow-ghee.png',
    ingredients: 'A2 Cow Milk Fat (Clarified Butter).',
    isBestseller: true
  },
  {
    id: 'hp1',
    name: 'Wild Forest Honey (100% Pure)',
    category: 'Cold Pressed oils & Ghee & honey',
    price250g: 220,
    price500g: 400,
    price1kg: 750,
    rating: 5.0,
    reviews: 215,
    description: 'Raw, unpasteurized, and unfiltered honey ethically sourced from the deciduous forests. Rich in natural pollen, enzymes, and antioxidants with a complex woody sweet taste.',
    image: '/wild-forest-honey.png',
    ingredients: '100% Pure Raw Forest Honey.',
    isBestseller: true
  },
  {
    id: 'cpo1',
    name: 'Cold Pressed Groundnut Oil (Verusenaga Nune)',
    category: 'Cold Pressed oils & Ghee & honey',
    price250g: 100,
    price500g: 180,
    price1kg: 340,
    rating: 4.8,
    reviews: 92,
    description: 'Traditionally extracted wood-pressed (lakdi ghani) groundnut oil from sun-dried premium peanuts. Retains rich aroma, natural nutrients, and sweet nutty flavor.',
    image: '/groundnut-oil.png',
    ingredients: '100% Wood-Pressed Groundnut Seeds.',
    isBestseller: false
  },
  {
    id: 'cpo2',
    name: 'Cold Pressed White Sesame Oil',
    category: 'Cold Pressed oils & Ghee & honey',
    price250g: 220,
    price500g: 400,
    price1kg: 780,
    rating: 4.8,
    reviews: 85,
    description: 'Pure cold-pressed white sesame oil. Rich in antioxidants and perfect for cooking and ayurvedic practices.',
    image: '/sesame-oil.png',
    ingredients: '100% Wood-Pressed White Sesame Seeds.',
    isBestseller: false
  },
  {
    id: 'cpo3',
    name: 'Cold Pressed Castor Oil',
    category: 'Cold Pressed oils & Ghee & honey',
    price250g: 150,
    price500g: 280,
    price1kg: 550,
    rating: 4.7,
    reviews: 62,
    description: '100% pure, unrefined cold-pressed castor oil. Excellent for hair growth, skin moisturizing, and traditional home remedies.',
    image: '/castor-oil.png',
    ingredients: '100% Cold-Pressed Castor Seeds.',
    isBestseller: false
  },
  {
    id: 'cpo4',
    name: 'Coconut Oil',
    category: 'Cold Pressed oils & Ghee & honey',
    price250g: 250,
    price500g: 480,
    price1kg: 900,
    rating: 4.9,
    reviews: 145,
    description: 'Premium extra virgin coconut oil extracted from fresh coconut milk. Unrefined, unbleached, and perfect for raw consumption, cooking, and skin care.',
    image: '/coconut-oil.png',
    ingredients: '100% Fresh Coconut Milk Extract.',
    isBestseller: true
  },
  {
    id: 'hp3',
    name: 'Buffalo Desi Ghee',
    category: 'Cold Pressed oils & Ghee & honey',
    price250g: 200,
    price500g: 380,
    price1kg: 750,
    rating: 4.8,
    reviews: 98,
    description: 'Pure, rich, and aromatic Buffalo Desi Ghee made using traditional methods. Excellent for deep frying, sweets, and everyday cooking.',
    image: '/buffalo-ghee.png',
    ingredients: 'Buffalo Milk Fat (Clarified Butter).',
    isBestseller: false
  },
  // 3. Dry fruits, Nuts & seeds
  {
    id: 'df1',
    name: 'California Almonds',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 250,
    price500g: 480,
    price1kg: 900,
    rating: 4.8,
    reviews: 110,
    description: 'Premium, crunchy California Almonds. Rich in protein, healthy fats, and perfect for daily snacking or adding to your favorite recipes.',
    image: '/california-almonds.png',
    ingredients: '100% Raw California Almonds.',
    isBestseller: true
  },
  {
    id: 'df2',
    name: 'Chia Seeds',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 150,
    price500g: 280,
    price1kg: 500,
    rating: 4.7,
    reviews: 79,
    description: 'Organic raw chia seeds. A superfood loaded with Omega-3, fiber, and antioxidants. Perfect for smoothies, puddings, or oatmeal.',
    image: '/chia-seeds.png',
    ingredients: 'Raw Chia Seeds.',
    isBestseller: false
  },
  {
    id: 'df3',
    name: 'Dates Crown',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 200,
    price500g: 380,
    price1kg: 700,
    rating: 4.9,
    reviews: 150,
    description: 'Premium quality Dates Crown. Naturally sweet, soft, and packed with essential minerals and energy. A perfect healthy snack.',
    image: '/dates-crown.png',
    ingredients: '100% Natural Dates.',
    isBestseller: true
  },
  {
    id: 'df4',
    name: 'Flaxseeds',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 90,
    price500g: 170,
    price1kg: 300,
    rating: 4.6,
    reviews: 65,
    description: 'Roasted and crunchy flaxseeds. A great dietary source of fiber and Omega-3 fatty acids for heart and digestive health.',
    image: '/flax-seeds.png',
    ingredients: 'Premium Flaxseeds.',
    isBestseller: false
  },
  {
    id: 'df5',
    name: 'Roasted Cashew Chikki',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 220,
    price500g: 400,
    price1kg: 750,
    rating: 4.9,
    reviews: 125,
    description: 'Traditional Indian sweet snack made with premium roasted cashews and pure organic jaggery. Crunchy, sweet, and healthy.',
    image: '/roasted-cashew-chikki.png',
    ingredients: 'Roasted Cashews, Organic Jaggery.',
    isBestseller: true
  },
  {
    id: 'df6',
    name: 'Makhana',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 300,
    price500g: 580,
    price1kg: 1100,
    rating: 4.8,
    reviews: 88,
    description: 'Premium quality Fox Nuts (Makhana). Light, crunchy, and highly nutritious. A guilt-free snack perfect for anytime munching.',
    image: '/makhana.png',
    ingredients: '100% Fox Nuts (Makhana).',
    isBestseller: false
  },
  {
    id: 'df7',
    name: 'Pumpkin Seeds',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 180,
    price500g: 340,
    price1kg: 650,
    rating: 4.7,
    reviews: 72,
    description: 'Raw, unsalted premium pumpkin seeds. Rich in magnesium, zinc, and healthy fats. Ideal for snacking or garnishing salads.',
    image: '/pumpkin-seeds.png',
    ingredients: 'Raw Pumpkin Seeds.',
    isBestseller: false
  },
  {
    id: 'df8',
    name: 'Sunflower Seeds',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 140,
    price500g: 260,
    price1kg: 480,
    rating: 4.6,
    reviews: 55,
    description: 'Healthy and crunchy raw sunflower seeds. Packed with Vitamin E and selenium. Great for immune support and skin health.',
    image: '/sunflower-seeds.png',
    ingredients: 'Raw Sunflower Seeds.',
    isBestseller: false
  },
  {
    id: 'df9',
    name: 'Nuts infused with wild forest honey',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 350,
    price500g: 680,
    price1kg: 1300,
    rating: 5.0,
    reviews: 140,
    description: 'A decadent and healthy blend of premium nuts (almonds, cashews, walnuts) deeply infused in raw wild forest honey.',
    image: '/nuts-infused-honey.png',
    ingredients: 'Mixed Nuts, Wild Forest Honey.',
    isBestseller: true
  },
  {
    id: 'df10',
    name: 'Dried Dates Powder',
    category: 'Dry fruits, Nuts & seeds',
    price250g: 180,
    price500g: 340,
    price1kg: 650,
    rating: 4.8,
    reviews: 85,
    description: '100% natural dried dates powder (Kharik Powder). An excellent natural sweetener and nutritional supplement for milk and baby foods.',
    image: '/dried-dates-powder.png',
    ingredients: 'Dried Dates.',
    isBestseller: false
  },

  // 4. Herb Extract Foods
  {
    id: 'hef1',
    name: 'Chintha Chiguru',
    category: 'Herb Extract Foods',
    price250g: 150,
    price500g: 280,
    price1kg: 520,
    rating: 4.8,
    reviews: 65,
    description: 'Fresh and tender tamarind leaves (Chintha Chiguru), sun-dried for authentic culinary use. A rich source of Vitamin C and traditional tanginess.',
    image: '/chintha-chiguru.png',
    ingredients: '100% Sun-dried Tender Tamarind Leaves.',
    isBestseller: true
  },
  {
    id: 'hef2',
    name: 'Mamidikaya Orugulu',
    category: 'Herb Extract Foods',
    price250g: 180,
    price500g: 340,
    price1kg: 650,
    rating: 4.7,
    reviews: 82,
    description: 'Traditional sun-dried raw mango pieces (Orugulu). Used to add a natural tangy flavor to dals and authentic Andhra curries throughout the year.',
    image: '/mamidikaya-orugulu.png',
    ingredients: 'Sun-dried Raw Mango.',
    isBestseller: false
  },
  {
    id: 'hef3',
    name: 'Moringa leaves',
    category: 'Herb Extract Foods',
    price250g: 120,
    price500g: 220,
    price1kg: 400,
    rating: 4.9,
    reviews: 110,
    description: 'Organic shade-dried Moringa leaves. A nutritional powerhouse for teas, soups, and traditional recipes.',
    image: '/moringa-leaves.png',
    ingredients: '100% Organic Moringa Leaves.',
    isBestseller: false
  },
  {
    id: 'hef4',
    name: 'Rosemary Dried leaves',
    category: 'Herb Extract Foods',
    price250g: 250,
    price500g: 480,
    price1kg: 900,
    rating: 4.6,
    reviews: 45,
    description: 'Premium dried rosemary leaves. Excellent for seasoning, infusing in olive oil, or brewing for hair care rinses.',
    image: '/rosemary-dried-leaves.png',
    ingredients: 'Dried Rosemary Leaves.',
    isBestseller: false
  },
  {
    id: 'hef5',
    name: 'Sonti',
    category: 'Herb Extract Foods',
    price250g: 140,
    price500g: 260,
    price1kg: 480,
    rating: 4.8,
    reviews: 95,
    description: 'High-quality dry ginger root (Sonti). A must-have for traditional Ayurvedic remedies and digestion-friendly teas.',
    image: '/sonti.png',
    ingredients: 'Dry Ginger Root.',
    isBestseller: true
  },
  {
    id: 'hef6',
    name: 'Bittergourd Flakes',
    category: 'Herb Extract Foods',
    price250g: 160,
    price500g: 300,
    price1kg: 550,
    rating: 4.5,
    reviews: 38,
    description: 'Sun-dried bittergourd (Kakarakaya) flakes. Can be fried as a healthy crispy side or boiled for diabetic-friendly remedies.',
    image: '/bittergourd-flakes.png',
    ingredients: 'Sun-dried Bittergourd.',
    isBestseller: false
  },
  {
    id: 'hef7',
    name: 'Katira',
    category: 'Herb Extract Foods',
    price250g: 220,
    price500g: 400,
    price1kg: 780,
    rating: 4.7,
    reviews: 55,
    description: 'Pure Katira gum. Natural cooling agent used in traditional summer drinks and desserts.',
    image: '/katira.png',
    ingredients: '100% Katira Gum.',
    isBestseller: false
  },
  {
    id: 'hef8',
    name: 'Gond katira',
    category: 'Herb Extract Foods',
    price250g: 220,
    price500g: 400,
    price1kg: 780,
    rating: 4.7,
    reviews: 63,
    description: 'Premium Tragacanth gum (Gond Katira). Widely used in Ayurveda for its cooling properties and for making healthy laddoos.',
    image: '/gond-katira.png',
    ingredients: '100% Gond Katira.',
    isBestseller: false
  },
  {
    id: 'hef9',
    name: 'Dry Ginger Powder',
    category: 'Herb Extract Foods',
    price250g: 160,
    price500g: 300,
    price1kg: 580,
    rating: 4.9,
    reviews: 120,
    description: 'Finely milled dry ginger powder. Perfect for baking, teas, and soothing throat irritation.',
    image: '/dry-ginger-powder.png',
    ingredients: 'Dry Ginger (Sonti) Powder.',
    isBestseller: false
  },
  {
    id: 'hef10',
    name: 'Dry Pasupu komulu',
    category: 'Herb Extract Foods',
    price250g: 130,
    price500g: 240,
    price1kg: 450,
    rating: 4.9,
    reviews: 145,
    description: 'Pure, organic dry turmeric roots (Pasupu Komulu). Unpolished and rich in natural curcumin.',
    image: '/dry-pasupu-komulu.png',
    ingredients: 'Organic Turmeric Roots.',
    isBestseller: true
  },
  {
    id: 'hef11',
    name: 'Karakkaya',
    category: 'Herb Extract Foods',
    price250g: 110,
    price500g: 200,
    price1kg: 380,
    rating: 4.8,
    reviews: 75,
    description: 'Dried Haritaki (Karakkaya) fruits. A vital Ayurvedic herb used for digestive health and in the preparation of Triphala.',
    image: '/karakkaya.png',
    ingredients: 'Dried Haritaki.',
    isBestseller: false
  },
  {
    id: 'hef12',
    name: 'Ippa Puvvu / Mahua Flowers',
    category: 'Herb Extract Foods',
    price250g: 150,
    price500g: 280,
    price1kg: 520,
    rating: 4.6,
    reviews: 42,
    description: 'Sun-dried Mahua flowers. Naturally sweet and traditionally fermented or boiled for health tonics.',
    image: '/ippa-puvvu.png',
    ingredients: 'Dried Mahua Flowers.',
    isBestseller: false
  },
  {
    id: 'hef13',
    name: 'Moringa powder',
    category: 'Herb Extract Foods',
    price250g: 140,
    price500g: 260,
    price1kg: 480,
    rating: 4.9,
    reviews: 180,
    description: 'Finely ground organic moringa leaf powder. A potent superfood supplement for smoothies and juices.',
    image: '/moringa-powder.png',
    ingredients: 'Organic Moringa Leaf Powder.',
    isBestseller: true
  },
  {
    id: 'hef14',
    name: 'Raw Tamarind seeds',
    category: 'Herb Extract Foods',
    price250g: 90,
    price500g: 170,
    price1kg: 320,
    rating: 4.5,
    reviews: 33,
    description: 'Whole raw tamarind seeds. Traditionally roasted and eaten, or ground into powder for joint health.',
    image: '/raw-tamarind-seeds.png',
    ingredients: 'Raw Tamarind Seeds.',
    isBestseller: false
  },
  {
    id: 'hef15',
    name: 'Triphala Powder',
    category: 'Herb Extract Foods',
    price250g: 160,
    price500g: 300,
    price1kg: 580,
    rating: 4.8,
    reviews: 112,
    description: 'Classic Ayurvedic blend of Amla, Haritaki, and Bibhitaki. Excellent for natural detox and digestive wellness.',
    image: '/triphala-powder.png',
    ingredients: 'Amla, Haritaki, Bibhitaki.',
    isBestseller: true
  },
  {
    id: 'hef16',
    name: 'Bittergourd Powder',
    category: 'Herb Extract Foods',
    price250g: 180,
    price500g: 340,
    price1kg: 650,
    rating: 4.7,
    reviews: 68,
    description: 'Dry bittergourd powder. A convenient dietary supplement often taken with water for blood sugar management.',
    image: '/bittergourd-powder.png',
    ingredients: 'Dried Bittergourd Powder.',
    isBestseller: false
  },

  // 5. Herbs & Extracts
  {
    id: 'he1',
    name: 'Herbal hair growth oil',
    category: 'Herbs & Extracts',
    price250g: 250,
    price500g: 480,
    price1kg: 900,
    rating: 4.9,
    reviews: 167,
    description: 'Premium herbal hair growth oil infused with natural extracts. Nourishes the scalp and promotes healthy hair growth.',
    image: '/herbal-hair-growth-oil.png',
    ingredients: 'Herbal Extracts, Carrier Oils.',
    isBestseller: true
  },
  {
    id: 'he2',
    name: 'Hair wash powder',
    category: 'Herbs & Extracts',
    price250g: 150,
    price500g: 280,
    price1kg: 500,
    rating: 4.8,
    reviews: 89,
    description: 'Traditional herbal hair wash powder. A natural alternative to shampoo that cleanses without stripping natural oils.',
    image: '/hair-wash-powder.png',
    ingredients: 'Shikakai, Reetha, Amla, Hibiscus.',
    isBestseller: false
  },
  {
    id: 'he3',
    name: 'Tooth powder',
    category: 'Herbs & Extracts',
    price250g: 120,
    price500g: 220,
    price1kg: 400,
    rating: 4.7,
    reviews: 55,
    description: 'Natural herbal tooth powder for strong gums and fresh breath. Made with traditional Ayurvedic ingredients.',
    image: '/tooth-powder-v2.png',
    ingredients: 'Neem, Clove, Salt, Mint.',
    isBestseller: false
  },
  {
    id: 'he4',
    name: 'Bath powder',
    category: 'Herbs & Extracts',
    price250g: 180,
    price500g: 340,
    price1kg: 650,
    rating: 4.8,
    reviews: 112,
    description: 'Refreshing herbal bath powder (Sunni Pindi). Gently exfoliates and leaves your skin soft and glowing.',
    image: '/bath-powder.png',
    ingredients: 'Green Gram, Turmeric, Rose Petals.',
    isBestseller: true
  },
  {
    id: 'he5',
    name: 'Baby bath powder',
    category: 'Herbs & Extracts',
    price250g: 200,
    price500g: 380,
    price1kg: 700,
    rating: 4.9,
    reviews: 145,
    description: 'Gentle and safe herbal bath powder specially formulated for delicate baby skin.',
    image: '/baby-bath-powder.png',
    ingredients: 'Fine Green Gram, Mild Herbs.',
    isBestseller: false
  },
  {
    id: 'he6',
    name: 'Dish wash powder',
    category: 'Herbs & Extracts',
    price250g: 90,
    price500g: 160,
    price1kg: 300,
    rating: 4.6,
    reviews: 78,
    description: 'Eco-friendly herbal dish wash powder. Tough on grease but gentle on hands and the environment.',
    image: '/dish-wash-powder.png',
    ingredients: 'Wood Ash, Soapnut, Lemon.',
    isBestseller: false
  },
  {
    id: 'he7',
    name: 'Henna powder',
    category: 'Herbs & Extracts',
    price250g: 130,
    price500g: 240,
    price1kg: 450,
    rating: 4.8,
    reviews: 210,
    description: 'Pure, organic Henna (Mehendi) powder. Perfect for natural hair coloring and conditioning.',
    image: '/henna-powder.png',
    ingredients: '100% Pure Henna Leaves.',
    isBestseller: true
  },
  {
    id: 'he8',
    name: 'Indigo',
    category: 'Herbs & Extracts',
    price250g: 150,
    price500g: 280,
    price1kg: 520,
    rating: 4.7,
    reviews: 95,
    description: 'Natural Indigo powder for hair. Use with Henna for a deep, rich natural black or brown color.',
    image: '/indigo-powder.png',
    ingredients: '100% Pure Indigo Leaves.',
    isBestseller: false
  },
  {
    id: 'he9',
    name: 'Multani Matti',
    category: 'Herbs & Extracts',
    price250g: 80,
    price500g: 150,
    price1kg: 280,
    rating: 4.9,
    reviews: 132,
    description: 'Pure Fuller\'s Earth (Multani Mitti). An excellent natural cleanser and astringent for glowing, oil-free skin.',
    image: '/multani-mitti.png',
    ingredients: '100% Multani Mitti.',
    isBestseller: true
  },
  {
    id: 'he10',
    name: 'Face glowing pack',
    category: 'Herbs & Extracts',
    price250g: 220,
    price500g: 400,
    price1kg: 780,
    rating: 4.8,
    reviews: 64,
    description: 'Special herbal blend face pack for a radiant, glowing complexion. Rich in natural antioxidants.',
    image: '/face-glowing-pack.png',
    ingredients: 'Sandalwood, Turmeric, Rose Powder.',
    isBestseller: false
  },
  {
    id: 'he11',
    name: 'Hair smoothening pack',
    category: 'Herbs & Extracts',
    price250g: 240,
    price500g: 450,
    price1kg: 850,
    rating: 4.7,
    reviews: 82,
    description: 'Nourishing herbal hair pack designed to deep condition and smoothen frizzy hair naturally.',
    image: '/hair-smoothening-pack.png',
    ingredients: 'Aloe Vera Powder, Hibiscus, Fenugreek.',
    isBestseller: false
  },

  // 6. Household supplies
  {
    id: 'hs1',
    name: 'Bamboo Bottle',
    category: 'Household supplies',
    price250g: 450,
    price500g: 450,
    price1kg: 450,
    rating: 4.8,
    reviews: 120,
    description: 'Eco-friendly, beautifully crafted bamboo water bottle. Keeps water fresh and adds a natural touch to your daily hydration.',
    image: '/bamboo-bottle.png',
    ingredients: 'Natural Bamboo.',
    isBestseller: true,
    isEcoPiece: true
  },
  {
    id: 'hs2',
    name: 'Bamboo mug',
    category: 'Household supplies',
    price250g: 250,
    price500g: 250,
    price1kg: 250,
    rating: 4.7,
    reviews: 85,
    description: 'Handcrafted reusable bamboo mug. Perfect for your morning coffee or tea while reducing plastic waste.',
    image: '/bamboo-mug.png',
    ingredients: 'Natural Bamboo.',
    isBestseller: false,
    isEcoPiece: true
  },
  {
    id: 'hs3',
    name: 'Coconut coir Scrubbers',
    category: 'Household supplies',
    price250g: 60,
    price500g: 60,
    price1kg: 60,
    rating: 4.9,
    reviews: 210,
    description: '100% natural, biodegradable coconut coir scrubbers. Tough on grease but gentle on non-stick pans and the planet.',
    image: '/coconut-coir-scrubbers.png',
    ingredients: 'Natural Coconut Coir.',
    isBestseller: true,
    isEcoPiece: true
  },
  {
    id: 'hs4',
    name: 'Kids Brush',
    category: 'Household supplies',
    price250g: 90,
    price500g: 90,
    price1kg: 90,
    rating: 4.8,
    reviews: 95,
    description: 'Eco-friendly bamboo toothbrush designed specifically for kids. Soft bristles for gentle cleaning.',
    image: '/kids-brush.png',
    ingredients: 'Bamboo Handle, BPA-free bristles.',
    isBestseller: false,
    isEcoPiece: true
  },
  {
    id: 'hs5',
    name: 'Adults Brush',
    category: 'Household supplies',
    price250g: 110,
    price500g: 110,
    price1kg: 110,
    rating: 4.7,
    reviews: 150,
    description: 'Sustainable bamboo toothbrush for adults. Ergonomic handle and medium-soft bristles for effective cleaning.',
    image: '/adults-brush.png',
    ingredients: 'Bamboo Handle, BPA-free bristles.',
    isBestseller: true,
    isEcoPiece: true
  },
  {
    id: 'hs6',
    name: 'Tongue cleaner',
    category: 'Household supplies',
    price250g: 120,
    price500g: 120,
    price1kg: 120,
    rating: 4.9,
    reviews: 230,
    description: 'Pure copper or bamboo tongue cleaner. An essential Ayurvedic tool for daily oral hygiene.',
    image: '/tongue-cleaner.png',
    ingredients: 'Copper / Bamboo.',
    isBestseller: false,
    isEcoPiece: true
  },
  {
    id: 'hs7',
    name: 'Pocket comb',
    category: 'Household supplies',
    price250g: 80,
    price500g: 80,
    price1kg: 80,
    rating: 4.8,
    reviews: 70,
    description: 'Handcrafted neem wood pocket comb. Anti-static and helps distribute natural hair oils while fighting dandruff.',
    image: '/pocket-comb.png',
    ingredients: 'Natural Neem Wood.',
    isBestseller: false,
    isEcoPiece: true
  },
  {
    id: 'hs8',
    name: 'lilly comb',
    category: 'Household supplies',
    price250g: 140,
    price500g: 140,
    price1kg: 140,
    rating: 4.7,
    reviews: 65,
    description: 'Premium neem wood Lilly comb with fine and wide teeth. Perfect for detangling without hair breakage.',
    image: '/lilly-comb.png',
    ingredients: 'Natural Neem Wood.',
    isBestseller: false,
    isEcoPiece: true
  },
  {
    id: 'hs9',
    name: 'Tori loofah',
    category: 'Household supplies',
    price250g: 80,
    price500g: 80,
    price1kg: 80,
    rating: 4.6,
    reviews: 47,
    description: '100% natural, biodegradable body exfoliator made from dried ridge gourd fruit. Exfoliates dead skin cells naturally.',
    image: '/tori-loofah.png',
    ingredients: '100% Sun-dried Ridge Gourd Fibers.',
    isBestseller: false,
    isEcoPiece: true
  },
  {
    id: 'hs10',
    name: 'Jute loofah',
    category: 'Household supplies',
    price250g: 100,
    price500g: 100,
    price1kg: 100,
    rating: 4.8,
    reviews: 55,
    description: 'Eco-friendly natural jute loofah. Durable and perfect for gentle daily exfoliation and body scrubbing.',
    image: '/jute-loofah.png',
    ingredients: '100% Natural Jute.',
    isBestseller: false,
    isEcoPiece: true
  },

  // 7. Millets & Flakes
  {
    id: 'mf1',
    name: 'Rice flour / Biyyam Pindi',
    category: 'Millets & Flakes',
    price250g: 40,
    price500g: 75,
    price1kg: 140,
    rating: 4.8,
    reviews: 125,
    description: 'Fine-milled, premium quality rice flour. Ideal for traditional Indian snacks and gluten-free baking.',
    image: '/rice-flour.png',
    ingredients: '100% Premium Rice.',
    isBestseller: true
  },
  {
    id: 'mf2',
    name: 'Wheat Flour',
    category: 'Millets & Flakes',
    price250g: 35,
    price500g: 65,
    price1kg: 120,
    rating: 4.9,
    reviews: 210,
    description: 'Whole wheat flour rich in fiber and nutrients. Perfect for soft, healthy rotis and everyday cooking.',
    image: '/wheat-flour.png',
    ingredients: '100% Whole Wheat.',
    isBestseller: true
  },
  {
    id: 'mf3',
    name: 'Multi Grain Atta',
    category: 'Millets & Flakes',
    price250g: 50,
    price500g: 90,
    price1kg: 170,
    rating: 4.9,
    reviews: 180,
    description: 'A nutritious blend of wholesome grains for a balanced diet. High in fiber and essential proteins.',
    image: '/multi-grain-atta.png',
    ingredients: 'Wheat, Oats, Ragi, Soy, Chana, Maize.',
    isBestseller: false
  },
  {
    id: 'mf4',
    name: 'Ragi Flour',
    category: 'Millets & Flakes',
    price250g: 45,
    price500g: 80,
    price1kg: 150,
    rating: 4.8,
    reviews: 110,
    description: 'Freshly milled finger millet (Ragi) flour. A powerhouse of calcium and iron, excellent for healthy dosas and malt.',
    image: '/ragi-flour.png',
    ingredients: '100% Ragi Grains.',
    isBestseller: false
  },
  {
    id: 'mf5',
    name: 'Jower Flour',
    category: 'Millets & Flakes',
    price250g: 45,
    price500g: 80,
    price1kg: 150,
    rating: 4.7,
    reviews: 85,
    description: 'Pure sorghum (Jowar) flour. Naturally gluten-free, rich in protein, and ideal for healthy bhakris.',
    image: '/jower-flour.png',
    ingredients: '100% Jowar Grains.',
    isBestseller: false
  },
  {
    id: 'mf6',
    name: 'Sprouted Ragi Flour',
    category: 'Millets & Flakes',
    price250g: 65,
    price500g: 120,
    price1kg: 230,
    rating: 4.9,
    reviews: 145,
    description: 'Highly nutritious flour made from sprouted Ragi. Sprouting increases nutrient absorption, perfect for baby food.',
    image: '/sprouted-ragi-flour.png',
    ingredients: 'Sprouted Ragi.',
    isBestseller: true
  },
  {
    id: 'mf7',
    name: 'Sprouted Jower Flour',
    category: 'Millets & Flakes',
    price250g: 60,
    price500g: 110,
    price1kg: 210,
    rating: 4.8,
    reviews: 90,
    description: 'Nutrient-dense flour made from sprouted Jowar. Easier to digest and higher in bioavailable nutrients.',
    image: '/sprouted-jower-flour.png',
    ingredients: 'Sprouted Jowar.',
    isBestseller: false
  },
  {
    id: 'mf8',
    name: 'Makka Rava',
    category: 'Millets & Flakes',
    price250g: 40,
    price500g: 75,
    price1kg: 140,
    rating: 4.7,
    reviews: 65,
    description: 'Coarse maize (Makka) semolina. Perfect for a hearty and traditional gluten-free upma or porridge.',
    image: '/makka-rava.png',
    ingredients: 'Maize (Corn).',
    isBestseller: false
  },
  {
    id: 'mf9',
    name: 'Jower Rava',
    category: 'Millets & Flakes',
    price250g: 50,
    price500g: 90,
    price1kg: 170,
    rating: 4.8,
    reviews: 80,
    description: 'Coarse sorghum (Jowar) semolina. A healthy, low-GI alternative for upma, idlis, and dosas.',
    image: '/jower-rava.png',
    ingredients: 'Jowar (Sorghum).',
    isBestseller: false
  },
  {
    id: 'mf10',
    name: 'Chennaga Pindi',
    category: 'Millets & Flakes',
    price250g: 55,
    price500g: 100,
    price1kg: 190,
    rating: 4.9,
    reviews: 135,
    description: 'Pure gram flour (Besan) made from premium chana dal. Essential for crispy pakodas, sweets, and savory dishes.',
    image: '/chennaga-pindi.png',
    ingredients: '100% Chana Dal (Gram).',
    isBestseller: true
  },
  {
    id: 'mf11',
    name: 'Corn Flakes',
    category: 'Millets & Flakes',
    price250g: 65,
    price500g: 120,
    price1kg: 230,
    rating: 4.8,
    reviews: 215,
    description: 'Crispy and crunchy corn flakes. A classic, healthy breakfast cereal to start your day right.',
    image: '/corn-flakes.png',
    ingredients: 'Corn, Malt Extract, Salt.',
    isBestseller: false
  },
  {
    id: 'mf12',
    name: 'Uggu (Traditional Baby Food)',
    category: 'Millets & Flakes',
    price250g: 300,
    price500g: 600,
    price1kg: 850,
    rating: 5.0,
    reviews: 145,
    description: 'Traditionally prepared baby food mix (Uggu) for infants and toddlers. Sprouted grains slowly dry-roasted and stone-ground to facilitate premium digestion, bone strength, and immunity.',
    image: '/image copy 71.png',
    ingredients: 'Sprouted Rice, Ragi, Moong Dal, Almonds, Cashews, Cumin Seeds, Carom Seeds (Ajwain).',
    isBestseller: true,
    weightLabels: [
      { value: '250g', label: '8-12m (500g)' },
      { value: '500g', label: '8-12m (1kg)' },
      { value: '1kg', label: '1 Year+ (1kg)' }
    ]
  },
  {
    id: 'mf14',
    name: 'Jowar Malt',
    category: 'Millets & Flakes',
    price250g: 120,
    price500g: 220,
    price1kg: 400,
    rating: 4.8,
    reviews: 73,
    description: 'Traditionally processed Jowar (Sorghum) Malt. Highly cooling, fiber-rich, and gluten-free dietary drink perfect for regular energy and diabetic wellness.',
    image: '/image copy 72.png',
    ingredients: '100% Sprouted Sorghum (Jowar) Grains.',
    isBestseller: false
  },
  {
    id: 'mf15',
    name: 'Ragi Malt (Sprouted & Roasted)',
    category: 'Millets & Flakes',
    price250g: 120,
    price500g: 220,
    price1kg: 400,
    rating: 4.9,
    reviews: 210,
    description: 'Sprouted, sun-dried, and slow-roasted Ragi (Finger Millet) Malt. Rich in calcium and bioavailable iron, making it an excellent daily drink for both children and adults.',
    image: '/image copy 73.png',
    ingredients: '100% Sprouted Finger Millet (Ragi).',
    isBestseller: true
  },
  {
    id: 'mf16',
    name: 'Makkalu (Whole Yellow Maize)',
    category: 'Millets & Flakes',
    price250g: 20,
    price500g: 30,
    price1kg: 50,
    rating: 4.8,
    reviews: 42,
    description: 'High-quality dry whole yellow maize (Makkalu) kernels, loaded with rich dietary fibers and essential proteins. Sourced directly from local organic farms.',
    image: '/image copy 74.png',
    ingredients: '100% Whole Yellow Maize.',
    isBestseller: false
  },


  // 9. Pickles & Powders
  {
    id: 'pk1',
    name: 'Tomato Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 142,
    description: 'Traditional Andhra style tangy tomato pickle made with fresh vine-ripened tomatoes, pure cold-pressed groundnut oil, and freshly ground spice blend. Perfect with hot rice and ghee.',
    image: '/image copy 75.png',
    ingredients: 'Tomatoes, Tamarind, Mustard Seeds, Fenugreek, Garlic, Chili Powder, Salt, Wood-Pressed Groundnut Oil.',
    isBestseller: true
  },
  {
    id: 'pk2',
    name: 'Gongura Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.9,
    reviews: 189,
    description: 'Authentic Andhra Gongura pickle, known as the "Andhra Queen of Pickles". Made with sour sorrel leaves sautéed to perfection and spiced with red chilies and garlic.',
    image: '/image copy 76.png',
    ingredients: 'Sorrel Leaves (Gongura), Red Chili, Garlic, Salt, Cold Pressed Oil, Mustard, Cumin.',
    isBestseller: true
  },
  {
    id: 'pk3',
    name: 'Kakarakaya Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.6,
    reviews: 78,
    description: 'Healthy and flavorful bitter gourd pickle. Crispy fried kakarakaya pieces infused with tamarind pulp and robust Andhra spices, balancing the bitterness into a gourmet experience.',
    image: '/image copy 77.png',
    ingredients: 'Bitter gourd, Tamarind, Chili Powder, Salt, Turmeric, Garlic, Mustard Oil, Fenugreek.',
    isBestseller: false
  },
  {
    id: 'pk4',
    name: 'Lemon Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.7,
    reviews: 105,
    description: 'Classic oil-free lemon pickle cured naturally in sunlight. Offers a perfect balance of sour, salty, and spicy flavors that mature and taste better with age.',
    image: '/image copy 78.png',
    ingredients: 'Fresh Lemons, Sea Salt, Red Chili Powder, Turmeric, Fenugreek powder.',
    isBestseller: false
  },
  {
    id: 'pk5',
    name: 'Amla Pickle (Usirikaya)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.9,
    reviews: 136,
    description: 'Traditional home-style Indian Gooseberry (Amla) pickle. Whole sun-cured amla infused with robust pickling spices, mustard oil, and split fenugreek seeds.',
    image: '/image copy 79.png',
    ingredients: 'Amla Grains, Mustard Oil, Split Mustard, Red Chili Powder, Fenugreek, Sea Salt.',
    isBestseller: true
  },
  {
    id: 'pk6',
    name: 'Drumstick Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 84,
    description: 'A rare and delicious Andhra specialty! Tender fresh drumsticks slow-cooked and marinated in a pungent, spicy, and tangy pickle gravy.',
    image: '/image copy 80.png',
    ingredients: 'Drumstick pieces, Tamarind extract, Sea Salt, Chili Powder, Garlic, Sesame Oil.',
    isBestseller: false
  },
  {
    id: 'pk7',
    name: 'Chikkudukaya Pickle (Flat Beans)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.7,
    reviews: 62,
    description: 'Distinctive village style flat beans pickle. Perfectly cooked fresh flat beans tossed in a fiery, aromatic spice blend with authentic gingelly oil.',
    image: '/image copy 81.png',
    ingredients: 'Flat Beans, Ginger Garlic Paste, Mustard Seeds, Chili Powder, Salt, Hing, Gingelly Oil.',
    isBestseller: false
  },
  {
    id: 'pk8',
    name: 'Allam / Ginger Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 121,
    description: 'Tangy and spicy ginger pickle (Allam Pachadi) prepared with fresh country ginger and rich jaggery. An absolute must-have side dish for traditional breakfast crepes.',
    image: '/image copy 82.png',
    ingredients: 'Fresh Ginger, Organic Jaggery, Tamarind, Chili Powder, Sea Salt, Garlic, Cumin.',
    isBestseller: true
  },
  {
    id: 'pk9',
    name: 'Avakaya / Mango Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 5.0,
    reviews: 320,
    description: 'The legendary Telugu Avakaya pickle made with premium sour raw mangoes (Kothapalli Kobbari variety), freshly milled mustard powder, and authentic red chilies. Made fresh every summer.',
    image: '/image copy 83.png',
    ingredients: 'Raw Mango Pieces, Mustard Powder, Red Chili Powder, Salt, Cold Pressed Gingelly/Groundnut Oil, Garlic.',
    isBestseller: true
  },
  {
    id: 'pk10',
    name: 'Bellam Avakaya / Sweet Mango Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.9,
    reviews: 156,
    description: 'A delightful blend of sweet, sour, and spicy! Raw mango pieces infused with pure organic jaggery (bellam) and traditional pickles spices. A favorite among kids.',
    image: '/image copy 84.png',
    ingredients: 'Raw Mangoes, Organic Jaggery, Red Chili Powder, Mustard Seeds, Salt, Turmeric, Cold Pressed Oil.',
    isBestseller: false
  },
  {
    id: 'pk11',
    name: 'Uppu Thokku / Nuvvula Avakaya',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 95,
    description: 'Aromatic and flavorful Sesame-infused Mango Pickle. Premium raw mango chunks slowly cured with roasted sesame seed paste and clean sea salt for a deep, rich, nutty profile.',
    image: '/image copy 85.png',
    ingredients: 'Mango pieces, Sesame seeds powder, Fenugreek, Gingelly Oil, Sea Salt, Garlic.',
    isBestseller: false
  },
  {
    id: 'pk12',
    name: 'Allam Thokku / Ginger Mango Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 110,
    description: 'Exquisite fusion pickle prepared by pounding raw green mango grates with fresh zesty ginger root and village jaggery. Perfect balanced sweet, spicy, and sour notes.',
    image: '/image copy 86.png',
    ingredients: 'Grated Raw Mango, Country Ginger, Organic Jaggery, Mustard Seeds, Red Chili, Salt.',
    isBestseller: false
  },
  {
    id: 'pk13',
    name: 'Alikkaya Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.7,
    reviews: 42,
    description: 'Rare and traditional heritage forest fruit pickle. Slowly cured in rock salt and hand-blended village spices for an authentic, ancestral culinary experience.',
    image: '/image copy 87.png',
    ingredients: 'Alikkaya forest berries, Rock Salt, Turmeric, Chili Powder, Mustard oil.',
    isBestseller: false
  },
  {
    id: 'pk14',
    name: 'Vakkaya Pickle',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 67,
    description: 'Piquant and delicious Natal Plum (Vakkaya) pickle. The natural extreme sourness of the vakkaya berry is perfectly balanced with bold hot spices and pure cold-pressed oil.',
    image: '/image copy 88.png',
    ingredients: 'Vakkaya Berries, Mustard Seed Powder, Fenugreek, Gingelly Oil, Chili Powder, Salt.',
    isBestseller: false
  },
  {
    id: 'pk15',
    name: 'Chinthakaya Pickle (Tamarind)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.9,
    reviews: 145,
    description: 'Authentic Andhra style raw green tamarind pickle. Cured carefully in raw salt and turmeric, then pounded with hot chilies and garlic for a powerful tangy burst.',
    image: '/image copy 89.png',
    ingredients: 'Raw Green Tamarind, Sea Salt, Turmeric, Garlic, Fenugreek, Mustard Seeds, Sesamum Oil.',
    isBestseller: true
  },
  {
    id: 'pd1',
    name: 'Special Karivepaku Podi (Curry Leaves)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.9,
    reviews: 112,
    description: 'Nutritious roasted curry leaf powder made with fresh organic curry leaves, lentils, and hand-selected spices. Highly recommended for hair health and digestion.',
    image: '/image copy 90.png',
    ingredients: 'Fresh Curry Leaves, Chana Dal, Urad Dal, Coriander Seeds, Cumin, Garlic, Dry Red Chilies, Salt.',
    isBestseller: true
  },
  {
    id: 'pd2',
    name: 'Munagaku Podi (Moringa Leaves)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.9,
    reviews: 95,
    description: 'Superfood moringa powder blend. Made from shade-dried organic drumstick leaves, slowly roasted with rich lentils and spices to deliver a high-nutrition condiment.',
    image: '/image copy 91.png',
    ingredients: 'Organic Moringa Leaves, Black Gram (Urad Dal), Bengal Gram, Red Chili, Tamarind, Garlic, Salt.',
    isBestseller: false
  },
  {
    id: 'pd3',
    name: 'Flax Seed Podi',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.7,
    reviews: 84,
    description: 'A delicious way to include Omega-3 in your daily diet. Roasted golden flax seeds blended with traditional Andhra spices for a nutty, healthy accompaniment to idli and dosa.',
    image: '/image copy 92.png',
    ingredients: 'Flax Seeds, Chana Dal, Urad Dal, Coriander Seeds, Red Chili, Tamarind, Salt.',
    isBestseller: false
  },
  {
    id: 'pd4',
    name: 'Nuvvula Karam',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 79,
    description: 'Rich, aromatic roasted sesame seed powder. Pounded slowly with red chilies, garlic, and cumin to create a warm, nutty, and highly savory seasoning for breakfast and steamed rice.',
    image: '/image copy 93.png',
    ingredients: 'Sesame Seeds, Dry Red Chili, Cumin, Garlic, Salt, Gingelly Oil.',
    isBestseller: false
  },
  {
    id: 'pd5',
    name: 'Palli Karam (Peanut Powder)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.9,
    reviews: 145,
    description: 'Decadent slow-roasted peanut powder (Palli Podi). Blended with garlic and robust red chilies to deliver a highly addictive, crunch-packed traditional breakfast powder.',
    image: '/image copy 94.png',
    ingredients: 'Peanuts, Red Chili Powder, Cumin, Garlic, Coriander Seeds, Salt.',
    isBestseller: true
  },
  {
    id: 'pd6',
    name: 'Kakarakaya Podi (Bittergourd Powder)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.6,
    reviews: 58,
    description: 'Super healthy bittergourd podi. Crisp-fried bittergourd flakes ground slowly with a special blend of non-bitter lentils and spices, making it a delicious diabetic-friendly diet option.',
    image: '/image copy 95.png',
    ingredients: 'Bittergourd Flakes, Bengal Gram, Black Gram, Garlic, Tamarind, Red Chili, Salt.',
    isBestseller: false
  },
  {
    id: 'pd7',
    name: 'Vellulli Karam Podi (Garlic Chili Powder)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.9,
    reviews: 198,
    description: 'The legendary Andhra Garlic Karam! Pungent country garlic cloves hand-pounded with dynamic Guntur red chili flakes and cumin. Fills your kitchen with amazing aroma.',
    image: '/image copy 96.png',
    ingredients: 'Country Garlic, Dry Red Chili, Cumin Seeds, Sea Salt, Sesamum Oil.',
    isBestseller: true
  },
  {
    id: 'pd8',
    name: 'Nalla Karam Podi',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 165,
    description: 'Traditional dark, robust spice powder made by pounding black gram hulls, tamarind, garlic, and hot red chilies. An ultimate soul food pairing with hot idlis.',
    image: '/image copy 98.png',
    ingredients: 'Split Black Gram with skin, Tamarind, Dry Red Chili, Coriander Seeds, Cumin, Garlic, Salt.',
    isBestseller: true
  },
  {
    id: 'pd9',
    name: 'Kandhi Karam (Toor Dal Karam)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 110,
    description: 'Classic comforting Toor Dal spice powder. Dry-roasted pigeon peas (Kandhi Pappu) ground with dry chilies and cumin. Perfect with hot rice, ghee, and absolute bliss.',
    image: '/image copy 97.png',
    ingredients: 'Toor Dal (Pigeon Peas), Cumin Seeds, Pepper, Dry Red Chili, Salt.',
    isBestseller: false
  },
  {
    id: 'pd10',
    name: 'Kobbari Karam (Coconut Karam)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.7,
    reviews: 83,
    description: 'Scrumptious dry coconut garlic spice powder. Fine grated desiccated coconut toasted golden and ground with bold red chilies and fresh garlic.',
    image: '/image copy 99.png',
    ingredients: 'Dry Coconut Grates, Country Garlic, Red Chili, Cumin, Salt.',
    isBestseller: false
  },
  {
    id: 'pd11',
    name: 'Pappula Podi',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 125,
    description: 'Light, crunchy roasted gram powder (Putnala Podi). Blended with dry garlic and mild red chili. A kids favorite that goes perfectly as a seasoning or with warm rice.',
    image: '/image copy 100.png',
    ingredients: 'Roasted Bengal Gram (Putnalu), Garlic, Red Chili, Cumin, Salt.',
    isBestseller: false
  },
  {
    id: 'pd12',
    name: 'Pesara Podi (Moong Dal Powder)',
    category: 'Pickles & Powders',
    price250g: 160,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 72,
    description: 'Soothing roasted moong dal spice powder. Extremely light on the stomach, highly nutritious, and ground with cumin and mild black pepper.',
    image: '/image copy 110.png',
    ingredients: 'Moong Dal, Pepper, Cumin, Red Chili, Sea Salt.',
    isBestseller: false
  },




  // 12. Rices, Flours, Pulses & other

  // 13. Seasonal Spices & Masala
  {
    id: 'spc1',
    name: 'Dhaniya Powder',
    category: 'Seasonal Spices & Masala',
    price250g: 80,
    price500g: 150,
    price1kg: 400,
    rating: 4.8,
    reviews: 58,
    description: 'Aromatic and pure coriander powder prepared from hand-selected premium coriander seeds. Dry-roasted slowly and finely ground to retain natural freshness.',
    image: '/image copy 101.png',
    ingredients: '100% Pure Premium Coriander Seeds.',
    isBestseller: false
  },
  {
    id: 'spc2',
    name: 'Chilly Powder',
    category: 'Seasonal Spices & Masala',
    price250g: 140,
    price500g: 260,
    price1kg: 500,
    rating: 4.9,
    reviews: 74,
    description: 'Pure, robust, and highly aromatic red chili powder made from selected sun-dried red chilies. Adds a spectacular natural red color and spicy warmth to all your recipes.',
    image: '/image copy 102.png',
    ingredients: '100% Whole Dry Red Chilies.',
    isBestseller: false
  },
  {
    id: 'spc3',
    name: 'Pasupu (Turmeric Powder)',
    category: 'Seasonal Spices & Masala',
    price250g: 90,
    price500g: 160,
    price1kg: 300,
    rating: 4.9,
    reviews: 92,
    description: 'Golden-yellow premium turmeric powder ground from organic dry turmeric roots (Pasupu Komulu). High curcumin content with wonderful medicinal value and purity.',
    image: '/image copy 103.png',
    ingredients: '100% Organic Turmeric Roots.',
    isBestseller: false
  },
  {
    id: 'spc4',
    name: 'Garam Masala',
    category: 'Seasonal Spices & Masala',
    price250g: 260,
    price500g: 500,
    price1kg: 980,
    rating: 4.9,
    reviews: 83,
    description: 'Premium gourmet blend of rich, warm Indian spices. Handcrafted to a centuries-old recipe to bring the royal heritage taste and aroma directly to your daily meals.',
    image: '/image copy 104.png',
    ingredients: 'Cardamom, Cinnamon, Cloves, Black Cumin, Star Anise, Black Pepper, Nutmeg.',
    isBestseller: false
  },
  {
    id: 'spc5',
    name: 'Biryani masala',
    category: 'Seasonal Spices & Masala',
    price250g: 380,
    price500g: 380,
    price1kg: 380,
    rating: 5.0,
    reviews: 115,
    description: 'Grandmother style secret recipe Biryani Masala. Curated with exquisite premium spices to recreate the authentic, richly fragrant Nizami Biryani right at home.',
    image: '/image copy 105.png',
    ingredients: 'Bay Leaves, Mace, Star Anise, Cloves, Cardamom, Fennel, Coriander, Shahi Jeera.',
    isBestseller: true,
    weightLabels: [{ value: '250g', label: '300g' }]
  },
  {
    id: 'spc6',
    name: 'Sambar powder',
    category: 'Seasonal Spices & Masala',
    price250g: 320,
    price500g: 320,
    price1kg: 320,
    rating: 4.8,
    reviews: 86,
    description: 'Authentic South Indian Sambar Powder. Slow dry-roasted lentils and premium hand-pulled spices ground together for the perfect aromatic, rich, and tangy Sambar.',
    image: '/image copy 106.png',
    ingredients: 'Coriander, Red Chili, Bengal Gram, Black Gram, Fenugreek, Cumin, Turmeric, Asafoetida.',
    isBestseller: false,
    weightLabels: [{ value: '250g', label: '300g' }]
  },
  {
    id: 'spc7',
    name: 'Rasam powder',
    category: 'Seasonal Spices & Masala',
    price250g: 150,
    price500g: 150,
    price1kg: 150,
    rating: 4.9,
    reviews: 64,
    description: 'Traditional piping hot Rasam Powder. Prepared using fresh handpicked spices to create the perfect digestive, tangy, and soothing rasam soup.',
    image: '/image copy 107.png',
    ingredients: 'Toor Dal, Black Pepper, Coriander Seeds, Cumin, Dry Red Chili, Turmeric.',
    isBestseller: false,
    weightLabels: [{ value: '250g', label: '150g' }]
  },
  {
    id: 'spc8',
    name: 'Chicken Masala',
    category: 'Seasonal Spices & Masala',
    price250g: 250,
    price500g: 250,
    price1kg: 250,
    rating: 4.9,
    reviews: 97,
    description: 'Special homestyle Chicken Curry Masala. Infuses deep color, spicy warmth, and rich authentic flavor into any chicken curry or dry roast fry.',
    image: '/image copy 108.png',
    ingredients: 'Coriander, Cumin, Chili, Garlic, Ginger, Cinnamon, Star Anise, Cardamom.',
    isBestseller: true,
    weightLabels: [{ value: '250g', label: '150g' }]
  },
  {
    id: 'spc9',
    name: 'Mutton Masala',
    category: 'Seasonal Spices & Masala',
    price250g: 290,
    price500g: 290,
    price1kg: 290,
    rating: 5.0,
    reviews: 79,
    description: 'Rich, aromatic Mutton Masala blend. Handcrafted with dense spices to tenderize and elevate the rich gourmet flavors of classic mutton curries and slow-cooked gravies.',
    image: '/image copy 109.png',
    ingredients: 'Black Cardamom, Mace, Nutmeg, Cloves, Coriander Seeds, Fennel, Cumin, Dry Ginger.',
    isBestseller: false,
    weightLabels: [{ value: '250g', label: '150g' }]
  },

  // 14. seeds & Plants

  // 15. Sugars, Sweetners & syrups

  // 16. sweets & snacks
  {
    id: 'sw1',
    name: 'Bellam Sunnundalu (Urad Dal Laddu)',
    category: 'sweets & snacks',
    price250g: 450,
    price500g: 450,
    price1kg: 850,
    rating: 5.0,
    reviews: 245,
    description: 'The pride of Telugu homes. Roasted urad dal powder blended with organic dark jaggery and a generous splash of pure home-made cow ghee. Melt-in-mouth texture with high calcium and iron.',
    image: '/image copy 111.png',
    ingredients: 'Urad Dal, Organic Jaggery, Pure Cow Ghee, Cardamom.',
    isBestseller: true,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw2',
    name: 'Ragi Dry Fruit Laddu',
    category: 'sweets & snacks',
    price250g: 450,
    price500g: 450,
    price1kg: 900,
    rating: 4.9,
    reviews: 122,
    description: 'Healthy and calcium-rich ragi laddus prepared with roasted ragi flour, premium dates, almonds, cashews, and pistachios, bound together with pure cow ghee.',
    image: '/image copy 112.png',
    ingredients: 'Ragi Flour, Dates, Almonds, Cashews, Pistachios, Cardamom, Pure Cow Ghee.',
    isBestseller: true,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw3',
    name: 'Dry fruit Laddu',
    category: 'sweets & snacks',
    price250g: 650,
    price500g: 650,
    price1kg: 1200,
    rating: 4.9,
    reviews: 180,
    description: 'Sugar-free, nutrient-dense luxury energy bites made entirely from premium dried fruits and roasted nuts like almonds, cashews, and walnuts.',
    image: '/image copy 113.png',
    ingredients: 'Almonds, Cashews, Walnuts, Pistachios, Dates, Raisins, Pure Ghee.',
    isBestseller: true,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw4',
    name: 'Gondh Laddu',
    category: 'sweets & snacks',
    price250g: 550,
    price500g: 550,
    price1kg: 1100,
    rating: 4.8,
    reviews: 95,
    description: 'Traditional warming sweet made with premium edible gum (Gondh), whole wheat flour, roasted nuts, and organic jaggery.',
    image: '/image copy 114.png',
    ingredients: 'Edible Gum (Gondh), Whole Wheat Flour, Almonds, Cashews, Organic Jaggery, Pure Ghee, Cardamom.',
    isBestseller: false,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw5',
    name: 'Flaxseed Laddu (Avisaginjala)',
    category: 'sweets & snacks',
    price250g: 475,
    price500g: 475,
    price1kg: 950,
    rating: 4.7,
    reviews: 74,
    description: 'Omega-3 rich healthy laddus prepared from slow-roasted golden flaxseeds, black sesame, and handpicked nuts, bound in clean jaggery syrup.',
    image: '/image copy 115.png',
    ingredients: 'Flaxseeds, Sesame Seeds, Cashews, Almonds, Organic Jaggery, Cow Ghee.',
    isBestseller: false,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw6',
    name: 'Palli Laddu (Peanut Laddu)',
    category: 'sweets & snacks',
    price250g: 300,
    price500g: 300,
    price1kg: 600,
    rating: 4.9,
    reviews: 167,
    description: 'Crispy, crunchy, and traditional peanut chikki balls made with slow-roasted premium peanuts and pure organic melted jaggery.',
    image: '/image copy 117.png',
    ingredients: 'Roasted Peanuts, Jaggery, Cardamom.',
    isBestseller: true,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw7',
    name: 'Nuvvulu Laddu (Sesame Laddu)',
    category: 'sweets & snacks',
    price250g: 300,
    price500g: 300,
    price1kg: 600,
    rating: 4.8,
    reviews: 135,
    description: 'Extremely calcium-rich and traditional sesame seed laddus made by cooking golden-roasted sesame seeds with organic dark jaggery syrup.',
    image: '/image copy 116.png',
    ingredients: 'White and Black Sesame Seeds, Organic Jaggery, Cardamom.',
    isBestseller: false,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw8',
    name: 'Maramarala Laddu (Puffed Rice Laddu)',
    category: 'sweets & snacks',
    price250g: 300,
    price500g: 300,
    price1kg: 600,
    rating: 4.7,
    reviews: 84,
    description: 'Super light, crispy, and sweet puffed rice balls bound together with warm jaggery syrup. A nostalgic children\'s favorite snack.',
    image: '/image copy 118.png',
    ingredients: 'Puffed Rice (Maramaralu), Organic Jaggery, Ginger Powder.',
    isBestseller: false,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw9',
    name: 'Kaju Patti (Cashew Chikki)',
    category: 'sweets & snacks',
    price250g: 350,
    price500g: 700,
    price1kg: 700,
    rating: 5.0,
    reviews: 156,
    description: 'Gourmet, thin, and brittle chikki prepared with hand-selected premium whole roasted cashews set in refined sugarcane syrup and ghee.',
    image: '/image copy 119.png',
    ingredients: 'Premium Cashews, Jaggery, Sugar, Pure Ghee.',
    isBestseller: true,
    weightLabels: [
      { value: '250g', label: '250g' },
      { value: '500g', label: '500g' }
    ]
  },
  {
    id: 'sw10',
    name: 'Healthy Bite (Dry Fruits & Nuts Chikki)',
    category: 'sweets & snacks',
    price250g: 600,
    price500g: 600,
    price1kg: 1200,
    rating: 4.9,
    reviews: 110,
    description: 'Pure, guilt-free premium energy bar made with roasted dry fruits and nuts compacted together. Highly nutritious and delicious.',
    image: '/image copy 120.png',
    ingredients: 'Almonds, Cashews, Pistachios, Walnuts, Pumpkin Seeds, Organic Jaggery, Honey.',
    isBestseller: true,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw11',
    name: 'Sweet Gavvalu',
    category: 'sweets & snacks',
    price250g: 250,
    price500g: 250,
    price1kg: 500,
    rating: 4.8,
    reviews: 82,
    description: 'Traditional shell-shaped deep-fried dough curls rolled in sweet cardamom-flavored organic jaggery syrup. Crunchy and sweet.',
    image: '/image copy 121.png',
    ingredients: 'All-Purpose Flour, Semolina, Jaggery, Cardamom, Cold-Pressed Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw12',
    name: 'Traditional Ariselu',
    category: 'sweets & snacks',
    price250g: 260,
    price500g: 260,
    price1kg: 520,
    rating: 4.9,
    reviews: 198,
    description: 'An authentic festive sweet prepared with freshly ground wet rice flour and dark jaggery syrup, deep-fried and topped with sesame seeds.',
    image: '/image copy 122.png',
    ingredients: 'Wet Rice Flour, Organic Jaggery, Ghee, Sesame Seeds, Oil.',
    isBestseller: true,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw13',
    name: 'Palli Pakodi (Peanut Pakoda)',
    category: 'sweets & snacks',
    price250g: 260,
    price500g: 260,
    price1kg: 520,
    rating: 4.8,
    reviews: 115,
    description: 'Crunchy, spicy, and savory peanut pakodas coated in gram flour batter and deep fried to golden crispiness.',
    image: '/image copy 123.png',
    ingredients: 'Peanuts, Gram Flour (Besan), Rice Flour, Red Chili Powder, Ginger-Garlic Paste, Spices, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '500g', label: '500g' },
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw14',
    name: 'Kaju Masala (Spicy Cashews)',
    category: 'sweets & snacks',
    price250g: 700,
    price500g: 700,
    price1kg: 700,
    rating: 4.9,
    reviews: 93,
    description: 'Premium whole cashews roasted in pure ghee and tossed in a dynamic, fiery blend of red chili powder, salt, and chaat masala.',
    image: '/image copy 124.png',
    ingredients: 'Premium Cashews, Pure Ghee, Red Chili Powder, Black Salt, Chaat Masala.',
    isBestseller: true,
    weightLabels: [
      { value: '500g', label: '500g' }
    ]
  },
  {
    id: 'sw15',
    name: 'Plain Sakinalu',
    category: 'sweets & snacks',
    price250g: 480,
    price500g: 480,
    price1kg: 480,
    rating: 4.8,
    reviews: 135,
    description: 'Traditional Telangana hand-shaped ring snack prepared with freshly ground rice flour and aromatic sesame seeds, fried completely oil-free inside.',
    image: '/image copy 125.png',
    ingredients: 'Rice Flour, Sesame Seeds, Vaamu (Ajwain), Salt, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw16',
    name: 'Karam Sakinalu (Spicy Sakinalu)',
    category: 'sweets & snacks',
    price250g: 500,
    price500g: 500,
    price1kg: 500,
    rating: 4.8,
    reviews: 97,
    description: 'Traditional crunchy Telangana rice ring snack infused with Guntur red chili powder and carom seeds for an extra spicy kick.',
    image: '/image copy 126.png',
    ingredients: 'Rice Flour, Sesame Seeds, Red Chili Powder, Vaamu, Salt, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw17',
    name: 'Traditional Murukulu (Janthikalu)',
    category: 'sweets & snacks',
    price250g: 450,
    price500g: 450,
    price1kg: 450,
    rating: 4.7,
    reviews: 98,
    description: 'Crispy and savory deep-fried rice flour spirals flavored with cumin and ajwain. A perfect companion for tea-time.',
    image: '/image copy 127.png',
    ingredients: 'Rice Flour, Gram Flour, Ajwain, Sesame Seeds, Salt, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw18',
    name: 'Sanna Karapusa (Sev)',
    category: 'sweets & snacks',
    price250g: 450,
    price500g: 450,
    price1kg: 450,
    rating: 4.8,
    reviews: 86,
    description: 'Super fine, crispy savory gram flour noodles seasoned with mild spices and deep-fried till light golden.',
    image: '/image copy 128.png',
    ingredients: 'Besan (Gram Flour), Rice Flour, Ajwain extract, Salt, Turmeric, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw19',
    name: 'Ring Chekodi',
    category: 'sweets & snacks',
    price250g: 450,
    price500g: 450,
    price1kg: 450,
    rating: 4.9,
    reviews: 145,
    description: 'Golden-yellow, extremely crispy round ring crackers prepared from premium rice flour, butter, and sesame seeds.',
    image: '/image copy 129.png',
    ingredients: 'Rice Flour, Moong Dal, Sesame Seeds, Butter, Chili Powder, Turmeric, Salt, Oil.',
    isBestseller: true,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw20',
    name: 'Makka Atukula Mixture',
    category: 'sweets & snacks',
    price250g: 450,
    price500g: 450,
    price1kg: 450,
    rating: 4.8,
    reviews: 79,
    description: 'Delightfully crunchy cornflakes tossed with roasted peanuts, cashews, fried curry leaves, and traditional spices.',
    image: '/image copy 130.png',
    ingredients: 'Corn Flakes, Peanuts, Cashews, Roasted Gram, Curry Leaves, Garlic, Spices, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw21',
    name: 'Atukulu Mixture (Poha Mixture)',
    category: 'sweets & snacks',
    price250g: 450,
    price500g: 450,
    price1kg: 450,
    rating: 4.8,
    reviews: 95,
    description: 'Light and crunchy snack made with thin beaten rice (poha) toasted with peanuts, roasted gram, and savory spices.',
    image: '/image copy 131.png',
    ingredients: 'Flattened Rice (Poha), Peanuts, Roasted Dalia, Curry Leaves, Garlic, Green Chilies, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw22',
    name: 'Maramaralu Mixture (Puffed Rice Mixture)',
    category: 'sweets & snacks',
    price250g: 450,
    price500g: 450,
    price1kg: 450,
    rating: 4.7,
    reviews: 62,
    description: 'Healthy, low-calorie puffed rice mixture tossed with peanuts, garlic, and special spices. A perfect light tea-time snack.',
    image: '/image copy 132.png',
    ingredients: 'Puffed Rice (Maramaralu), Peanuts, Roasted Gram, Curry Leaves, Garlic, Spices, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw23',
    name: 'Sev Karapusa',
    category: 'sweets & snacks',
    price250g: 480,
    price500g: 480,
    price1kg: 480,
    rating: 4.8,
    reviews: 83,
    description: 'Crispy, crunchy gram flour snack seasoned with carom seeds and garlic for a classic Andhra savory flavor.',
    image: '/image copy 133.png',
    ingredients: 'Besan (Gram Flour), Rice Flour, Vaamu, Garlic, Spices, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw24',
    name: 'Garelu (Traditional Chekkalu)',
    category: 'sweets & snacks',
    price250g: 480,
    price500g: 480,
    price1kg: 480,
    rating: 4.9,
    reviews: 145,
    description: 'Crispy, flat rice-dal crackers prepared with chana dal, ginger, and curry leaves. Deep fried to a glorious golden color.',
    image: '/image copy 134.png',
    ingredients: 'Rice Flour, Chana Dal, Ginger, Green Chili, Curry Leaves, Butter, Salt, Oil.',
    isBestseller: true,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw25',
    name: 'Ragi Murukulu',
    category: 'sweets & snacks',
    price250g: 500,
    price500g: 500,
    price1kg: 500,
    rating: 4.8,
    reviews: 77,
    description: 'Extremely healthy and crispy savory snack prepared with nutrient-rich ragi flour and sesame seeds.',
    image: '/image copy 135.png',
    ingredients: 'Ragi (Finger Millet) Flour, Rice Flour, Ajwain, Sesame Seeds, Salt, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw26',
    name: 'Jowar Murukulu',
    category: 'sweets & snacks',
    price250g: 500,
    price500g: 500,
    price1kg: 500,
    rating: 4.7,
    reviews: 58,
    description: 'Gluten-free and crunchy murukulu made with iron-rich sorghum (jowar) flour and traditional spices.',
    image: '/image copy 136.png',
    ingredients: 'Jowar (Sorghum) Flour, Rice Flour, Sesame Seeds, Ajwain, Salt, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },
  {
    id: 'sw27',
    name: 'Sajja Murukulu',
    category: 'sweets & snacks',
    price250g: 500,
    price500g: 500,
    price1kg: 500,
    rating: 4.8,
    reviews: 65,
    description: 'Nutrient-rich, extremely crunchy savory spirals prepared with roasted pearl millet (sajja) flour.',
    image: '/image copy 137.png',
    ingredients: 'Sajja (Pearl Millet) Flour, Rice Flour, Ajwain, Sesame Seeds, Salt, Oil.',
    isBestseller: false,
    weightLabels: [
      { value: '1kg', label: '1kg' }
    ]
  },

  // 17. Drinks & Tea
  {
    id: 'dt1',
    name: 'Dried Shanku Puvvulu',
    category: 'Drinks & Tea',
    price250g: 200,
    price500g: 380,
    price1kg: 700,
    rating: 4.8,
    reviews: 56,
    description: 'Premium sun-dried Shanku Puvvulu (Butterfly Pea Flowers). Perfect for brewing antioxidant-rich blue tea. Helps relieve stress and improves hair and skin health.',
    image: '/shanku-puvvulu.png',
    ingredients: '100% Sun-dried Butterfly Pea Flowers.',
    isBestseller: true
  },
  {
    id: 'dt2',
    name: 'Mungaku Powder',
    category: 'Drinks & Tea',
    price250g: 130,
    price500g: 240,
    price1kg: 450,
    rating: 4.9,
    reviews: 95,
    description: 'Superfood moringa powder blend. Made from shade-dried organic drumstick leaves, slowly roasted to deliver a high-nutrition condiment, perfect for tea.',
    image: '/mungaku-powder.png',
    ingredients: 'Organic Moringa Leaves.',
    isBestseller: false
  },
  {
    id: 'dt3',
    name: 'Hibiscus Flower',
    category: 'Drinks & Tea',
    price250g: 250,
    price500g: 480,
    price1kg: 900,
    rating: 4.7,
    reviews: 82,
    description: 'Pure, sun-dried hibiscus flowers. Brews a beautiful tart red tea packed with Vitamin C and antioxidants. Great served hot or iced.',
    image: '/hibiscus-flower.png',
    ingredients: '100% Dried Hibiscus Flowers.',
    isBestseller: false
  },
  {
    id: 'dt4',
    name: 'Ippa puvvu Flowers',
    category: 'Drinks & Tea',
    price250g: 180,
    price500g: 340,
    price1kg: 650,
    rating: 4.6,
    reviews: 45,
    description: 'Traditionally collected and dried Mahua (Ippa Puvvu) flowers. Naturally sweet and used in various traditional health drinks and medicinal teas.',
    image: '/ippa-puvvu.png',
    ingredients: '100% Dried Mahua Flowers.',
    isBestseller: false
  },
  {
    id: 'dt5',
    name: 'Tamarind seed powder',
    category: 'Drinks & Tea',
    price250g: 150,
    price500g: 280,
    price1kg: 500,
    rating: 4.5,
    reviews: 38,
    description: 'Finely ground roasted tamarind seed powder. A traditional remedy known for joint health and typically consumed by mixing with warm water or milk.',
    image: '/tamarind-seed-powder.png',
    ingredients: 'Roasted Tamarind Seeds.',
    isBestseller: false
  }
];

export const ShopProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem('svada_cart');
    return localCart ? JSON.parse(localCart) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const localWishlist = localStorage.getItem('svada_wishlist');
    return localWishlist ? JSON.parse(localWishlist) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeQuickView, setActiveQuickView] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('svada_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('svada_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add to Cart
  const addToCart = (product, weight = '250g', qty = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.weight === weight
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += qty;
        return newCart;
      } else {
        return [...prevCart, { product, weight, quantity: qty }];
      }
    });
  };

  // Remove from Cart
  const removeFromCart = (productId, weight) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.product.id === productId && item.weight === weight)
    ));
  };

  // Update Cart Quantity
  const updateCartQuantity = (productId, weight, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCart((prevCart) => prevCart.map((item) => {
      if (item.product.id === productId && item.weight === weight) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  // Toggle Wishlist
  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      } else {
        return [...prevWishlist, productId];
      }
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate Price helper based on weight selection
  const getProductPrice = (product, weight) => {
    if (weight === '250g') return product.price250g;
    if (weight === '500g') return product.price500g;
    if (weight === '1kg') return product.price1kg;
    return product.price250g;
  };

  // Get total items in cart
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Get total price in cart
  const cartTotal = cart.reduce((acc, item) => {
    const price = getProductPrice(item.product, item.weight);
    return acc + (price * item.quantity);
  }, 0);

  // Filter products based on search and category
  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let message = `*SVADA Homemade Foods - New Order Inquiry*\n`;
    message += `=============================\n\n`;
    
    cart.forEach((item, idx) => {
      const price = getProductPrice(item.product, item.weight);
      const label = item.product.isEcoPiece 
        ? (item.weight === '250g' ? '1 Pc' : item.weight === '500g' ? '2 Pcs' : '4 Pcs')
        : item.weight;
      message += `${idx + 1}. *${item.product.name}*\n   Qty: ${item.quantity} x Size: ${label} (₹${price} each)\n   Subtotal: ₹${price * item.quantity}\n\n`;
    });

    message += `=============================\n`;
    message += `*Total Order Value:* ₹${cartTotal}\n`;
    message += `*Shipping Policy:* Extra charges apply at actuals\n`;
    message += `*Payment Mode:* Prepaid Only (No COD available)\n\n`;
    message += `Please confirm availability and sharing shipping cost. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '919000000000'; // Representative WhatsApp number
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <ShopContext.Provider
      value={{
        products: PRODUCTS_DATA,
        filteredProducts,
        cart,
        wishlist,
        currentPage,
        searchQuery,
        selectedCategory,
        activeQuickView,
        isLoggedIn,
        currentUser,
        cartCount,
        cartTotal,
        setCurrentPage,
        setSearchQuery,
        setSelectedCategory,
        setActiveQuickView,
        setIsLoggedIn,
        setCurrentUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        clearCart,
        getProductPrice,
        handleWhatsAppCheckout
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
