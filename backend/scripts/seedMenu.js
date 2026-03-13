require('dotenv').config();
const mongoose = require('mongoose');
const Menu = require('../models/Menu');

const sampleMenuItems = [
  {
    name: 'Cappuccino',
    price: 150,
    category: 'coffee',
    description: 'Rich espresso with steamed milk and foam',
    available: true
  },
  {
    name: 'Latte',
    price: 160,
    category: 'coffee',
    description: 'Smooth espresso with steamed milk',
    available: true
  },
  {
    name: 'Espresso',
    price: 100,
    category: 'coffee',
    description: 'Strong Italian coffee shot',
    available: true
  },
  {
    name: 'Americano',
    price: 120,
    category: 'coffee',
    description: 'Espresso with hot water',
    available: true
  },
  {
    name: 'Masala Chai',
    price: 80,
    category: 'tea',
    description: 'Traditional Indian spiced tea',
    available: true
  },
  {
    name: 'Green Tea',
    price: 90,
    category: 'tea',
    description: 'Healthy antioxidant tea',
    available: true
  },
  {
    name: 'Chocolate Cake',
    price: 200,
    category: 'desserts',
    description: 'Rich chocolate layered cake',
    available: true
  },
  {
    name: 'Cheesecake',
    price: 220,
    category: 'desserts',
    description: 'Creamy New York style cheesecake',
    available: true
  },
  {
    name: 'Sandwich',
    price: 150,
    category: 'snacks',
    description: 'Grilled vegetable sandwich',
    available: true
  },
  {
    name: 'French Fries',
    price: 100,
    category: 'snacks',
    description: 'Crispy golden fries',
    available: true
  }
];

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-db');
    console.log('✅ Connected to MongoDB');
    
    // Clear existing menu items
    await Menu.deleteMany({});
    console.log('🗑️  Cleared existing menu items');
    
    // Insert sample menu items
    const items = await Menu.insertMany(sampleMenuItems);
    console.log(`✅ Inserted ${items.length} menu items`);
    
    console.log('\n📋 Sample Menu Items:');
    items.forEach(item => {
      console.log(`  - ${item.name} (${item.category}): ₹${item.price}`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu:', error);
    process.exit(1);
  }
};

seedMenu();
