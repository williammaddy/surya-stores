require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Settings = require('./models/Settings');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting MongoDB Database Seeder for Surya Stores...');

    // 1. Clear existing data
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Settings.deleteMany(),
    ]);
    console.log('🧹 Cleaned existing database collections.');

    // 2. Seed Default Settings
    const settings = await Settings.create({
      storeName: 'Surya Stores',
      phone: '+91 98765 43210',
      whatsAppNumber: '+91 98765 43210',
      email: 'info@suryastores.com',
      address: 'Shop #12, Surya Complex, Main Market Road, City Center',
      businessHours: 'Mon - Sat: 9:00 AM - 9:30 PM | Sun: 10:00 AM - 2:00 PM',
      aboutText:
        'Surya Stores is your trusted neighborhood bookstore and stationery destination. We provide curriculum school guides, creative art essentials, office supplies, and educational toys for all age groups.',
      lowStockThreshold: 10,
      socialLinks: {
        facebook: 'https://facebook.com/suryastores',
        instagram: 'https://instagram.com/suryastores',
        twitter: 'https://twitter.com/suryastores',
      },
    });
    console.log('⚙️ Default store settings initialized.');

    // 3. Seed Users (Admin + Sample Customer)
    const admin = await User.create({
      name: 'Store Administrator',
      email: 'admin@suryastores.com',
      phone: '+91 98765 43210',
      password: 'admin123',
      role: 'admin',
      address: {
        street: 'Shop #12, Surya Complex',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        fullAddress: 'Shop #12, Surya Complex, Main Market Road, Chennai - 600001',
      },
    });

    const customer = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@gmail.com',
      phone: '+91 98765 11223',
      password: 'customer123',
      role: 'customer',
      address: {
        street: 'Flat 302, Green Valley Apartments',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600028',
        fullAddress: 'Flat 302, Green Valley Apartments, Anna Nagar, Chennai - 600028',
      },
    });

    console.log(`👤 Admin created: ${admin.email} (password: admin123)`);
    console.log(`👤 Sample Customer created: ${customer.email} (password: customer123)`);

    // 4. Seed Categories
    const categoriesData = [
      {
        name: 'Stationery & Notebooks',
        slug: 'stationery',
        description: 'Spiral notebooks, ruled registers, pens, markers, geometry sets, and essential student stationery.',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Toys & Puzzles',
        slug: 'toys',
        description: 'Educational STEM kits, board games, wooden chess, Rubik cubes, and cognitive building blocks.',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Books & Literature',
        slug: 'books',
        description: 'Bestselling novels, self-help, encyclopedias, children illustrated storybooks, and reference books.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'School Guides & Notes',
        slug: 'school-guides',
        description: 'CBSE and State Board syllabus guides, chapterwise solved papers, All-In-One workbooks, and question banks.',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Art & Craft Supplies',
        slug: 'art-craft',
        description: 'Acrylic colors, sketchbooks, canvas boards, brushes, modeling clay, and calligraphy tools.',
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
      {
        name: 'Office & Desk Supplies',
        slug: 'office-supplies',
        description: 'Document files, staplers, sticky notes, desk organizers, calculators, and laminating sheets.',
        image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
        isActive: true,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });
    console.log(`📁 Seeded ${createdCategories.length} categories.`);

    // 5. Seed 25+ Rich Products
    const productsData = [
      // --- Stationery & Notebooks ---
      {
        name: 'Classmate Pulse 6-Subject Spiral Notebook (300 Pages)',
        slug: 'classmate-pulse-6-subject-spiral-notebook',
        description: 'High-quality 70 GSM elemental chlorine-free paper with durable waterproof poly cover and multi-color dividers for college and school.',
        price: 199.0,
        stock: 45,
        category: catMap['stationery'],
        brand: 'Classmate',
        sku: 'SURYA-NB-001',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        featured: true,
        isActive: true,
      },
      {
        name: 'Pilot V7 Hi-Tecpoint Rollerball Pens (Set of 3 - Blue/Black/Red)',
        slug: 'pilot-v7-rollerball-pens-set-3',
        description: 'Pure liquid ink with 0.7mm Japanese tungsten carbide tip for ultra-smooth writing, quick drying, and consistent ink flow.',
        price: 210.0,
        stock: 40,
        category: catMap['stationery'],
        brand: 'Pilot',
        sku: 'SURYA-PEN-002',
        image: 'https://images.unsplash.com/photo-1585336261026-77884eb5cd3d?auto=format&fit=crop&w=800&q=80',
        featured: true,
        isActive: true,
      },
      {
        name: 'Camlin Scholar Mathematical Geometry Box',
        slug: 'camlin-scholar-geometry-box',
        description: 'Self-centering compass, divider, 15cm ruler, protractor, and set squares made of transparent non-rusting virgin plastic.',
        price: 140.0,
        stock: 50,
        category: catMap['stationery'],
        brand: 'Camlin',
        sku: 'SURYA-GEO-003',
        image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },
      {
        name: 'Faber-Castell Tri-Grip Mechanical Pencil Set (0.7mm + 2B Leads)',
        slug: 'faber-castell-mechanical-pencil-set',
        description: 'Ergonomic rubberized grip with cushioned tip technology that protects against lead breakage during rapid note-taking.',
        price: 95.0,
        stock: 35,
        category: catMap['stationery'],
        brand: 'Faber-Castell',
        sku: 'SURYA-PEN-004',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },

      // --- Educational Toys & Puzzles ---
      {
        name: 'Solar System Planetary Orbit Motorized DIY Science Kit',
        slug: 'solar-system-diy-science-kit',
        description: 'Hands-on motorized DIY rotating solar system planetarium model with paint set for young astronomers (Ages 6+).',
        price: 649.0,
        stock: 18,
        category: catMap['toys'],
        brand: 'Skillmatics',
        sku: 'SURYA-TOY-005',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
        featured: true,
        isActive: true,
      },
      {
        name: 'Classic Wooden Magnetic Chess & Checkers Board Set (12x12 Inch)',
        slug: 'classic-wooden-chess-set',
        description: 'Handcrafted polished Sheesham wooden foldable magnetic chess board with carved tournament pieces and velvet storage slot.',
        price: 799.0,
        stock: 12,
        category: catMap['toys'],
        brand: 'StonKraft',
        sku: 'SURYA-TOY-006',
        image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
        featured: true,
        isActive: true,
      },
      {
        name: 'Speed Cube 3x3x3 Stickerless Smooth Magic Cube',
        slug: 'speed-cube-3x3-stickerless',
        description: 'Fast turning anti-pop puzzle cube engineered with adjustable tension for speedcubing enthusiasts and mental agility.',
        price: 249.0,
        stock: 35,
        category: catMap['toys'],
        brand: 'MoYu',
        sku: 'SURYA-TOY-007',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },
      {
        name: 'Funskool Play-Doh Party Pack (10 Colorful Modeling Tubs)',
        slug: 'play-doh-party-pack-10-tubs',
        description: 'Non-toxic squishy modeling compound that sparks boundless tactile creativity and shape recognition for kids.',
        price: 399.0,
        stock: 28,
        category: catMap['toys'],
        brand: 'Funskool',
        sku: 'SURYA-TOY-008',
        image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },

      // --- Books & Literature ---
      {
        name: 'Atomic Habits by James Clear',
        slug: 'atomic-habits-james-clear',
        description: 'An easy and proven way to build good habits and break bad ones. The definitive international personal development bestseller.',
        price: 499.0,
        stock: 25,
        category: catMap['books'],
        brand: 'Penguin Random House',
        sku: 'SURYA-BK-009',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
        featured: true,
        isActive: true,
      },
      {
        name: 'The Psychology of Money by Morgan Housel',
        slug: 'the-psychology-of-money-morgan-housel',
        description: 'Timeless lessons on wealth, greed, and happiness across 19 engaging short stories explaining human behavior with money.',
        price: 350.0,
        stock: 20,
        category: catMap['books'],
        brand: 'Jaico Publishing',
        sku: 'SURYA-BK-010',
        image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80',
        featured: true,
        isActive: true,
      },
      {
        name: 'Oxford Illustrated Children Dictionary & Thesaurus',
        slug: 'oxford-illustrated-children-dictionary',
        description: 'Colorful vocabulary reference book featuring over 5,000 headwords, diagrams, grammar tips, and example sentences.',
        price: 599.0,
        stock: 16,
        category: catMap['books'],
        brand: 'Oxford University Press',
        sku: 'SURYA-BK-011',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },
      {
        name: 'Wings of Fire by Dr. A.P.J. Abdul Kalam',
        slug: 'wings-of-fire-apj-abdul-kalam',
        description: 'An inspirational autobiography of India former President and missile scientist, tracing his journey from humble roots to leading space missions.',
        price: 299.0,
        stock: 30,
        category: catMap['books'],
        brand: 'Universities Press',
        sku: 'SURYA-BK-012',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },

      // --- School Guides & Notes ---
      {
        name: 'Class 10 CBSE All In One Mathematics 2026 Edition',
        slug: 'class-10-cbse-all-in-one-mathematics-2026',
        description: 'Comprehensive chapterwise theory, NCERT solutions, previous 10 years solved board papers, and self-assessment test series.',
        price: 490.0,
        stock: 40,
        category: catMap['school-guides'],
        brand: 'Arihant Publications',
        sku: 'SURYA-SG-013',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
        featured: true,
        isActive: true,
      },
      {
        name: 'Class 10 CBSE All In One Science 2026 Edition',
        slug: 'class-10-cbse-all-in-one-science-2026',
        description: 'Complete syllabus guide covering Physics, Chemistry, and Biology with case-study questions and experimental activities.',
        price: 520.0,
        stock: 38,
        category: catMap['school-guides'],
        brand: 'Arihant Publications',
        sku: 'SURYA-SG-014',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
        featured: true,
        isActive: true,
      },
      {
        name: 'Class 12 Physics Champion Chapterwise Solved Papers',
        slug: 'class-12-physics-champion-solved-papers',
        description: 'Targeted preparation tool for board examinations and competitive entrance tests with step-by-step numerical solutions.',
        price: 580.0,
        stock: 24,
        category: catMap['school-guides'],
        brand: 'MTG Learning',
        sku: 'SURYA-SG-015',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },
      {
        name: 'Primary English Grammar & Composition Workbook (Level 4-6)',
        slug: 'primary-english-grammar-workbook',
        description: 'Structured exercises in tenses, punctuation, active-passive voice, and essay composition with practice worksheets.',
        price: 260.0,
        stock: 32,
        category: catMap['school-guides'],
        brand: 'Wren & Martin',
        sku: 'SURYA-SG-016',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },

      // --- Art & Craft Supplies ---
      {
        name: 'Doms Artist Acrylic Color Tubes Set (12 Shades x 20ml)',
        slug: 'doms-artist-acrylic-colors-12-shades',
        description: 'Rich pigmented, quick-drying water-resistant acrylic paints ideal for canvas, wood, terracotta, and mixed-media paper.',
        price: 275.0,
        stock: 22,
        category: catMap['art-craft'],
        brand: 'Doms',
        sku: 'SURYA-ART-017',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
        featured: true,
        isActive: true,
      },
      {
        name: 'Brustro Spiral Bound Artists Mixed Media Sketchbook (A4, 200 GSM)',
        slug: 'brustro-mixed-media-sketchbook-a4',
        description: 'Acid-free cold-pressed heavyweight paper suitable for watercolor, gouache, graphite sketching, and ink drawings.',
        price: 360.0,
        stock: 20,
        category: catMap['art-craft'],
        brand: 'Brustro',
        sku: 'SURYA-ART-018',
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },
      {
        name: 'Camlin Synthetic Gold Painting Brushes (Assorted Pack of 7)',
        slug: 'camlin-synthetic-gold-brushes-pack-7',
        description: 'Durable synthetic filaments with rust-free seamless ferrules for round, flat, and filbert brush strokes.',
        price: 210.0,
        stock: 30,
        category: catMap['art-craft'],
        brand: 'Camlin',
        sku: 'SURYA-ART-019',
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },

      // --- Office & Desk Supplies ---
      {
        name: 'Pastel Sticky Notes & Page Flags Index Tabs (500 Sheets)',
        slug: 'pastel-sticky-notes-500-sheets',
        description: 'Soft pastel sticky memos with super adhesive backing that leaves no residue upon repositioning on study books and documents.',
        price: 120.0,
        stock: 65,
        category: catMap['office-supplies'],
        brand: '3M Post-it',
        sku: 'SURYA-OFF-020',
        image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },
      {
        name: 'Mesh Metal 3-Tier Desktop Document Tray & Organizer',
        slug: 'mesh-metal-desktop-document-tray',
        description: 'Sturdy black powder-coated steel mesh sliding letter trays for sorting office files, notebooks, and folders neatly.',
        price: 450.0,
        stock: 14,
        category: catMap['office-supplies'],
        brand: 'Solo',
        sku: 'SURYA-OFF-021',
        image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },
      {
        name: 'Kangaro Heavy Duty Paper Stapler & Staples Combo (No. 10)',
        slug: 'kangaro-heavy-duty-stapler-combo',
        description: 'All-metal construction with integrated staple remover and 1000 premium anti-jam copper-coated pins included.',
        price: 135.0,
        stock: 40,
        category: catMap['office-supplies'],
        brand: 'Kangaro',
        sku: 'SURYA-OFF-022',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
        featured: false,
        isActive: true,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`📦 Seeded ${createdProducts.length} catalog products.`);

    // 6. Seed Sample Orders
    const sampleOrder1 = await Order.create({
      orderNumber: 'SURYA-2026-0001',
      customer: customer._id,
      items: [
        {
          product: createdProducts[0]._id, // Classmate Notebook
          productName: createdProducts[0].name,
          quantity: 2,
          price: createdProducts[0].price,
          subtotal: createdProducts[0].price * 2,
          image: createdProducts[0].image,
        },
        {
          product: createdProducts[1]._id, // Pilot V7 Pen set
          productName: createdProducts[1].name,
          quantity: 1,
          price: createdProducts[1].price,
          subtotal: createdProducts[1].price * 1,
          image: createdProducts[1].image,
        },
      ],
      subtotal: 199.0 * 2 + 210.0,
      total: 199.0 * 2 + 210.0,
      customerDetails: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address.fullAddress,
      },
      status: 'Confirmed',
      notes: 'Please call before delivery in the evening.',
    });

    const sampleOrder2 = await Order.create({
      orderNumber: 'SURYA-2026-0002',
      customer: customer._id,
      items: [
        {
          product: createdProducts[12]._id, // Class 10 Maths Guide
          productName: createdProducts[12].name,
          quantity: 1,
          price: createdProducts[12].price,
          subtotal: createdProducts[12].price * 1,
          image: createdProducts[12].image,
        },
        {
          product: createdProducts[13]._id, // Class 10 Science Guide
          productName: createdProducts[13].name,
          quantity: 1,
          price: createdProducts[13].price,
          subtotal: createdProducts[13].price * 1,
          image: createdProducts[13].image,
        },
      ],
      subtotal: 490.0 + 520.0,
      total: 490.0 + 520.0,
      customerDetails: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address.fullAddress,
      },
      status: 'Pending',
      notes: 'Urgent for board exam preparation.',
    });

    console.log(`🛒 Seeded 2 sample orders (#${sampleOrder1.orderNumber}, #${sampleOrder2.orderNumber}).`);
    console.log('✅ MongoDB Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
