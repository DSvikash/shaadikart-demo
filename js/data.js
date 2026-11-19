/* ShaadiKart concept demo — illustrative data only.
   Photos: Unsplash (free licence), bundled in img/. */
(function () {
  const img = id => `img/${id}.jpg`;

  // One place for the brand. Swap the logo by replacing files in img/brand/ (see img/brand/README.md).
  const BRAND = {
    name: 'ShaadiKart',
    parts: ['Shaadi', 'Kart'],                 // two-tone wordmark used when no fullLogo is set
    tagline: 'Plan Everything. Book Everything. Celebrate Everything.',
    mark: 'img/brand/logo-mark.svg',           // icon-only logo (square)
    fullLogo: '',                              // optional full lockup, e.g. 'img/brand/logo-full.svg'
    fullLogoOnDark: ''                         // optional light version of the lockup for purple backgrounds
  };

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
      'Baby Shower': 'photo-1558301211-0d8c8ddee6ec',
      'Kitty Party': 'photo-1513151233558-d860c5398176'
    }
  };

  // 12 categories, per Printout 1 / ShadiKart.jpeg section 2. `tile` = colourful photo for the Start Planning step-2 cards.
  const CATEGORIES = [
    { id: 'venues', tile: 'photo-1587271407850-8d438ca9fdf2', name: 'Venues & Properties', short: 'Venues', icon: 'landmark', img: 'photo-1768851142332-75f3d1b47452',
      subs: ['Marriage & banquet halls', 'Farmhouses & lawns', 'Hotels & resorts', 'Party halls & rooftops', 'Sports grounds', 'Corporate event spaces'] },
    { id: 'decor', tile: 'photo-1587271636175-90d58cdad458', name: 'Decoration & Setup', short: 'Decor', icon: 'flower', img: 'photo-1757589227072-0dd17af42433',
      subs: ['Wedding decorators', 'Mandap & stage', 'Balloon & floral', 'Lighting & theme setup'] },
    { id: 'photo', tile: 'photo-1722952934708-749c22eb2e58', name: 'Photography & Videography', short: 'Photo & Video', icon: 'camera', img: 'photo-1611550287705-7ff8b459c8eb',
      subs: ['Photographers & cinematographers', 'Pre-wedding shoots', 'Drone photography', 'Live streaming', 'Album & video editing'] },
    { id: 'catering', tile: 'photo-1742281257687-092746ad6021', name: 'Food & Catering', short: 'Catering', icon: 'utensils', img: 'photo-1742281257687-092746ad6021',
      subs: ['Catering companies', 'Veg / non-veg menus', 'Live food counters', 'Sweets, bakeries & cakes', 'Beverage counters'] },
    { id: 'entertainment', tile: 'photo-1758810409996-583f3bad7d51', name: 'Entertainment', short: 'DJ & Entertainment', icon: 'music', img: 'photo-1470225620780-dba8ba36b745',
      subs: ['DJ & sound', 'Live singers & bands', 'Dance performers', 'Anchors & hosts', 'Celebrity artists', 'Fireworks (where permitted)'] },
    { id: 'beauty', tile: 'photo-1610173827043-9db50e0d8ef9', name: 'Beauty & Personal Services', short: 'Beauty & Makeup', icon: 'sparkles', img: 'photo-1610173827043-9db50e0d8ef9',
      subs: ['Makeup artists', 'Bridal & groom styling', 'Mehendi artists', 'Hair & salon packages'] },
    { id: 'spiritual', tile: 'photo-1774024051976-7b5a15542a05', name: 'Pandit Ji & Spiritual', short: 'Pandit Ji', icon: 'flame', img: 'photo-1774025108494-3e596e9b9683',
      subs: ['Pandit Ji for wedding rituals', 'Kundli matching', 'Astrology consultation', 'Muhurat & date fixing', 'Griha Shanti & Havan', 'Pooja samagri', 'Mandir weddings'] },
    { id: 'haldi', tile: 'photo-1698460895537-a418b64bcc54', name: 'Haldi & Mehendi', short: 'Haldi & Mehendi', icon: 'flower', img: 'photo-1698460895537-a418b64bcc54',
      subs: ['Haldi ceremony decor', 'Mehendi artists', 'Haldi & mehendi setups', 'Props & outfits'] },
    { id: 'kitty', tile: 'photo-1513151233558-d860c5398176', name: 'Kitty Party Packages', short: 'Kitty Party', icon: 'gift', img: 'photo-1527529482837-4698179dc6ce',
      subs: ['Themed party packages', 'Tambola & games', 'Food & cake', 'Lounge + decor combos'] },
    { id: 'planner', tile: 'photo-1744804298431-57953e4eaba0', name: 'Event Management', short: 'Planner', icon: 'calendarCheck', img: 'photo-1511795409834-ef04bbd61622',
      subs: ['Wedding & corporate planners', 'Birthday & engagement planners', 'Logistics & coordinators'] },
    { id: 'invites', tile: 'photo-1516617442634-75371039cb3a', name: 'Invitations & Gifting', short: 'Invites', icon: 'gift', img: 'photo-1763414902882-4e9d4f8e6275',
      subs: ['Digital & printed invitations', 'Return gifts', 'Custom hampers'] },
    { id: 'transport', tile: 'photo-1777227953254-9f543992f739', name: 'Transportation', short: 'Transport', icon: 'car', img: 'photo-1570907870057-e1e338bc0665',
      subs: ['Luxury & vintage cars', 'Wedding buses', 'Guest transport', 'Airport pickup & drop'] },
    { id: 'furniture', tile: 'photo-1759124650320-d629a3d73d9f', name: 'Furniture & Rental', short: 'Rentals', icon: 'armchair', img: 'photo-1759124650320-d629a3d73d9f',
      subs: ['Chairs, tables & sofas', 'Crockery & cutlery', 'Tents & canopies', 'Generators & equipment'] },
    { id: 'essentials', tile: 'photo-1617627143750-d86bc21e42bb', name: 'Wedding Essentials', short: 'Essentials', icon: 'shirt', img: 'photo-1722952934708-749c22eb2e58',
      subs: ['Bridal & groom wear', 'Jewellery rental', 'Accessories', 'Pooja arrangements'] },
    { id: 'sports', tile: 'photo-1675693303492-9a5bc898bf94', name: 'Sports & Other Events', short: 'Sports', icon: 'trophy', img: 'photo-1675693303492-9a5bc898bf94',
      subs: ['Cricket & turf grounds', 'Sports tournaments', 'Private party venues', 'Team-building activities'] }
  ];

  const LOCALITIES = ['Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad'];
  const EVENT_TYPES = ['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Engagement', 'Baby Shower', 'Kitty Party'];

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
    ['candid-frames', 'photo', 'Candid Frames', 'Golf Course Road', 'Gurugram', 4.7, 159, 45000, 'per day', ['photo-1629756048377-09540f52caa1', 'photo-1519741497674-611481863552', 'photo-1630526720753-aa4e71acf67d']],
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
    ['mehendi-ruksana', 'beauty', 'Mehendi by Ruksana', 'Lajpat Nagar', 'Delhi', 4.7, 142, 6000, 'bride + 10', ['photo-1621801306185-8c0ccf9c8eb8', 'photo-1676134014048-bcc764ea015d', 'photo-1770823218239-996df9afcff0']],
    ['groom-room', 'beauty', 'The Groom Room', 'MG Road', 'Gurugram', 4.5, 49, 8000, 'groom look', ['photo-1722952934708-749c22eb2e58', 'photo-1744804298431-57953e4eaba0', 'photo-1774024051727-499f15bff4c9']],
    ['kesar-salon', 'beauty', 'Kesar Salon Packages', 'Sector 18', 'Noida', 4.4, 67, 12000, 'family pack', ['photo-1617627143750-d86bc21e42bb', 'photo-1600685890506-593fdf55949b', 'photo-1621801306185-8c0ccf9c8eb8']],

    ['haldi-rang', 'haldi', 'Haldi Rang Studio', 'Karol Bagh', 'Delhi', 4.7, 96, 18000, 'per ceremony', ['photo-1698460895537-a418b64bcc54', 'photo-1681717166573-f71589207785', 'photo-1681717075175-19feb7a6f664']],
    ['mehendi-mela', 'haldi', 'Mehendi Mela by Zoya', 'Lajpat Nagar', 'Delhi', 4.8, 154, 9000, 'bride + family', ['photo-1770346279037-89853a3e8c60', 'photo-1621801306185-8c0ccf9c8eb8', 'photo-1770823218239-996df9afcff0']],
    ['peeli-chunri', 'haldi', 'Peeli Chunri Events', 'Sector 18', 'Noida', 4.6, 61, 24000, 'per event', ['photo-1698460918119-7359a8a945a0', 'photo-1698460895537-a418b64bcc54', 'photo-1681717075175-19feb7a6f664']],
    ['henna-house', 'haldi', 'The Henna House', 'Sector 29', 'Gurugram', 4.5, 48, 7500, 'bride + family', ['photo-1676134014048-bcc764ea015d', 'photo-1621801306185-8c0ccf9c8eb8', 'photo-1770346279037-89853a3e8c60']],
    ['kitty-lounge', 'kitty', 'The Kitty Lounge', 'Connaught Place', 'Delhi', 4.7, 83, 18000, 'package', ['photo-1513151233558-d860c5398176', 'photo-1527529482837-4698179dc6ce', 'photo-1653821355736-0c2598d0a63e']],
    ['sakhi-parties', 'kitty', 'Sakhi Party Co.', 'Sector 15', 'Noida', 4.6, 57, 15000, 'package', ['photo-1530103862676-de8c9debad1d', 'photo-1577998474517-7eeeed4e448a', 'photo-1513151233558-d860c5398176']],
    ['bloom-brunch', 'kitty', 'Bloom & Brunch', 'DLF Phase 4', 'Gurugram', 4.8, 72, 22000, 'package', ['photo-1527529482837-4698179dc6ce', 'photo-1558301211-0d8c8ddee6ec', 'photo-1653821355736-0c2598d0a63e']],
    ['tambola-house', 'kitty', 'Tambola House', 'Raj Nagar', 'Ghaziabad', 4.4, 39, 12000, 'package', ['photo-1530103862676-de8c9debad1d', 'photo-1513151233558-d860c5398176', 'photo-1577998474517-7eeeed4e448a']],

    ['pandit-sharma', 'spiritual', 'Pt. Ramesh Sharma · Vedic Vivah', 'Rajouri Garden', 'Delhi', 4.9, 184, 11000, 'per ceremony', ['photo-1774024051976-7b5a15542a05', 'photo-1774024050561-4ee0148c8526', 'photo-1774025108494-3e596e9b9683']],
    ['kundli-kendra', 'spiritual', 'Kundli Milan Kendra', 'Lajpat Nagar', 'Delhi', 4.7, 126, 1100, 'per match', ['photo-1774025108494-3e596e9b9683', 'photo-1774024050561-4ee0148c8526', 'photo-1774024051976-7b5a15542a05']],
    ['jyotish-talk', 'spiritual', 'Jyotish Talk · Astrology Call', 'Online', 'Delhi', 4.6, 212, 501, '30-min call', ['photo-1774024050561-4ee0148c8526', 'photo-1774025108494-3e596e9b9683', 'photo-1774024051976-7b5a15542a05']],
    ['shubh-muhurat', 'spiritual', 'Shubh Muhurat Consultants', 'Sector 15', 'Noida', 4.6, 74, 2100, 'date report', ['photo-1587271636175-90d58cdad458', 'photo-1774024051976-7b5a15542a05', 'photo-1774024050561-4ee0148c8526']],
    ['havan-seva', 'spiritual', 'Griha Shanti & Havan Seva', 'DLF Phase 1', 'Gurugram', 4.7, 88, 5100, 'per havan', ['photo-1774025108494-3e596e9b9683', 'photo-1774024051976-7b5a15542a05', 'photo-1587271636175-90d58cdad458']],

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
    venues: ['Hall / lawn + in-house food', 'Basic stage and seating', 'Power backup and parking', 'Bridal room'],
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
    sports: ['Ground booking', 'Floodlights', 'Equipment', 'Refreshments area'],
    haldi: ['Haldi stage & props', 'Yellow floral decor', 'Setup and teardown', 'Photo corner'], kitty: ['Private lounge for 3 hours', 'Snacks and beverages', 'Tambola & party games', 'Theme decor'],
    spiritual: ['Experienced Vedic pandit', 'Rituals as per your family tradition', 'Samagri checklist', 'Muhurat guidance']
  };

  const REVIEWERS = [
    ['Ananya K.', 'Everything was exactly as discussed. Team was on time and very polite.'],
    ['Rohit & Megha', 'Clear quote, no hidden charges. Would book again for our next family function.'],
    ['Saurabh G.', 'Good value for money. Coordination over WhatsApp was quick.'],
    ['Priyanka M.', 'Our guests loved it. Minor delay at setup but they made up for it.']
  ];

  // Per-plate pricing (illustrative): venues quote hall + in-house food; caterers quote food only. ₹ per guest.
  const PLATE = {
    'royal-banquet': { veg: 1100, nonveg: 1350, cap: [150, 500], kind: 'Banquet hall' },
    'grand-lawns': { veg: 1500, nonveg: 1800, cap: [300, 1200], kind: 'Wedding lawn' },
    'shubh-vivah': { veg: 1300, nonveg: 1600, cap: [200, 800], kind: 'Farmhouse' },
    'neelkamal': { veg: 950, nonveg: 1200, cap: [150, 600], kind: 'Convention hall' },
    'aangan-rooftop': { veg: 1600, nonveg: 1900, cap: [50, 150], kind: 'Rooftop' },
    'swaad-caterers': { veg: 700, nonveg: 900 },
    'annapurna': { veg: 550, nonveg: 750 },
    'live-counter': { veg: 850, nonveg: 1050 }
  };
  const VEG_ONLY = ['mithaas'];
  const r50 = n => Math.round(n / 50) * 50;

  // Illustrative launch offers: % off every package of that partner.
  const OFFERS = { 'royal-banquet': 10, 'grand-lawns': 15, 'phoolwari': 15, 'wedding-stories': 20, 'swaad-caterers': 12, 'sufi-nights': 10, 'glam-neha': 10, 'kagaz-invites': 20, 'vintage-wheels': 15, 'shamiana': 10 };

  // See My Event, Act 1: where things sit in each venue photo (percent of photo width and height).
  // celebrationPhoto: Photorealistic Stage 3 visual showing the venue decorated with guests celebrating, dining and socializing.
  // scenes: Photorealistic 3-scene triplets (Arrival, Dining, Celebration) anchored to the actual venue architecture and guest density.
  // rawGallery & decorGallery: Curated architectural photo sets of actual venue areas before and after decoration.
  const VENUE_ANCHORS = {
    'royal-banquet': {
      id: 'royal-banquet', kind: 'Banquet hall', stageX: 50, stageY: 38,
      tableZone: { x: 12, y: 58, w: 76, h: 30 },
      rooms: [{ name: 'Bridal room', x: 12, y: 30 }, { name: 'Groom room', x: 88, y: 30 }],
      photo: 'photo-1768851142332-75f3d1b47452',
      celebrationPhoto: 'photo-1519689950823-0a2251441815',
      rawGallery: [
        { photo: 'photo-1768851142332-75f3d1b47452', caption: 'Main Marriage Hall', note: 'Central hall with chandeliers & polished granite flooring before decoration.' },
        { photo: 'photo-1526568929-7cdd510e77fd', caption: 'Undecorated Stage & Mandap Platform', note: 'Elevated ceremonial stage ready for custom mandap fabrication.' },
        { photo: 'photo-1542665952-14513db15293', caption: 'Dedicated Dining & Food Area', note: 'Spacious indoor dining section ready for buffet islands and tables.' }
      ],
      decorGallery: [
        { photo: 'photo-1519741497674-611481863552', caption: 'Transformed Entrance Foyer', note: 'Grand floral archway and velvet draping at the main doorway.' },
        { photo: 'photo-1587271636175-90d58cdad458', caption: 'Decorated Mandap & Stage', note: 'Floral mandap with brass pillars, lighting and peach-gold accents.' },
        { photo: 'photo-1511795409834-ef04bbd61622', caption: 'Dressed Dining Tables & Setup', note: 'Banquet round tables with linen, floral centerpieces & cutlery.' }
      ],
      scenes: {
        arrival: { photo: 'photo-1519741497674-611481863552', caption: 'Guests arriving at Royal Banquet reception lobby with welcome drinks and floral entrance' },
        dining: { photo: 'photo-1555244162-803834f70033', caption: 'Guests dining at dressed round banquet tables with royal silver service catering' },
        celebration: { photo: 'photo-1519689950823-0a2251441815', caption: 'Wedding celebration in full swing under chandelier lighting with couple on mandap stage' }
      }
    },
    'grand-lawns': {
      id: 'grand-lawns', kind: 'Open lawn', stageX: 50, stageY: 42,
      tableZone: { x: 8, y: 62, w: 84, h: 28 },
      rooms: [{ name: 'Bridal suite', x: 14, y: 36 }, { name: 'Family rooms', x: 86, y: 36 }],
      photo: 'photo-1783314867628-220ab03cac99',
      celebrationPhoto: 'photo-1469371670807-013ccf25f16a',
      rawGallery: [
        { photo: 'photo-1783314867628-220ab03cac99', caption: 'Expansive Wedding Lawn', note: 'Manicured green lawn with perimeter trees before setup.' },
        { photo: 'photo-1523438885200-e635ba2c371e', caption: 'Open Stage Platform', note: 'Dedicated wide stage base for wedding celebrations.' },
        { photo: 'photo-1768209373252-1819f7cc699a', caption: 'Dining & Catering Enclosure', note: 'Paved side area dedicated to live catering stalls.' }
      ],
      decorGallery: [
        { photo: 'photo-1532712938310-34cb3982ef74', caption: 'Illuminated Entry Archway', note: 'Fairy light tunnel and floral entryway.' },
        { photo: 'photo-1469371670807-013ccf25f16a', caption: 'Canopy Stage Setup', note: 'Floral mandap under a grand star-lit fairy canopy.' },
        { photo: 'photo-1544078751-58fee2d8a03b', caption: 'Dressed Lawn Dining Tables', note: 'Round banquet tables with umbrellas and festive runners.' }
      ],
      scenes: {
        arrival: { photo: 'photo-1532712938310-34cb3982ef74', caption: 'Illuminated walkway and floral archway welcoming guests onto The Grand Lawns' },
        dining: { photo: 'photo-1544078751-58fee2d8a03b', caption: 'Open-air lawn dining setup with live barbecue buffet and seated family tables' },
        celebration: { photo: 'photo-1469371670807-013ccf25f16a', caption: 'Grand outdoor celebration under fairy-light canopy with fireworks and music' }
      }
    },
    'shubh-vivah': {
      id: 'shubh-vivah', kind: 'Farmhouse lawn', stageX: 52, stageY: 40,
      tableZone: { x: 10, y: 60, w: 80, h: 30 },
      rooms: [{ name: 'Bridal room', x: 15, y: 32 }, { name: 'Guest rooms', x: 85, y: 34 }],
      photo: 'photo-1675247488725-22d1b78e75db',
      celebrationPhoto: 'photo-1511795409834-ef04bbd61622',
      rawGallery: [
        { photo: 'photo-1675247488725-22d1b78e75db', caption: 'Farmhouse Courtyard', note: 'Open brick and grass courtyard before decoration.' },
        { photo: 'photo-1757589227072-0dd17af42433', caption: 'Central Mandap Ground', note: 'Traditional circular platform for pheras.' },
        { photo: 'photo-1524824267900-2fa9cbf7a506', caption: 'Rustic Dining Veranda', note: 'Covered veranda area for buffet setup.' }
      ],
      decorGallery: [
        { photo: 'photo-1520854221256-17451cc331bf', caption: 'Marigold Welcome Gate', note: 'Vibrant marigold and jasmine entrance decor.' },
        { photo: 'photo-1511795409834-ef04bbd61622', caption: 'Traditional Mandap Setup', note: 'Draped floral mandap with havan kund seating.' },
        { photo: 'photo-1530103862676-de8c9debad1d', caption: 'Village-Themed Dining Setup', note: 'Festive dining tables with colorful earthen centerpieces.' }
      ],
      scenes: {
        arrival: { photo: 'photo-1520854221256-17451cc331bf', caption: 'Traditional dhol welcome and rose petal shower at Shubh Vivah Farmhouse gate' },
        dining: { photo: 'photo-1530103862676-de8c9debad1d', caption: 'Farmhouse lawn buffet counter with chaat stalls and village-theme dining tables' },
        celebration: { photo: 'photo-1511795409834-ef04bbd61622', caption: 'Vibrant farmhouse celebration with joyous dancing around the illuminated mandap' }
      }
    },
    'neelkamal': {
      id: 'neelkamal', kind: 'Convention hall', stageX: 50, stageY: 36,
      tableZone: { x: 14, y: 56, w: 72, h: 32 },
      rooms: [{ name: 'Green room', x: 14, y: 28 }, { name: 'Bridal room', x: 86, y: 28 }],
      photo: 'photo-1542665952-14513db15293',
      celebrationPhoto: 'photo-1527529482837-4698179dc6ce',
      rawGallery: [
        { photo: 'photo-1542665952-14513db15293', caption: 'Pillarless Convention Hall', note: 'Vast pillarless hall with high acoustic ceilings before decor.' },
        { photo: 'photo-1768851142332-75f3d1b47452', caption: 'Grand Main Stage', note: 'Full-width platform with backstage entry doors.' },
        { photo: 'photo-1779301674216-506de8607c87', caption: 'Adjoining Dining Pavilion', note: 'Adjoining air-conditioned food court and dining room.' }
      ],
      decorGallery: [
        { photo: 'photo-1511578314322-379afb476865', caption: 'Contemporary Foyer Setup', note: 'Digital registration and floral archway in foyer.' },
        { photo: 'photo-1527529482837-4698179dc6ce', caption: 'Royal Stage Transformation', note: 'LED video backdrop with fresh floral canopy.' },
        { photo: 'photo-1517248135467-4c7edcad34c4', caption: 'Dressed Dining Pavilion', note: 'Formal banquet dining layout with silver chafing counters.' }
      ],
      scenes: {
        arrival: { photo: 'photo-1511578314322-379afb476865', caption: 'Grand foyer entrance at Neelkamal Convention with digital escort displays and host desk' },
        dining: { photo: 'photo-1517248135467-4c7edcad34c4', caption: 'High-capacity banquet dining hall with twin central buffet islands and seating' },
        celebration: { photo: 'photo-1527529482837-4698179dc6ce', caption: 'Convention stage celebration with LED video walls, floral backdrop, and guests gathering' }
      }
    },
    'aangan-rooftop': {
      id: 'aangan-rooftop', kind: 'Rooftop terrace', stageX: 48, stageY: 40,
      tableZone: { x: 16, y: 60, w: 68, h: 28 },
      rooms: [{ name: 'Lounge', x: 84, y: 34 }],
      photo: 'photo-1779301674216-506de8607c87',
      celebrationPhoto: 'photo-1768508950719-4d76978fdf44',
      rawGallery: [
        { photo: 'photo-1779301674216-506de8607c87', caption: 'Skyline Terrace Deck', note: 'Polished open terrace with panoramic city views.' },
        { photo: 'photo-1653821355736-0c2598d0a63e', caption: 'Terrace Center Stage Area', note: 'Open focal point for intimate ceremony stage.' },
        { photo: 'photo-1574482211311-45a2169db57c', caption: 'Terrace Bar & Dining Zone', note: 'Perimeter section ready for cocktail and buffet setup.' }
      ],
      decorGallery: [
        { photo: 'photo-1507676184212-d03ab07a01bf', caption: 'Boutique Terrace Entry', note: 'Fairy lights and floral pedestals welcoming guests.' },
        { photo: 'photo-1768508950719-4d76978fdf44', caption: 'Boho Sunset Mandap', note: 'Pampas grass, warm string lights and pastel mandap.' },
        { photo: 'photo-1525610553991-2bede1a236e2', caption: 'Ambient Skyline Dining', note: 'Warm Edison bulb dining tables overlooking the city.' }
      ],
      scenes: {
        arrival: { photo: 'photo-1507676184212-d03ab07a01bf', caption: 'Elevator foyer reception stepping out onto panoramic Saket skyline terrace' },
        dining: { photo: 'photo-1525610553991-2bede1a236e2', caption: 'Boutique terrace dining with cocktail tables, ambient string lights, and skyline views' },
        celebration: { photo: 'photo-1768508950719-4d76978fdf44', caption: 'Intimate sunset celebration with fairy lights, acoustic music, and golden hour vibes' }
      }
    }
  };

  const PARTNERS = RAW.map(r => {
    const [id, cat, name, area, locality, rating, reviews, base, unit, photos, busy] = r;
    return {
      id, cat, name, area, locality, rating, reviews, base, unit, photos, busy: !!busy,
      verified: true,
      offer: OFFERS[id] || 0,
      perPlate: !!PLATE[id], cap: PLATE[id] ? PLATE[id].cap : null, kind: PLATE[id] ? PLATE[id].kind : '',
      vegOnly: VEG_ONLY.includes(id),
      responseHrs: 2 + (reviews % 5),
      confirmedAgo: 1 + (reviews % 9),
      packages: PLATE[id] ? [
        { id: 'silver', name: 'Silver', veg: PLATE[id].veg, nonveg: PLATE[id].nonveg, price: PLATE[id].veg, includes: INCLUDES[cat].slice(0, 2) },
        { id: 'gold', name: 'Gold', veg: r50(PLATE[id].veg * 1.25), nonveg: r50(PLATE[id].nonveg * 1.25), price: r50(PLATE[id].veg * 1.25), includes: INCLUDES[cat].slice(0, 3) },
        { id: 'platinum', name: 'Platinum', veg: r50(PLATE[id].veg * 1.6), nonveg: r50(PLATE[id].nonveg * 1.6), price: r50(PLATE[id].veg * 1.6), includes: INCLUDES[cat] }
      ] : [
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

  // Illustrative artists and portfolios for the partner popup (demo data; names and work are made up).
  const ROLES = {
    venues: ['Event Manager', 'Banquet Chef', 'Décor Coordinator'], decor: ['Lead Designer', 'Floral Artist', 'Lighting Designer'],
    photo: ['Lead Photographer', 'Cinematographer', 'Drone Pilot'], catering: ['Head Chef', 'Live Counter Chef', 'Pastry Chef'],
    entertainment: ['Lead DJ / Singer', 'Sound Engineer', 'Host & Anchor'], beauty: ['Bridal Makeup Artist', 'Hair Stylist', 'Mehendi Artist'],
    spiritual: ['Pandit Ji', 'Assistant Pandit', 'Astrologer'], planner: ['Lead Planner', 'Logistics Lead', 'Guest Coordinator'],
    invites: ['Card Designer', 'Calligrapher', 'Gifting Curator'], transport: ['Chauffeur', 'Fleet Manager', 'Vehicle Decorator'],
    furniture: ['Setup Lead', 'Tent Specialist', 'Decor Stylist'], essentials: ['Stylist', 'Tailor', 'Jewellery Expert'],
    sports: ['Ground Manager', 'Coach', 'Event Host'], haldi: ['Haldi Decor Lead', 'Mehendi Artist', 'Props Stylist'], kitty: ['Party Host', 'Theme Designer', 'Games Coordinator']
  };
  const NAMES = ['Aarav Mehta', 'Isha Kapoor', 'Rohan Bhatia', 'Meera Nair', 'Kabir Malhotra', 'Simran Kaur', 'Vikram Chauhan', 'Ananya Iyer', 'Dev Arora', 'Tara Sethi', 'Nikhil Joshi', 'Pooja Verma', 'Arjun Khanna', 'Riya Bansal', 'Sameer Gupta', 'Neha Saxena', 'Karan Oberoi', 'Sana Qureshi', 'Harsh Vardhan', 'Mitali Das'];
  const PANDITS = ['Pt. Ramesh Sharma', 'Pt. Dinesh Tiwari', 'Acharya Sunita Joshi', 'Pt. Mohan Dubey'];
  const WORK = ['Wedding · New Delhi', 'Engagement · Gurugram', 'Sangeet · Noida', 'Reception · New Delhi', 'Mehendi night · Ghaziabad', 'Haldi · Faridabad'];
  // Verified photo sets (raw / after decoration / with guests) for space and decor partners. Stock photos, illustrative.
  const SET_CATS = ['venues', 'decor', 'haldi', 'kitty'];
  const SET_RAW = ['photo-1768209373252-1819f7cc699a', 'photo-1727931301188-55b23fa9672e', 'photo-1779301674216-506de8607c87', 'photo-1783314867628-220ab03cac99'];
  const SET_DECOR = ['photo-1469371670807-013ccf25f16a', 'photo-1523438885200-e635ba2c371e', 'photo-1529636798458-92182e662485', 'photo-1757589227072-0dd17af42433', 'photo-1524824267900-2fa9cbf7a506', 'photo-1769812343353-ae6ca1250bc2', 'photo-1759124650320-d629a3d73d9f'];
  const SET_PEOPLE = ['photo-1587271636175-90d58cdad458', 'photo-1527529482837-4698179dc6ce', 'photo-1768508950719-4d76978fdf44', 'photo-1768508950790-3bbdfe3973c1', 'photo-1744804298431-57953e4eaba0', 'photo-1758810409996-583f3bad7d51'];
  // Photo library: every image is tagged by what it really shows, so a heading and its photo always agree.
  const LIB = {
    havan: ['photo-1774024051727-499f15bff4c9', 'photo-1774024051976-7b5a15542a05', 'photo-1774025108494-3e596e9b9683'], hall: ['photo-1675247488725-22d1b78e75db', 'photo-1768851142332-75f3d1b47452', 'photo-1783314867628-220ab03cac99', 'photo-1653821355736-0c2598d0a63e'],
    ceremony: ['photo-1587271636175-90d58cdad458', 'photo-1774024051727-499f15bff4c9', 'photo-1774024051976-7b5a15542a05', 'photo-1774024050561-4ee0148c8526', 'photo-1774025108494-3e596e9b9683'], mandap: ['photo-1587271636175-90d58cdad458', 'photo-1587271407850-8d438ca9fdf2', 'photo-1523438885200-e635ba2c371e', 'hero-mandap'], couple: ['photo-1591969851586-adbbd4accf81', 'photo-1630526720753-aa4e71acf67d', 'photo-1757647630063-dd5cd82271f3', 'photo-1629756048377-09540f52caa1', 'photo-1722952934661-dde241aeb591', 'photo-1722952934708-749c22eb2e58'], portrait: ['photo-1722952934661-dde241aeb591', 'photo-1722952934708-749c22eb2e58', 'photo-1630526720753-aa4e71acf67d'], bride: ['photo-1600685890506-593fdf55949b', 'photo-1610173827043-9db50e0d8ef9', 'photo-1617627143750-d86bc21e42bb'], makeup: ['photo-1600685890506-593fdf55949b', 'photo-1610173827043-9db50e0d8ef9', 'photo-1617627143750-d86bc21e42bb'],
    mehendi: ['photo-1621801306185-8c0ccf9c8eb8', 'photo-1676134014048-bcc764ea015d', 'photo-1770346279037-89853a3e8c60', 'photo-1770823218239-996df9afcff0'], haldi: ['photo-1681717075175-19feb7a6f664', 'photo-1681717166573-f71589207785', 'photo-1698460895537-a418b64bcc54', 'photo-1698460918119-7359a8a945a0'], sangeet: ['photo-1758810409996-583f3bad7d51', 'photo-1653821355736-0c2598d0a63e'], reception: ['photo-1527529482837-4698179dc6ce', 'photo-1768508950719-4d76978fdf44', 'photo-1768508950790-3bbdfe3973c1', 'photo-1675247488725-22d1b78e75db', 'photo-1768851142332-75f3d1b47452', 'photo-1783314867628-220ab03cac99'],
    venueIn: ['photo-1524824267900-2fa9cbf7a506', 'photo-1526568929-7cdd510e77fd', 'photo-1542665952-14513db15293', 'photo-1768851142332-75f3d1b47452', 'photo-1779301674216-506de8607c87', 'photo-1783314867628-220ab03cac99', 'photo-1587271407850-8d438ca9fdf2', 'photo-1675247488725-22d1b78e75db'], lawn: ['photo-1768209373252-1819f7cc699a', 'photo-1574482211311-45a2169db57c', 'photo-1469371670807-013ccf25f16a', 'photo-1782567531550-22e74704f7e3', 'photo-1523438885200-e635ba2c371e'], floral: ['photo-1529636798458-92182e662485', 'photo-1757589227072-0dd17af42433', 'photo-1523438885200-e635ba2c371e', 'photo-1469371670807-013ccf25f16a'], aisle: ['photo-1469371670807-013ccf25f16a', 'photo-1757589227072-0dd17af42433'], table: ['photo-1511795409834-ef04bbd61622', 'photo-1759124650320-d629a3d73d9f', 'photo-1769812343353-ae6ca1250bc2'], stage: ['photo-1653821355736-0c2598d0a63e', 'photo-1675247488725-22d1b78e75db', 'photo-1744804298431-57953e4eaba0'],
    food: ['photo-1742281257687-092746ad6021', 'photo-1742281257707-0c7f7e5ca9c6', 'photo-1742281258189-3b933879867a'], buffet: ['photo-1779301674216-506de8607c87'], cake: ['photo-1558301211-0d8c8ddee6ec', 'photo-1577998474517-7eeeed4e448a'], dj: ['photo-1470225620780-dba8ba36b745', 'photo-1544785349-c4a5301826fd', 'photo-1571266028243-d220c6a7edbf', 'photo-1541126274323-dbac58d14741'], concert: ['photo-1533174072545-7a4b6ad7a6c3', 'photo-1540575467063-178a50c2df87'], car: ['photo-1570907870057-e1e338bc0665', 'photo-1777227953254-9f543992f739', 'photo-1507309270028-9121e9937409'], invites: ['photo-1738898179451-b5fc497f9f8e', 'photo-1763414902882-4e9d4f8e6275'], notes: ['photo-1768055105012-4c53791b2877'],
    balloons: ['photo-1530103862676-de8c9debad1d', 'photo-1513151233558-d860c5398176', 'photo-1558301211-0d8c8ddee6ec'], party: ['photo-1768508950790-3bbdfe3973c1', 'photo-1527529482837-4698179dc6ce', 'photo-1758810409996-583f3bad7d51'], shoot: ['photo-1611550287705-7ff8b459c8eb', 'photo-1629756048377-09540f52caa1', 'photo-1519689950823-0a2251441815'], lounge: ['photo-1727931301188-55b23fa9672e'], sports: ['photo-1512719994953-eabf50895df7', 'photo-1675693303492-9a5bc898bf94', 'photo-1774600551165-547a9cc22264'], night: ['photo-1574482211311-45a2169db57c', 'photo-1527529482837-4698179dc6ce']
  };
  const WORKS = {
    photo: [['Wedding coverage', 'ceremony'], ['Pre-wedding shoot', 'couple'], ['Bridal portraits', 'bride'], ['Mehendi shoot', 'mehendi'], ['Haldi shoot', 'haldi'], ['Couple portraits', 'portrait'], ['Reception highlights', 'reception'], ['Behind the lens', 'shoot']],
    venues: [['Grand ballroom', 'venueIn'], ['Wedding lawn', 'lawn'], ['Reception hall', 'hall'], ['Mandap setup', 'mandap'], ['Dining hall', 'venueIn'], ['Evening function', 'night']],
    decor: [['Floral mandap', 'mandap'], ['Aisle decor', 'aisle'], ['Table styling', 'table'], ['Sangeet stage', 'stage'], ['Floral arch', 'floral'], ['Lawn setup', 'lawn']],
    catering: [['Thali and main course', 'food'], ['Wedding buffet', 'buffet'], ['Dinner tables', 'table'], ['Dessert and cake', 'cake'], ['Live counters', 'buffet']],
    entertainment: [['DJ night', 'dj'], ['Sangeet dance floor', 'sangeet'], ['Live concert feel', 'concert'], ['Reception party', 'party']],
    beauty: [['Bridal makeup', 'makeup'], ['Bridal look', 'bride'], ['Mehendi for the bride', 'mehendi'], ['Hair and styling', 'bride'], ['Engagement look', 'portrait']],
    spiritual: [['Vivah ceremony', 'ceremony'], ['Havan and pooja', 'havan'], ['Mandap rituals', 'mandap'], ['Wedding rituals', 'ceremony']],
    planner: [['Full wedding planning', 'mandap'], ['Run-of-show', 'notes'], ['Guest welcome', 'reception'], ['Event setup', 'floral']],
    invites: [['Wedding invitations', 'invites'], ['Hand-written details', 'notes'], ['Save-the-date cards', 'invites']],
    transport: [['Vintage bridal car', 'car'], ['Baraat car', 'car'], ['Decorated convertible', 'car']],
    furniture: [['Lawn seating', 'lawn'], ['Lounge setup', 'lounge'], ['Mandap and stage', 'mandap']],
    essentials: [['Bridal styling', 'bride'], ['Groom sherwani and turban', 'portrait'], ['Bangles and jewellery', 'mehendi']],
    sports: [['Cricket ground', 'sports'], ['Floodlit match', 'sports'], ['Sports day', 'sports']],
    haldi: [['Haldi ceremony', 'haldi'], ['Haldi decor', 'haldi'], ['Mehendi evening', 'mehendi'], ['Mehendi art', 'mehendi'], ['Haldi and mehendi combo', 'haldi']],
    kitty: [['Birthday kitty', 'balloons'], ['Party lounge', 'party'], ['Cake and celebration', 'cake']]
  };
  // Past-work titles and the photo kind that really shows them.
  const TITLE_KEY = { 'Wedding coverage': 'ceremony', 'Pre-wedding shoot': 'couple', 'Reception highlights': 'reception', 'Wedding · full property': 'venueIn', 'Engagement dinner': 'hall', 'Family milestone': 'venueIn', 'Floral mandap': 'mandap', 'Sangeet stage': 'stage', 'Entrance and aisle': 'aisle', 'Wedding buffet': 'buffet', 'Engagement lunch': 'food', 'Sangeet dinner': 'table', 'Sangeet night': 'sangeet', 'Reception': 'party', 'Cocktail evening': 'party', 'Bridal makeup': 'makeup', 'Mehendi for bride and family': 'mehendi', 'Engagement look': 'portrait', 'Vivah ceremony': 'ceremony', 'Griha pravesh pooja': 'havan', 'Kundli matching': 'notes', 'Haldi ceremony': 'haldi', 'Mehendi evening': 'mehendi', 'Haldi + mehendi combo': 'haldi', 'Birthday kitty': 'balloons', 'Monthly kitty club': 'party', 'Festive kitty': 'cake',
    'Destination wedding planning': 'mandap', 'Sangeet and reception': 'stage', 'Engagement ceremony': 'reception', 'Wedding invitation suite': 'invites', 'Save-the-date cards': 'invites', 'Hand-written details': 'notes', 'Bridal car': 'car', 'Baraat car': 'car', 'Guest shuttles': 'car', 'Wedding lawn seating': 'lawn', 'Lounge setup': 'lounge', 'Mandap and stage': 'mandap', 'Bridal outfit styling': 'bride', 'Groom sherwani': 'portrait', 'Bangles and jewellery': 'mehendi', 'Corporate cricket match': 'sports', 'Weekend tournament': 'sports', 'Sports day': 'sports' };
  const hashOf = str => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  PARTNERS.forEach(p => {
    const h = hashOf(p.id), cat = CATEGORIES.find(c => c.id === p.cat), roles = ROLES[p.cat] || ['Lead', 'Associate', 'Coordinator'];
    const pool = [...new Set([...p.photos, cat.img, cat.tile].filter(Boolean))];
    p.artists = [0, 1, 2].map(i => {
      const tpl = WORKS[p.cat] || WORKS.venues, PLACES = ['New Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad'];
      const works = Array.from({ length: Math.min(6, tpl.length) }, (_, j) => { const [title, key] = tpl[(h + i * 2 + j) % tpl.length]; const arr = LIB[key]; return { img: arr[(h + i + j) % arr.length], caption: `${title} · ${PLACES[(h + i + j) % PLACES.length]}` }; });
      const name = p.cat === 'spiritual' ? PANDITS[(h + i) % PANDITS.length] : NAMES[(h + i * 7) % NAMES.length];
      return { name, role: roles[i], years: 4 + ((h >> i) % 11), rating: Math.min(4.9, 4.5 + ((h >> (i + 2)) % 5) / 10).toFixed(1), photo: works[0].img, works };
    });
  });

  // Tiers, menus, rooms and work history (illustrative demo data).
  const TIERS = ['Standard', 'Premium', 'Premium Plus'];
  const MENU = {
    silver: { 'Welcome drinks': ['Jaljeera', 'Lemon mint cooler'], Starters: ['Paneer tikka', 'Veg spring rolls', 'Hara bhara kebab'], 'Main course': ['Dal makhani', 'Shahi paneer', 'Seasonal vegetable', 'Jeera rice'], Breads: ['Butter naan', 'Tawa roti'], Desserts: ['Gulab jamun', 'Vanilla ice cream'] },
    gold: { 'Welcome drinks': ['Jaljeera', 'Lemon mint cooler', 'Fresh fruit punch'], Starters: ['Paneer tikka', 'Veg seekh kebab', 'Crispy corn', 'Dahi ke kebab', 'Veg spring rolls'], 'Main course': ['Dal makhani', 'Shahi paneer', 'Kadhai paneer', 'Malai kofta', 'Veg biryani', 'Jeera rice'], Breads: ['Butter naan', 'Lachha paratha', 'Tawa roti', 'Stuffed kulcha'], Desserts: ['Gulab jamun', 'Rasmalai', 'Jalebi with rabri', 'Ice cream'], 'Live counters': ['Chaat counter', 'Pasta counter'] },
    platinum: { 'Welcome drinks': ['Virgin mojito', 'Blue lagoon', 'Fresh fruit punch', 'Masala chaas'], Starters: ['Paneer tikka', 'Veg galouti kebab', 'Crispy corn', 'Dahi ke kebab', 'Mushroom duplex', 'Veg spring rolls', 'Cheese balls'], 'Main course': ['Dal bukhara', 'Paneer lababdar', 'Kadhai paneer', 'Malai kofta', 'Exotic vegetables', 'Hyderabadi veg biryani', 'Peas pulao', 'Jeera rice'], Breads: ['Butter naan', 'Lachha paratha', 'Tawa roti', 'Stuffed kulcha', 'Missi roti', 'Garlic naan'], Desserts: ['Gulab jamun', 'Rasmalai', 'Live jalebi with rabri', 'Kulfi falooda', 'Moong dal halwa', 'Ice cream'], 'Live counters': ['Chaat counter', 'Dosa station', 'Pasta station', 'Live tandoor', 'Chinese station', 'Dessert bar'] }
  };
  const MENU_NV = { silver: { Starters: ['Chicken tikka'], 'Main course': ['Butter chicken'] }, gold: { Starters: ['Chicken tikka', 'Fish amritsari'], 'Main course': ['Butter chicken', 'Mutton rogan josh', 'Chicken biryani'] }, platinum: { Starters: ['Chicken tikka', 'Fish amritsari', 'Tandoori prawns', 'Lamb chops'], 'Main course': ['Butter chicken', 'Mutton rogan josh', 'Chicken biryani', 'Mutton biryani', 'Fish curry'] } };
  const SWEET_MENU = {
    silver: { 'Mithai boxes': ['Kaju katli', 'Motichoor ladoo', 'Rasgulla', 'Besan barfi'], Cakes: ['1 kg designer cake'] },
    gold: { 'Mithai boxes': ['Kaju katli', 'Motichoor ladoo', 'Rasgulla', 'Besan barfi', 'Soan papdi', 'Pista roll'], Cakes: ['2 kg designer cake', 'Cupcake box'], 'Chaat & namkeen': ['Dahi bhalla', 'Papdi chaat'] },
    platinum: { 'Mithai boxes': ['Kaju katli', 'Motichoor ladoo', 'Rasgulla', 'Besan barfi', 'Soan papdi', 'Pista roll', 'Anjeer barfi', 'Sandesh'], Cakes: ['3 kg tiered cake', 'Cupcake box', 'Cake pops'], 'Live counters': ['Live jalebi', 'Rabri falooda', 'Hot chocolate fondue'] }
  };
  const ROOMS = {
    'royal-banquet': { total: 36, comp: 4, types: [['Deluxe AC', 24, 4500, 2], ['Family suite', 8, 8500, 4], ['Bridal suite', 4, 12000, 2]] },
    'grand-lawns': { total: 20, comp: 2, types: [['Deluxe AC', 14, 5000, 2], ['Garden cottage', 6, 9000, 4]] },
    'shubh-vivah': { total: 12, comp: 2, types: [['Farm cottage', 12, 6500, 3]] },
    'neelkamal': { total: 30, comp: 3, types: [['Standard AC', 20, 3500, 2], ['Deluxe AC', 10, 5000, 2]] }
  };
  const HIST = {
    photo: [['Wedding coverage', '2 photographers, 1 cinematographer · 1,100 photos · delivered in 21 days'], ['Pre-wedding shoot', 'Half-day outdoor shoot · 150 edited photos · teaser film'], ['Reception highlights', 'Cinematic highlight film (4 min) · same-day sneak peek']],
    venues: [['Wedding · full property', '3 functions in 2 days · mandap, stage, dining hall and rooms'], ['Engagement dinner', 'Evening function · themed seating · live counters'], ['Family milestone', 'Banquet hall and lawn · AV setup · valet parking']],
    decor: [['Floral mandap', 'Rose and marigold mandap · pastel drapes · 200 guests'], ['Sangeet stage', 'LED backdrop · fairy-light canopy · dance floor'], ['Entrance and aisle', 'Floral gate · lantern aisle · welcome counter']],
    catering: [['Wedding buffet', '6 live counters · veg and non-veg · 450 guests'], ['Engagement lunch', 'Premium veg menu · 150 guests · chaat and dosa counters'], ['Sangeet dinner', 'Fusion menu · mocktail bar · dessert station']],
    entertainment: [['Sangeet night', '4-hour set · live dhol · dance floor lights'], ['Reception', 'Bollywood and retro mix · sound for 400 guests'], ['Cocktail evening', 'Lounge playlist · MC hosting']],
    beauty: [['Bridal makeup', 'HD airbrush look · hair styling · trial included'], ['Mehendi for bride and family', 'Intricate bridal design · 12 family members'], ['Engagement look', 'Soft glam · hair styling · saree draping']],
    spiritual: [['Vivah ceremony', 'Full Vedic rituals as per family tradition · muhurat guidance'], ['Griha pravesh pooja', 'Havan, kalash sthapana, samagri list shared'], ['Kundli matching', 'Detailed guna milan report · call with both families']],
    haldi: [['Haldi ceremony', 'Marigold canopy · yellow props · photo corner · 80 guests'], ['Mehendi evening', 'Live mehendi artists · seating lounge · 10 designs'], ['Haldi + mehendi combo', 'Two functions · shared decor · refreshments']],
    planner: [['Destination wedding planning', 'Venue, vendors and guest logistics · 3 days'], ['Sangeet and reception', 'Run-of-show and vendor coordination'], ['Engagement ceremony', 'Full planning · 120 guests']],
    invites: [['Wedding invitation suite', 'Letterpress cards · envelope liners · RSVP'], ['Save-the-date cards', 'Minimal foil design'], ['Hand-written details', 'Calligraphy on cards and place cards']],
    transport: [['Bridal car', 'Vintage car with floral decor and chauffeur'], ['Baraat car', 'Decorated convertible for the groom'], ['Guest shuttles', 'Coordinated pick-up and drop for families']],
    furniture: [['Wedding lawn seating', 'Chairs and tents for 300 guests'], ['Lounge setup', 'Sofas and coffee tables for the reception'], ['Mandap and stage', 'Platform, drapes and seating']],
    essentials: [['Bridal outfit styling', 'Lehenga, jewellery and dupatta draping'], ['Groom sherwani', 'Sherwani and turban styling'], ['Bangles and jewellery', 'Chuda, bangles and accessories']],
    sports: [['Corporate cricket match', 'Ground booking, umpires and refreshments'], ['Weekend tournament', 'Floodlit ground · 8 teams'], ['Sports day', 'Event host and equipment']],
    kitty: [['Birthday kitty', '12 guests · theme decor · tambola · cake'], ['Monthly kitty club', 'Rotating hostess · private lounge · snacks and mocktails'], ['Festive kitty', '20 guests · games host · return gifts']]
  };
  const GENERIC_HIST = [['Wedding', 'Full-service delivery · on time · family praised the coordination'], ['Engagement', 'Smooth setup and teardown'], ['Family function', 'Repeat customer booking']];
  const QUOTES = ['Everything was seamless.', 'Exactly as promised.', 'Our guests are still talking about it.'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const FAMS = ['Mehta–Kapoor', 'Sharma–Verma', 'Bhatia–Nair', 'Malhotra–Iyer', 'Khanna–Sethi', 'Gupta–Arora', 'Joshi–Bansal', 'Chauhan–Saxena'];
  PARTNERS.forEach(p => {
    const h = hashOf(p.id), pool = [...new Set([...p.photos, CATEGORIES.find(c => c.id === p.cat).img])];
    if (p.perPlate || p.id === 'mithaas') p.packages.forEach((k, i) => { k.name = TIERS[i]; });
    if (p.perPlate) { p.menu = MENU; p.menuNV = MENU_NV; } else if (p.id === 'mithaas') { p.menu = SWEET_MENU; }
    if (p.cat === 'kitty') {
      const nm = ['Classic · up to 15 guests', 'Fun · up to 25 guests', 'Grand · up to 40 guests'];
      const inc = [['Private lounge for 3 hours', 'Snacks and 2 beverages', 'Tambola and 1 game'], ['Everything in Classic', 'Theme decor and cake', 'Games host and music'], ['Everything in Fun', 'DJ and photographer (1 hour)', 'Return gifts and a live counter']];
      p.packages.forEach((k, i) => { k.name = nm[i]; k.includes = inc[i]; });
    }
    if (SET_CATS.includes(p.cat)) {
      const pick = (arr, n) => [0, 1, 2].map(i => arr[(h + i + n) % arr.length]);
      const va = VENUE_ANCHORS[p.id];
      if (va && va.rawGallery) {
        p.sets = [
          { key: 'raw', label: '1. Raw (Original Space)', title: 'Original Property Condition', note: 'Authentic architectural photographs of the venue spaces before any wedding decoration.', photos: va.rawGallery.map(x => x.photo), captions: va.rawGallery.map(x => x.caption), details: va.rawGallery.map(x => x.note) },
          { key: 'decor', label: '2. After Decoration (Dressed For You)', title: 'Wedding Transformation Preview', note: 'The exact same venue spaces transformed with mandap, ambient lighting and banquet dining setup.', photos: va.decorGallery.map(x => x.photo), captions: va.decorGallery.map(x => x.caption), details: va.decorGallery.map(x => x.note) },
          { key: 'people', label: '3. With Guests (Realistic Celebration)', title: 'Realistic Wedding Celebration', note: 'The decorated property populated with natural Indian wedding guest distribution across zones.', photos: [va.scenes.arrival.photo, va.scenes.dining.photo, va.scenes.celebration.photo], captions: ['Arrival & Welcome Foyer', 'Banquet Dining & Buffet Area', 'Mandap Ceremony & Celebration Stage'], details: [va.scenes.arrival.caption, va.scenes.dining.caption, va.scenes.celebration.caption] }
        ];
      } else {
        p.sets = [
          { key: 'raw', label: '1. Raw (Original Space)', title: 'Original Property Condition', note: 'The space as it is before any decoration.', photos: pick(SET_RAW, 0) },
          { key: 'decor', label: '2. After Decoration (Dressed For You)', title: 'Wedding Transformation Preview', note: 'The same kind of setup once decor is complete.', photos: pick(p.cat === 'haldi' ? [LIB.haldi[2], LIB.haldi[3], LIB.haldi[0]] : p.cat === 'kitty' ? [LIB.balloons[0], LIB.cake[0], LIB.balloons[1]] : SET_DECOR, 1) },
          { key: 'people', label: '3. With Guests (Realistic Celebration)', title: 'Realistic Wedding Celebration', note: 'The setup during a real event with guests gathered.', photos: pick(p.cat === 'haldi' ? [LIB.haldi[1], LIB.haldi[0], LIB.haldi[2]] : p.cat === 'kitty' ? LIB.party : SET_PEOPLE, 2) }
        ];
      }
      p.setsVerified = MONTHS[(h + 5) % MONTHS.length] + ' 2026';
    }
    if (ROOMS[p.id]) p.rooms = { ...ROOMS[p.id], checkin: '12 pm', checkout: '11 am', amenities: ['Air conditioning', 'Wi-Fi', 'Breakfast included', 'Lift', 'Power backup'] };
    p.history = (HIST[p.cat] || GENERIC_HIST).map(([title, note], i) => ({ title, note, date: MONTHS[(h + i * 3) % MONTHS.length] + ' 2026', place: p.area, client: FAMS[(h + i) % FAMS.length] + ' family', img: (() => { const arr = LIB[TITLE_KEY[title] || 'mandap']; return arr[(h + i) % arr.length]; })(), quote: QUOTES[(h + i) % QUOTES.length] }));
  });

  // Illustrative cancellation policy — % of amount paid that is refunded, by days before event.
  const POLICY = {
    venues: [{ minDays: 90, pct: 75 }, { minDays: 30, pct: 50 }, { minDays: 0, pct: 0 }],
    default: [{ minDays: 30, pct: 90 }, { minDays: 7, pct: 50 }, { minDays: 0, pct: 0 }]
  };

  // Real Arya Samaj Mandirs (public info only, not ShaadiKart partners). Research: 03_Research/Arya_Samaj_Mandirs_DelhiNCR_2026-11-10.md
  const MANDIR_CHECKED = '10 Nov 2026';
  const MANDIR_COST = { range: '₹5,000 – ₹15,000', note: 'Typical Arya Samaj wedding fee: ceremony, priest and mandir certificate. Food, decor, photography and dakshina are extra. Varies by temple.',
    sources: [['itzeazy (Feb 2026)', 'https://itzeazy.in/blog/2026/02/09/arya-samaj-marriage-fees/'], ['Weddingz (2018)', 'https://weddingz.in/blog/arya-samaj-mandir-in-mumbai-delhi-arya-samaj-marriage-fees/']] };
  const MANDIRS = [
    { name: 'Arya Samaj Mandir, Hanuman Road', area: 'Connaught Place', address: '15, Hanuman Road, Connaught Place, New Delhi 110001', weddings: 'yes',
      facts: ['Lawn up to 200 guests · hall up to 100', 'Booking amount listed: ₹10,000', 'Vegetarian only · outside caterers allowed · havan allowed'],
      sources: [['Weddingz venue listing', 'https://weddingz.in/delhi/arya-samaj-mandir-connaught-place/']] },
    { name: 'Arya Samaj Mandir, Janakpuri', area: 'Janakpuri', address: '24, Arya Samaj Road, Janakpuri, Delhi 110058', weddings: 'yes',
      facts: ['Listed for Arya Samaj marriages'], sources: [['Weddingz (2018)', 'https://weddingz.in/blog/arya-samaj-mandir-in-mumbai-delhi-arya-samaj-marriage-fees/']] },
    { name: 'Arya Samaj Mandir, Civil Lines', area: 'North Delhi', address: 'Mall Road, Khyber Pass, near Vidhan Sabha Metro, Civil Lines, Delhi 110054', weddings: 'yes',
      facts: ['Listed for Arya Samaj marriages'], sources: [['Weddingz (2018)', 'https://weddingz.in/blog/arya-samaj-mandir-in-mumbai-delhi-arya-samaj-marriage-fees/']] },
    { name: 'Arya Samaj Mandir, Ashok Vihar', area: 'Ashok Vihar', address: 'Shakti Nagar Extension, Ashok Vihar Phase-3, New Delhi', weddings: 'ask',
      facts: ['Registered with Delhi Arya Pratinidhi Sabha'], sources: [['Bhakti Bharat', 'https://www.bhaktibharat.com/en/mandir/arya-samaj-mandir-ashok-vihar']] },
    { name: 'Arya Samaj Mandir, Punjabi Bagh', area: 'Punjabi Bagh', address: 'Road No. 18, Punjabi Bagh Extension, New Delhi 110026', weddings: 'ask',
      facts: ['Temple office 11 am – 7 pm'], sources: [['Bhakti Bharat', 'https://www.bhaktibharat.com/en/mandir/arya-samaj-mandir-punjabi-bagh']] },
    { name: 'Arya Samaj Mandir, Mayur Vihar Phase 1', area: 'Mayur Vihar', address: 'Satyam Palace, Khudi Ram Bose Marg, Mayur Vihar Phase 1, New Delhi', weddings: 'ask',
      facts: ['Open 5 am – 9 pm'], sources: [['Bhakti Bharat', 'https://www.bhaktibharat.com/amp/en/mandir/arya-samaj-mandir-mayur-vihar']] }
  ];

  // See My Event, Act 2: how each decor partner dresses a space. overlayPhoto is the partner's own work.
  const DECOR_PROFILES = {
    'phoolwari': { id: 'phoolwari', partnerId: 'phoolwari', palette: ['#e8638c', '#f7c548', '#fff6dc'], elements: ['mandap', 'floral arch', 'aisle florals', 'drapes', 'lighting glow'], overlayPhoto: 'photo-1757589227072-0dd17af42433' },
    'mandap-magic': { id: 'mandap-magic', partnerId: 'mandap-magic', palette: ['#c0392b', '#eea73a', '#fff1d6'], elements: ['mandap', 'floral arch', 'aisle florals', 'drapes', 'lighting glow'], overlayPhoto: 'photo-1587271636175-90d58cdad458' },
    'gulmohar-decor': { id: 'gulmohar-decor', partnerId: 'gulmohar-decor', palette: ['#e4572e', '#76b041', '#fff4e0'], elements: ['mandap', 'floral arch', 'aisle florals', 'drapes', 'lighting glow'], overlayPhoto: 'photo-1769812343353-ae6ca1250bc2' },
    'rangoli-theme': { id: 'rangoli-theme', partnerId: 'rangoli-theme', palette: ['#4a22b0', '#f7c548', '#f4eefc'], elements: ['mandap', 'floral arch', 'aisle florals', 'drapes', 'lighting glow'], overlayPhoto: 'photo-1530103862676-de8c9debad1d' }
  };

  // Business Portal: Temporary background image until reference photograph is uploaded.
  const BUSINESS_LOGIN_BG = 'photo-1519741497674-611481863552';

  // Business Photo Management: Seed 50 photos for Royal Banquet (30 Published, 10 Draft, 10 Archived)
  const SEED_ROYAL_PHOTOS = [
    // 16 RAW Photos: 10 Published, 3 Draft, 3 Archived
    { id: 'rb-raw-1', url: 'photo-1768851142332-75f3d1b47452', category: 'raw', status: 'published', title: 'Grand Marriage Hall Interior', caption: 'Polished granite flooring, high ceiling, central chandelier.', uploadedAt: '02 Nov 2026', size: '3.4 MB' },
    { id: 'rb-raw-2', url: 'photo-1526568929-7cdd510e77fd', category: 'raw', status: 'published', title: 'Ceremonial Stage Platform', caption: 'Bare raised stage platform ready for custom mandap fabrication.', uploadedAt: '02 Nov 2026', size: '2.8 MB' },
    { id: 'rb-raw-3', url: 'photo-1542665952-14513db15293', category: 'raw', status: 'published', title: 'Dedicated Banquet Dining Wing', caption: 'Spacious food service area ready for twin buffet islands.', uploadedAt: '03 Nov 2026', size: '3.1 MB' },
    { id: 'rb-raw-4', url: 'photo-1524824267900-2fa9cbf7a506', category: 'raw', status: 'published', title: 'North Corridor & Walkway', caption: 'Covered guest arrival corridor with glass frontage.', uploadedAt: '03 Nov 2026', size: '2.4 MB' },
    { id: 'rb-raw-5', url: 'photo-1779301674216-506de8607c87', category: 'raw', status: 'published', title: 'Main Foyer & Reception Lobby', caption: 'High ceiling marble foyer with guest registration desk.', uploadedAt: '04 Nov 2026', size: '2.9 MB' },
    { id: 'rb-raw-6', url: 'photo-1768209373252-1819f7cc699a', category: 'raw', status: 'published', title: 'Outdoor Spillover Lawn Entry', caption: 'Paved courtyard connecting main hall to lawn section.', uploadedAt: '04 Nov 2026', size: '3.5 MB' },
    { id: 'rb-raw-7', url: 'photo-1727931301188-55b23fa9672e', category: 'raw', status: 'published', title: 'VIP Lounge Pre-function Area', caption: 'Private air-conditioned lounge for intimate family gatherings.', uploadedAt: '05 Nov 2026', size: '2.7 MB' },
    { id: 'rb-raw-8', url: 'photo-1783314867628-220ab03cac99', category: 'raw', status: 'published', title: 'East Wing Dining Space', caption: 'Secondary seating hall for dessert counters and tea lounge.', uploadedAt: '05 Nov 2026', size: '3.2 MB' },
    { id: 'rb-raw-9', url: 'photo-1675247488725-22d1b78e75db', category: 'raw', status: 'published', title: 'Central Courtyard Pillars', caption: 'Architectural arches and carved sandstone pillars.', uploadedAt: '06 Nov 2026', size: '2.6 MB' },
    { id: 'rb-raw-10', url: 'photo-1653821355736-0c2598d0a63e', category: 'raw', status: 'published', title: 'Backstage Dressing Room Access', caption: 'Secure green room corridor with dedicated air conditioning.', uploadedAt: '06 Nov 2026', size: '2.1 MB' },
    { id: 'rb-raw-11', url: 'photo-1523438885200-e635ba2c371e', category: 'raw', status: 'draft', title: 'Service Entry & Kitchen Dock', caption: 'Dedicated service freight entrance for live catering crew.', uploadedAt: '07 Nov 2026', size: '2.9 MB' },
    { id: 'rb-raw-12', url: 'photo-1574482211311-45a2169db57c', category: 'raw', status: 'draft', title: 'Perimeter Wall Lighting Conduit', caption: 'Architectural electrical points for ambient uplighting.', uploadedAt: '07 Nov 2026', size: '2.3 MB' },
    { id: 'rb-raw-13', url: 'photo-1512719994953-eabf50895df7', category: 'raw', status: 'draft', title: 'Valet Parking Drop Zone', caption: 'Covered porch and 200-car valet staging area.', uploadedAt: '08 Nov 2026', size: '3.8 MB' },
    { id: 'rb-raw-14', url: 'photo-1782567531550-22e74704f7e3', category: 'raw', status: 'archived', title: 'Generator Backup Compound', caption: 'Acoustic silent generator bay (250 kVA redundancy).', uploadedAt: '01 Oct 2026', size: '2.2 MB' },
    { id: 'rb-raw-15', url: 'photo-1675693303492-9a5bc898bf94', category: 'raw', status: 'archived', title: 'Basement Storage Facility', caption: 'Vendor loading dock and decor staging basement.', uploadedAt: '01 Oct 2026', size: '3.0 MB' },
    { id: 'rb-raw-16', url: 'photo-1774600551165-547a9cc22264', category: 'raw', status: 'archived', title: 'Rear Garden Service Path', caption: 'Exterior pathway for waste management and sanitation.', uploadedAt: '01 Oct 2026', size: '2.5 MB' },

    // 18 DECOR Photos: 11 Published, 4 Draft, 3 Archived
    { id: 'rb-dec-1', url: 'photo-1519741497674-611481863552', category: 'decor', status: 'published', title: 'Floral Arch Entrance Foyer', caption: 'Grand entryway with white orchid and peach drape styling.', uploadedAt: '02 Nov 2026', size: '4.2 MB' },
    { id: 'rb-dec-2', url: 'photo-1587271636175-90d58cdad458', category: 'decor', status: 'published', title: 'Royal Mandap Stage Setup', caption: 'Carved brass pillars with fresh tuberose and marigold canopy.', uploadedAt: '02 Nov 2026', size: '4.8 MB' },
    { id: 'rb-dec-3', url: 'photo-1511795409834-ef04bbd61622', category: 'decor', status: 'published', title: 'Dressed Banquet Dining Tables', caption: 'Gold chiavari chairs, satin runners, and brass candelabras.', uploadedAt: '03 Nov 2026', size: '3.9 MB' },
    { id: 'rb-dec-4', url: 'photo-1469371670807-013ccf25f16a', category: 'decor', status: 'published', title: 'Canopy Stage with Fairy Lights', caption: 'Thousands of micro-LED fairy lights illuminating the aisle.', uploadedAt: '03 Nov 2026', size: '4.5 MB' },
    { id: 'rb-dec-5', url: 'photo-1523438885200-e635ba2c371e', category: 'decor', status: 'published', title: 'Central Mandap Havan Kund', caption: 'Traditional havan square with silk gaddi and flower borders.', uploadedAt: '04 Nov 2026', size: '3.6 MB' },
    { id: 'rb-dec-6', url: 'photo-1529636798458-92182e662485', category: 'decor', status: 'published', title: 'Welcome Lobby Floral Urns', caption: 'Brass urlis with floating lotus flowers and scented candles.', uploadedAt: '04 Nov 2026', size: '3.1 MB' },
    { id: 'rb-dec-7', url: 'photo-1757589227072-0dd17af42433', category: 'decor', status: 'published', title: 'Marigold Aisle Floral Walkway', caption: 'Yellow and saffron marigold borders lining the central bride walk.', uploadedAt: '05 Nov 2026', size: '3.7 MB' },
    { id: 'rb-dec-8', url: 'photo-1544078751-58fee2d8a03b', category: 'decor', status: 'published', title: 'Lawn Buffet Umbrella Tables', caption: 'Cocktail tables with festive parasols and garden florals.', uploadedAt: '05 Nov 2026', size: '3.3 MB' },
    { id: 'rb-dec-9', url: 'photo-1532712938310-34cb3982ef74', category: 'decor', status: 'published', title: 'Illuminated Tunnel Gate', caption: 'Full tunnel arch with crystal drops and warm tungsten glow.', uploadedAt: '06 Nov 2026', size: '4.6 MB' },
    { id: 'rb-dec-10', url: 'photo-1769812343353-ae6ca1250bc2', category: 'decor', status: 'published', title: 'Pastel Draped Mandap Backdrop', caption: 'Blush pink and ivory velvet drape cascade behind couple stage.', uploadedAt: '06 Nov 2026', size: '3.5 MB' },
    { id: 'rb-dec-11', url: 'photo-1759124650320-d629a3d73d9f', category: 'decor', status: 'published', title: 'Sweet Counter Floral Framing', caption: 'Live jalebi and mithai station framed with fresh jasmine.', uploadedAt: '07 Nov 2026', size: '3.0 MB' },
    { id: 'rb-dec-12', url: 'photo-1530103862676-de8c9debad1d', category: 'decor', status: 'draft', title: 'Village Theme Earthen Pot Decor', caption: 'Terracotta lamps and hand-painted matkis for rustic wedding.', uploadedAt: '08 Nov 2026', size: '2.8 MB' },
    { id: 'rb-dec-13', url: 'photo-1520854221256-17451cc331bf', category: 'decor', status: 'draft', title: 'Rose Petal Welcome Carpet', caption: 'Deep red velvet runner layered with fresh red rose petals.', uploadedAt: '08 Nov 2026', size: '3.4 MB' },
    { id: 'rb-dec-14', url: 'photo-1511578314322-379afb476865', category: 'decor', status: 'draft', title: 'Modern Geometric Arch', caption: 'Contemporary metallic polygon arch for engagement ceremonies.', uploadedAt: '09 Nov 2026', size: '3.2 MB' },
    { id: 'rb-dec-15', url: 'photo-1527529482837-4698179dc6ce', category: 'decor', status: 'draft', title: 'LED Wall Visual Stage Backdrop', caption: 'Dynamic visual graphics screen for sangeet and reception.', uploadedAt: '09 Nov 2026', size: '4.1 MB' },
    { id: 'rb-dec-16', url: 'photo-1517248135467-4c7edcad34c4', category: 'decor', status: 'archived', title: 'Monochrome Silver Table Dressing', caption: 'Silver sequin tablecloths from previous winter festival.', uploadedAt: '15 Sep 2026', size: '2.9 MB' },
    { id: 'rb-dec-17', url: 'photo-1507676184212-d03ab07a01bf', category: 'decor', status: 'archived', title: 'Past Season Burgundy Drapes', caption: 'Deep maroon fabric backdrop used in 2025 autumn weddings.', uploadedAt: '15 Sep 2026', size: '3.3 MB' },
    { id: 'rb-dec-18', url: 'photo-1525610553991-2bede1a236e2', category: 'decor', status: 'archived', title: 'Outdoor Bistro Lamp String', caption: 'Edison filament bulbs for vintage lawn dinners.', uploadedAt: '15 Sep 2026', size: '2.7 MB' },

    // 16 PEOPLE Photos: 9 Published, 3 Draft, 4 Archived
    { id: 'rb-peop-1', url: 'photo-1519741497674-611481863552', category: 'people', status: 'published', title: 'Guests Arriving at Foyer', caption: 'Traditional dhol welcome and guests receiving welcome drinks.', uploadedAt: '02 Nov 2026', size: '4.4 MB' },
    { id: 'rb-peop-2', url: 'photo-1555244162-803834f70033', category: 'people', status: 'published', title: 'Banquet Hall Dining Crowd', caption: 'Family and friends enjoying silver thali service at dining tables.', uploadedAt: '02 Nov 2026', size: '4.6 MB' },
    { id: 'rb-peop-3', url: 'photo-1519689950823-0a2251441815', category: 'people', status: 'published', title: 'Ceremonial Mandap Celebration', caption: 'Bride, groom and elders gathered for sacred pheras.', uploadedAt: '03 Nov 2026', size: '5.1 MB' },
    { id: 'rb-peop-4', url: 'photo-1527529482837-4698179dc6ce', category: 'people', status: 'published', title: 'Reception Stage Toast', caption: 'Couples and wedding guests gathering on stage for portraits.', uploadedAt: '03 Nov 2026', size: '4.2 MB' },
    { id: 'rb-peop-5', url: 'photo-1768508950719-4d76978fdf44', category: 'people', status: 'published', title: 'Social Lounge Mingling', caption: 'Cocktail tables with guests socializing before dinner.', uploadedAt: '04 Nov 2026', size: '3.9 MB' },
    { id: 'rb-peop-6', url: 'photo-1768508950790-3bbdfe3973c1', category: 'people', status: 'published', title: 'Sangeet Dance Floor Crowd', caption: 'Younger guests and family performing choreographies.', uploadedAt: '04 Nov 2026', size: '4.7 MB' },
    { id: 'rb-peop-7', url: 'photo-1744804298431-57953e4eaba0', category: 'people', status: 'published', title: 'Family Blessings at Mandap', caption: 'Grandparents and parents gifting shagun to the newly-weds.', uploadedAt: '05 Nov 2026', size: '3.8 MB' },
    { id: 'rb-peop-8', url: 'photo-1758810409996-583f3bad7d51', category: 'people', status: 'published', title: 'Baraat Procession Entry', caption: 'Festive baraat dance at main driveway entrance.', uploadedAt: '05 Nov 2026', size: '4.5 MB' },
    { id: 'rb-peop-9', url: 'photo-1587271636175-90d58cdad458', category: 'people', status: 'published', title: 'Vedic Pheras Ritual', caption: 'Solemn fire ceremony surrounded by close family members.', uploadedAt: '06 Nov 2026', size: '4.0 MB' },
    { id: 'rb-peop-10', url: 'photo-1511795409834-ef04bbd61622', category: 'people', status: 'draft', title: 'Buffet Line Queue', caption: 'Guests sampling starters at live chaat stall.', uploadedAt: '07 Nov 2026', size: '3.6 MB' },
    { id: 'rb-peop-11', url: 'photo-1520854221256-17451cc331bf', category: 'people', status: 'draft', title: 'Var Mala Stage Moment', caption: 'Garland exchange with rose petals shower.', uploadedAt: '07 Nov 2026', size: '4.3 MB' },
    { id: 'rb-peop-12', url: 'photo-1530103862676-de8c9debad1d', category: 'people', status: 'draft', title: 'Haldi Morning Celebration', caption: 'Informal haldi application by bridesmaids.', uploadedAt: '08 Nov 2026', size: '3.7 MB' },
    { id: 'rb-peop-13', url: 'photo-1591969851586-adbbd4accf81', category: 'people', status: 'archived', title: 'Pre-wedding Couple Stroll', caption: 'Couple portrait session in empty hall courtyard.', uploadedAt: '20 Sep 2026', size: '3.2 MB' },
    { id: 'rb-peop-14', url: 'photo-1630526720753-aa4e71acf67d', category: 'people', status: 'archived', title: 'Bridal Entry with Chhatri', caption: 'Brothers walking bride under floral canopy.', uploadedAt: '20 Sep 2026', size: '4.1 MB' },
    { id: 'rb-peop-15', url: 'photo-1757647630063-dd5cd82271f3', category: 'people', status: 'archived', title: 'Groom Entry on Vintage Car', caption: 'Groom arrival sequence at main entrance gate.', uploadedAt: '20 Sep 2026', size: '3.9 MB' },
    { id: 'rb-peop-16', url: 'photo-1629756048377-09540f52caa1', category: 'people', status: 'archived', title: 'Evening Cocktail Cheers', caption: 'Toast moment with bride and groom friends.', uploadedAt: '20 Sep 2026', size: '3.5 MB' }
  ];

  window.SK_DATA = {
    img, BRAND, PHOTOS, CATEGORIES, LOCALITIES, EVENT_TYPES, PARTNERS, POLICY,
    MANDIRS, MANDIR_COST, MANDIR_CHECKED, VENUE_ANCHORS, DECOR_PROFILES,
    BUSINESS_LOGIN_BG, SEED_ROYAL_PHOTOS
  };
})();
