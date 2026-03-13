require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 DIAGNOSING BACKEND ISSUES\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   PORT:', process.env.PORT || '❌ NOT SET');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('   ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ NOT SET');
console.log('   ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✅ SET' : '❌ NOT SET');

// Test MongoDB connection
console.log('\n2. Testing MongoDB Connection...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-db')
  .then(async () => {
    console.log('   ✅ MongoDB connected successfully');
    
    // Check if admin exists
    const Admin = require('./models/Admin');
    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@cafe.com' });
    
    if (admin) {
      console.log('   ✅ Admin user exists');
      console.log('   Email:', admin.email);
    } else {
      console.log('   ⚠️  Admin user does not exist');
      console.log('   Creating admin user...');
      
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@cafe.com',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      });
      
      console.log('   ✅ Admin user created');
    }
    
    console.log('\n✅ All checks passed!');
    console.log('\nNext steps:');
    console.log('1. Start backend: npm run dev');
    console.log('2. Start frontend: cd ../frontend && npm run dev');
    console.log('3. Access admin: http://localhost:5173/admin');
    
    process.exit(0);
  })
  .catch((error) => {
    console.log('   ❌ MongoDB connection failed');
    console.log('   Error:', error.message);
    console.log('\n⚠️  MongoDB is not running!');
    console.log('\nTo fix:');
    console.log('- Windows: Start MongoDB service');
    console.log('- Mac/Linux: Run "mongod" in terminal');
    console.log('- Or use MongoDB Atlas (cloud)');
    process.exit(1);
  });
