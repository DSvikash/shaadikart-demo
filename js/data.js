/* ShaadiKart concept demo — illustrative data only.
   Photos: Unsplash (free licence), bundled in img/. */
(function () {
  const img = id => `img/${id}.jpg`;

  const PHOTOS = {
    hero: 'hero-mandap', // cropped from the founder's reference image (01_References/ShaadiKart_Home_Reference.jpg)
    couple: 'photo-1722952934661-dde241aeb591',
    indiaGate: 'photo-1587474260584-136574528ed5',
    sunset: 'photo-1591969851586-adbbd4accf81',
    events: {
      Wedding: 'photo-1587271636175-90d58cdad458',
      Birthday: 'photo-1530103862676-de8c9debad1d',
      Corporate: 'photo-1540575467063-178a50c2df87',
      Anniversary: 'photo-1527529482837-4698179dc6ce',
      Engagement: 'photo-1774024050561-4ee0148c8526',
      'Baby Shower': 'photo-1558301211-0d8c8ddee6ec'
    }
  };

  // 12 categories, per Printout 1 / ShadiKart.jpeg section 2.
  const CATEGORIES = [
    { id: 'venues', name: 'Venues & Properties', short: 'Venues', icon: 'landmark', img: 'photo-1768851142332-75f3d1b47452',
      subs: ['Marriage & banquet halls', 'Farmhouses & lawns', 'Hotels & resorts', 'Party halls & rooftops', 'Sports grounds', 'Corporate event spaces'] },
    { id: 'decor', name: 'Decoration & Setup', short: 'Decor', icon: 'flower', img: 'photo-1757589227072-0dd17af42433',
      subs: ['Wedding decorators', 'Mandap & stage', 'Balloon & floral', 'Lighting & theme setup'] },
    { id: 'photo', name: 'Photography & Videography', short: 'Photo & Video', icon: 'camera', img: 'photo-1611550287705-7ff8b459c8eb',
      subs: ['Photographers & cinematographers', 'Pre-wedding shoots', 'Drone photography', 'Live streaming', 'Album & video editing'] },
    { id: 'catering', name: 'Food & Catering', short: 'Catering', icon: 'utensils', img: 'photo-1742281257687-092746ad6021',
      subs: ['Catering companies', 'Veg / non-veg menus', 'Live food counters', 'Sweets, bakeries & cakes', 'Beverage counters'] },
    { id: 'entertainment', name: 'Entertainment', short: 'DJ & Entertainment', icon: 'music', img: 'photo-1470225620780-dba8ba36b745',
      subs: ['DJ & sound', 'Live singers & bands', 'Dance performers', 'Anchors & hosts', 'Celebrity artists', 'Fireworks (where permitted)'] },
    { id: 'beauty', name: 'Beauty & Personal Services', short: 'Beauty & Makeup', icon: 'sparkles', img: 'photo-1610173827043-9db50e0d8ef9',
      subs: ['Makeup artists', 'Bridal & groom styling', 'Mehendi artists', 'Hair & salon packages'] },
    { id: 'planner', name: 'Event Management', short: 'Planner', icon: 'calendarCheck', img: 'photo-1511795409834-ef04bbd61622',
      subs: ['Wedding & corporate planners', 'Birthday & engagement planners', 'Logistics & coordinators'] },
    { id: 'invites', name: 'Invitations & Gifting', short: 'Invites', icon: 'gift', img: 'photo-1763414902882-4e9d4f8e6275',
      subs: ['Digital & printed invitations', 'Return gifts', 'Custom hampers'] },
    { id: 'transport', name: 'Transportation', short: 'Transport', icon: 'car', img: 'photo-1570907870057-e1e338bc0665',
      subs: ['Luxury & vintage cars', 'Wedding buses', 'Guest transport', 'Airport pickup & drop'] },
    { id: 'furniture', name: 'Furniture & Rental', short: 'Rentals', icon: 'armchair', img: 'photo-1759124650320-d629a3d73d9f',
      subs: ['Chairs, tables & sofas', 'Crockery & cutlery', 'Tents & canopies', 'Generators & equipment'] },
    { id: 'essentials', name: 'Wedding Essentials', short: 'Essentials', icon: 'shirt', img: 'photo-1722952934708-749c22eb2e58',
      subs: ['Bridal & groom wear', 'Jewellery rental', 'Accessories', 'Pooja arrangements'] },
    { id: 'sports', name: 'Sports & Other Events', short: 'Sports', icon: 'trophy', img: 'photo-1675693303492-9a5bc898bf94',
      subs: ['Cricket & turf grounds', 'Sports tournaments', 'Private party venues', 'Team-building activities'] }
  ];

  const LOCALITIES = ['Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad'];
  const EVENT_TYPES = ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Engagement', 'Baby Shower'];

  // [id, category, name, area, locality, rating, reviews, basePrice, unit, photos[], busyDemo?]
  const RAW = [
    ['royal-banquet', 'venues', 'Royal Banquet Hall', 'Chhatarpur', 'Delhi', 4.7, 212, 150000, 'per event', ['photo-1768851142332-75f3d1b47452', 'photo-1526568929-7cdd510e77fd', 'photo-1542665952-14513db15293']],
    ['grand-lawns', 'venues', 'The Grand Lawns', 'Sohna Road', 'Gurugram', 4.6, 168, 220000, 'per event', ['photo-1783314867628-220ab03cac99', 'photo-1523438885200-e635ba2c371e', 'photo-1768209373252-1819f7cc699a']],
    ['shubh-vivah', 'venues', 'Shubh Vivah Farmhouse', 'Sector 135', 'Noida', 4.5, 97, 180000, 'per event', ['photo-1675247488725-22d1b78e75db', 'photo-1757589227072-0dd17af42433', 'photo-1524824267900-2fa9cbf7a506']],
    ['neelkamal', 'venues', 'Neelkamal Convention', 'Rajouri Garden', 'Delhi', 4.4, 143, 120000, 'per event', ['photo-1542665952-14513db15293', 'photo-1768851142332-75f3d1b47452', 'photo-1779301674216-506de8607c87']],
    ['aangan-rooftop', 'venues', 'Aangan Rooftop', 'Saket', 'Delhi', 4.3, 61, 80000, 'per event', ['photo-1779301674216-506de8607c87', 'photo-1653821355736-0c2598d0a63e', 'photo-1574482211311-45a2169db57c']],

    ['phoolwari', 'decor', 'Phoolwari Decor Studio', 'Kirti Nagar', 'Delhi', 4.7, 188, 65000, 'per event', ['photo-1757589227072-0dd17af42433', 'photo-1469371670807-013ccf25f16a', 'photo-1529636798458-92182e662485']],
    ['mandap-magic', 'decor', 'Mandap Magic', 'DLF Phase 3', 'Gurugram', 4.6, 120, 85000, 'per event', ['photo-1587271636175-90d58cdad458', 'photo-1769812343353-ae6ca1250bc2', 'photo-1757589227072-0dd17af42433']],
    ['gulmohar-decor', 'decor', 'Gulmohar Events Decor', 'Indirapuram', 'Ghaziabad', 4.4, 74, 55000, 'per event', ['photo-1769812343353-ae6ca1250bc2', 'photo-1523438885200-e635ba2c371e', 'photo-1469371670807-013ccf25f16a']],
    ['rangoli-theme', 'decor', 'Rangoli Theme Setup', 'Sector 18', 'Noida', 4.3, 52, 40000, 'per event', ['photo-1530103862676-de8c9debad1d', 'photo-1529636798458-92182e662485', 'photo-1653821355736-0c2598d0a63e']],

    ['wedding-stories', 'photo', 'Wedding Stories Studio', 'Lajpat Nagar', 'Delhi', 4.8, 236, 35000, 'per day', ['photo-1630526720753-aa4e71acf67d', 'photo-1611550287705-7ff8b459c8eb', 'photo-1519741497674-611481863552']],
    ['candid-frames', 'photo', 'Candid Frames', 'Golf Course Road', 'Gurugram', 4.7, 159, 45000, 'per day', ['photo-1519741497674-611481863552', 'photo-1629756048377-09540f52caa1', 'photo-1774024051727-499f15bff4c9']],
    ['drone-diaries', 'photo', 'Drone Diaries', 'Sector 62', 'Noida', 4.5, 66, 25000, 'per day', ['photo-1519689950823-0a2251441815', 'photo-1757647630063-dd5cd82271f3', 'photo-1630526720753-aa4e71acf67d']],
    ['reel-ritual', 'photo', 'Reel & Ritual Films', 'Vasant Kunj', 'Delhi', 4.6, 88, 60000, 'per day', ['photo-1774024051727-499f15bff4c9', 'photo-1629756048377-09540f52caa1', 'photo-1758810409996-583f3bad7d51']],

    ['swaad-caterers', 'catering', 'Swaad Caterers', 'Karol Bagh', 'Delhi', 4.6, 301, 120000, '300 guests', ['photo-1742281257687-092746ad6021', 'photo-1742281258189-3b933879867a', 'photo-1779301674216-506de8607c87']],
    ['annapurna', 'catering', 'Annapurna Kitchens', 'Sector 14', 'Faridabad', 4.4, 112, 95000, '300 guests', ['photo-1742281258189-3b933879867a', 'photo-1742281257707-0c7f7e5ca9c6', 'photo-1742281257687-092746ad6021']],
    ['live-counter', 'catering', 'Live Counter Co.', 'Sushant Lok', 'Gurugram', 4.5, 79, 70000, '300 guests', ['photo-1742281257707-0c7f7e5ca9c6', 'photo-1779301674216-506de8607c87', 'photo-1742281258189-3b933879867a']],
    ['mithaas', 'catering', 'Mithaas Sweets & Cakes', 'Chandni Chowk', 'Delhi', 4.7, 205, 25000, 'per order', ['photo-1558301211-0d8c8ddee6ec', 'photo-1577998474517-7eeeed4e448a', 'photo-1742281257687-092746ad6021']],

    ['beat-factory', 'entertainment', 'DJ Beat Factory', 'Pitampura', 'Delhi', 4.5, 134, 18000, 'per night', ['photo-1541126274323-dbac58d14741', 'photo-1571266028243-d220c6a7edbf', 'photo-1533174072545-7a4b6ad7a6c3'], true],
    ['sufi-nights', 'entertainment', 'Sufi Nights Live Band', 'Hauz Khas', 'Delhi', 4.8, 91, 45000, 'per night', ['photo-1533174072545-7a4b6ad7a6c3', 'photo-1470225620780-dba8ba36b745', 'photo-1758810409996-583f3bad7d51']],
    ['sound-wave', 'entertainment', 'SoundWave DJs', 'Sector 29', 'Gurugram', 4.6, 103, 22000, 'per night', ['photo-1571266028243-d220c6a7edbf', 'photo-1544785349-c4a5301826fd', 'photo-1541126274323-dbac58d14741']],
    ['anchor-aman', 'entertainment', 'Anchor Aman', 'Sector 50', 'Noida', 4.6, 58, 15000, 'per event', ['photo-1758810409996-583f3bad7d51', 'photo-1540575467063-178a50c2df87', 'photo-1533174072545-7a4b6ad7a6c3']],

    ['glam-neha', 'beauty', 'Glam by Neha', 'Rajouri Garden', 'Delhi', 4.8, 177, 15000, 'bridal look', ['photo-1610173827043-9db50e0d8ef9', 'photo-1600685890506-593fdf55949b', 'photo-1617627143750-d86bc21e42bb']],
    ['mehendi-ruksana', 'beauty', 'Mehendi by Ruksana', 'Lajpat Nagar', 'Delhi', 4.7, 142, 6000, 'bride + 10', ['photo-1621801306185-8c0ccf9c8eb8', 'photo-1610173827043-9db50e0d8ef9', 'photo-1600685890506-593fdf55949b']],
    ['groom-room', 'beauty', 'The Groom Room', 'MG Road', 'Gurugram', 4.5, 49, 8000, 'groom look', ['photo-1722952934708-749c22eb2e58', 'photo-1744804298431-57953e4eaba0', 'photo-1774024051727-499f15bff4c9']],
    ['kesar-salon', 'beauty', 'Kesar Salon Packages', 'Sector 18', 'Noida', 4.4, 67, 12000, 'family pack', ['photo-1617627143750-d86bc21e42bb', 'photo-1600685890506-593fdf55949b', 'photo-1621801306185-8c0ccf9c8eb8']],

    ['shaadi-sutra', 'planner', 'Shaadi Sutra Planners', 'Greater Kailash', 'Delhi', 4.7, 84, 75000, 'full event', ['photo-1511795409834-ef04bbd61622', 'photo-1768055105012-4c53791b2877', 'photo-1587271636175-90d58cdad458']],
    ['utsav-events', 'planner', 'Utsav Event Co.', 'Sector 44', 'Gurugram', 4.5, 63, 50000, 'full event', ['photo-1653821355736-0c2598d0a63e', 'photo-1511795409834-ef04bbd61622', 'photo-1768508950719-4d76978fdf44']],
    ['little-party', 'planner', 'Little Party Planners', 'Raj Nagar', 'Ghaziabad', 4.4, 41, 20000, 'per party', ['photo-1530103862676-de8c9debad1d', 'photo-1513151233558-d860c5398176', 'photo-1577998474517-7eeeed4e448a']],

    ['kagaz-invites', 'invites', 'Kagaz Invites', 'Chawri Bazar', 'Delhi', 4.6, 118, 12000, '300 cards', ['photo-1763414902882-4e9d4f8e6275', 'photo-1738898179451-b5fc497f9f8e', 'photo-1516617442634-75371039cb3a']],
    ['digital-nimantran', 'invites', 'Digital Nimantran', 'Sector 63', 'Noida', 4.5, 92, 3000, 'video invite', ['photo-1738898179451-b5fc497f9f8e', 'photo-1763414902882-4e9d4f8e6275', 'photo-1516617442634-75371039cb3a']],
    ['sougaat-hampers', 'invites', 'Sougaat Hampers', 'Khan Market', 'Delhi', 4.7, 76, 25000, '50 hampers', ['photo-1516617442634-75371039cb3a', 'photo-1763414902882-4e9d4f8e6275', 'photo-1558301211-0d8c8ddee6ec']],

    ['vintage-wheels', 'transport', 'Vintage Wheels Delhi', 'Mehrauli', 'Delhi', 4.7, 55, 15000, 'per day', ['photo-1570907870057-e1e338bc0665', 'photo-1777227953254-9f543992f739', 'photo-1507309270028-9121e9937409']],
    ['doli-cars', 'transport', 'Doli Luxury Cars', 'Udyog Vihar', 'Gurugram', 4.5, 47, 12000, 'per day', ['photo-1777227953254-9f543992f739', 'photo-1507309270028-9121e9937409', 'photo-1570907870057-e1e338bc0665']],
    ['baraati-bus', 'transport', 'Baraati Bus Co.', 'Sector 15', 'Faridabad', 4.3, 38, 18000, '2 coaches', ['photo-1507309270028-9121e9937409', 'photo-1570907870057-e1e338bc0665', 'photo-1777227953254-9f543992f739']],

    ['shamiana', 'furniture', 'Shamiana Tent House', 'Najafgarh', 'Delhi', 4.4, 89, 30000, 'per event', ['photo-1782567531550-22e74704f7e3', 'photo-1759124650320-d629a3d73d9f', 'photo-1768209373252-1819f7cc699a']],
    ['royal-crockery', 'furniture', 'Royal Crockery Rentals', 'Sector 37', 'Faridabad', 4.3, 44, 10000, '300 guests', ['photo-1759124650320-d629a3d73d9f', 'photo-1727931301188-55b23fa9672e', 'photo-1524824267900-2fa9cbf7a506']],
    ['powerplus', 'furniture', 'PowerPlus Gensets', 'Okhla', 'Delhi', 4.5, 36, 8000, 'per event', ['photo-1727931301188-55b23fa9672e', 'photo-1782567531550-22e74704f7e3', 'photo-1768209373252-1819f7cc699a']],

    ['shringaar', 'essentials', 'Shringaar Bridal Wear', 'Karol Bagh', 'Delhi', 4.6, 131, 60000, 'bridal lehenga', ['photo-1600685890506-593fdf55949b', 'photo-1610173827043-9db50e0d8ef9', 'photo-1617627143750-d86bc21e42bb']],
    ['sherwani-house', 'essentials', 'Sherwani House', 'Chandni Chowk', 'Delhi', 4.5, 97, 25000, 'groom set', ['photo-1722952934708-749c22eb2e58', 'photo-1744804298431-57953e4eaba0', 'photo-1722952934661-dde241aeb591']],
    ['pooja-seva', 'essentials', 'Pooja Samagri Seva', 'Sector 31', 'Gurugram', 4.7, 64, 5000, 'full kit', ['photo-1774025108494-3e596e9b9683', 'photo-1774024051976-7b5a15542a05', 'photo-1774024050561-4ee0148c8526']],

    ['turf-arena', 'sports', 'Turf Arena Noida', 'Sector 75', 'Noida', 4.5, 72, 6000, '4 hours', ['photo-1774600551165-547a9cc22264', 'photo-1675693303492-9a5bc898bf94', 'photo-1512719994953-eabf50895df7']],
    ['dwarka-ground', 'sports', 'Dwarka Cricket Ground', 'Dwarka', 'Delhi', 4.4, 58, 15000, 'full day', ['photo-1675693303492-9a5bc898bf94', 'photo-1512719994953-eabf50895df7', 'photo-1774600551165-547a9cc22264']],
    ['teamup', 'sports', 'TeamUp Activities', 'Cyber City', 'Gurugram', 4.6, 40, 25000, '50 people', ['photo-1540575467063-178a50c2df87', 'photo-1768508950790-3bbdfe3973c1', 'photo-1774600551165-547a9cc22264']]
  ];

  const INCLUDES = {
    venues: ['Hall / lawn for one function', 'Basic stage and seating', 'Power backup and parking', 'Bridal room'],
    decor: ['Entrance and stage decor', 'Fresh floral mandap', 'Lighting and drapes', 'Setup and teardown'],
    photo: ['Candid and traditional photography', 'Edited high-resolution photos', 'Highlight film', 'Online gallery'],
    catering: ['Welcome drinks and starters', 'Main course buffet', 'Desserts counter', 'Service staff'],
    entertainment: ['Sound system and console', 'Dance floor lights', 'Performer for the event', 'Setup crew'],
    beauty: ['Trial session', 'HD / airbrush look', 'Hair styling and draping', 'Touch-up kit'],
    planner: ['Partner coordination', 'Event-day run sheet', 'On-site coordinators', 'Guest assistance'],
    invites: ['Design with 2 revisions', 'Printing / digital delivery', 'Name personalisation', 'Packaging'],
    transport: ['Decorated vehicle', 'Chauffeur', 'Fuel included', 'Fixed hours'],
    furniture: ['Delivery and pickup', 'Setup crew', 'Cleaning', 'Damage cover'],
    essentials: ['Fitting session', 'Alterations', 'Accessories', 'Delivery'],
    sports: ['Ground booking', 'Floodlights', 'Equipment', 'Refreshments area']
  };

  const REVIEWERS = [
    ['Ananya K.', 'Everything was exactly as discussed. Team was on time and very polite.'],
    ['Rohit & Megha', 'Clear quote, no hidden charges. Would book again for our next family function.'],
    ['Saurabh G.', 'Good value for money. Coordination over WhatsApp was quick.'],
    ['Priyanka M.', 'Our guests loved it. Minor delay at setup but they made up for it.']
  ];

  // Illustrative launch offers: % off every package of that partner.
  const OFFERS = { 'royal-banquet': 10, 'grand-lawns': 15, 'phoolwari': 15, 'wedding-stories': 20, 'swaad-caterers': 12, 'sufi-nights': 10, 'glam-neha': 10, 'kagaz-invites': 20, 'vintage-wheels': 15, 'shamiana': 10 };

  const PARTNERS = RAW.map(r => {
    const [id, cat, name, area, locality, rating, reviews, base, unit, photos, busy] = r;
    return {
      id, cat, name, area, locality, rating, reviews, base, unit, photos, busy: !!busy,
      verified: true,
      offer: OFFERS[id] || 0,
      responseHrs: 2 + (reviews % 5),
      confirmedAgo: 1 + (reviews % 9),
      packages: [
        { id: 'silver', name: 'Silver', price: base, includes: INCLUDES[cat].slice(0, 2) },
        { id: 'gold', name: 'Gold', price: Math.round(base * 1.4 / 500) * 500, includes: INCLUDES[cat].slice(0, 3) },
        { id: 'platinum', name: 'Platinum', price: Math.round(base * 1.9 / 500) * 500, includes: INCLUDES[cat] }
      ],
      reviewList: [0, 1, 2].map(i => {
        const rv = REVIEWERS[(reviews + i) % REVIEWERS.length];
        return { name: rv[0], text: rv[1], stars: i === 2 ? 4 : 5, verified: true };
      })
    };
  });

  // Illustrative cancellation policy — % of amount paid that is refunded, by days before event.
  const POLICY = {
    venues: [{ minDays: 90, pct: 75 }, { minDays: 30, pct: 50 }, { minDays: 0, pct: 0 }],
    default: [{ minDays: 30, pct: 90 }, { minDays: 7, pct: 50 }, { minDays: 0, pct: 0 }]
  };

  window.SK_DATA = { img, PHOTOS, CATEGORIES, LOCALITIES, EVENT_TYPES, PARTNERS, POLICY };
})();
