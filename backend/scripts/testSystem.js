require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Menu = require('../models/Menu');
const Order = require('../models/Order');
const { generateUPIQR } = require('../utils/generateQR');

console.log('🧪 COMPREHENSIVE SYSTEM TEST\n');
console.log('=' .repeat(60));

let testsPassed = 0;
let testsFailed = 0;

const logTest = (name, passed, message = '') => {
  if (passed) {
    console.log(`✅ ${name}`);
    testsPassed++;
  } else {
    console.log(`❌ ${name}`);
    if (message) console.log(`   Error: ${message}`);
    testsFailed++;
  }
};

async function runTests() {
  try {
    // Test 1: Environment Variables
    console.log('\n📋 TEST 1: Environment Variables');
    console.log('-'.repeat(60));
    logTest('MONGODB_URI exists', !!process.env.MONGODB_URI);
    logTest('JWT_SECRET exists', !!process.env.JWT_SECRET);
    logTest('UPI_ID exists', !!process.env.UPI_ID);
    logTest('CAFE_NAME exists', !!process.env.CAFE_NAME);

    // Test 2: Database Connection
    console.log('\n📋 TEST 2: Database Connection');
    console.log('-'.repeat(60));
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-db');
      logTest('MongoDB connection successful', true);
    } catch (error) {
      logTest('MongoDB connection successful', false, error.message);
      process.exit(1);
    }

    // Test 3: Admin Model
    console.log('\n📋 TEST 3: Admin Model & Authentication');
    console.log('-'.repeat(60));
    
    // Clean up test admin
    await Admin.deleteOne({ email: 'test@test.com' });
    
    const testAdmin = await Admin.create({
      email: 'test@test.com',
      password: 'test123'
    });
    logTest('Admin creation successful', !!testAdmin);
    logTest('Password is hashed', testAdmin.password !== 'test123');
    
    const passwordMatch = await testAdmin.comparePassword('test123');
    logTest('Password comparison works', passwordMatch);
    
    const wrongPassword = await testAdmin.comparePassword('wrong');
    logTest('Wrong password rejected', !wrongPassword);

    // Test 4: Menu Model
    console.log('\n📋 TEST 4: Menu Model');
    console.log('-'.repeat(60));
    
    await Menu.deleteOne({ name: 'Test Coffee' });
    
    const testMenu = await Menu.create({
      name: 'Test Coffee',
      price: 150,
      category: 'coffee',
      description: 'Test item',
      available: true
    });
    logTest('Menu item creation successful', !!testMenu);
    logTest('Menu item has timestamps', !!testMenu.createdAt);

    // Test 5: Order Model
    console.log('\n📋 TEST 5: Order Model');
    console.log('-'.repeat(60));
    
    const testOrder = await Order.create({
      customerName: 'Test Customer',
      phone: '9876543210',
      tableNumber: '5',
      items: [{
        menuItemId: testMenu._id,
        name: testMenu.name,
        price: testMenu.price,
        quantity: 2
      }],
      totalAmount: 300,
      paymentMethod: 'upi_qr',
      paymentStatus: 'pending',
      status: 'pending'
    });
    logTest('Order creation successful', !!testOrder);
    logTest('Order has correct total', testOrder.totalAmount === 300);
    logTest('Order has correct status', testOrder.status === 'pending');
    logTest('Order has correct payment status', testOrder.paymentStatus === 'pending');

    // Test 6: Order Validation
    console.log('\n📋 TEST 6: Order Validation');
    console.log('-'.repeat(60));
    
    try {
      await Order.create({
        customerName: 'Test',
        phone: '123', // Invalid phone
        tableNumber: '5',
        items: [],
        totalAmount: 100
      });
      logTest('Invalid phone number rejected', false);
    } catch (error) {
      logTest('Invalid phone number rejected', true);
    }

    // Test 7: QR Code Generation
    console.log('\n📋 TEST 7: QR Code Generation');
    console.log('-'.repeat(60));
    
    try {
      const qrCode = await generateUPIQR(500);
      logTest('QR code generated', !!qrCode);
      logTest('QR code is base64 data URL', qrCode.startsWith('data:image/png;base64,'));
      
      // Decode and verify UPI link
      const base64Data = qrCode.replace('data:image/png;base64,', '');
      logTest('QR code has valid base64 data', base64Data.length > 100);
    } catch (error) {
      logTest('QR code generated', false, error.message);
    }

    // Test 8: Payment Submission
    console.log('\n📋 TEST 8: Payment Submission');
    console.log('-'.repeat(60));
    
    testOrder.utr = '123456789012';
    testOrder.paymentStatus = 'verification_pending';
    await testOrder.save();
    
    const updatedOrder = await Order.findById(testOrder._id);
    logTest('UTR saved correctly', updatedOrder.utr === '123456789012');
    logTest('Payment status updated', updatedOrder.paymentStatus === 'verification_pending');

    // Test 9: Payment Verification
    console.log('\n📋 TEST 9: Payment Verification');
    console.log('-'.repeat(60));
    
    updatedOrder.paymentStatus = 'paid';
    updatedOrder.status = 'preparing';
    await updatedOrder.save();
    
    const verifiedOrder = await Order.findById(testOrder._id);
    logTest('Payment verified', verifiedOrder.paymentStatus === 'paid');
    logTest('Status updated to preparing', verifiedOrder.status === 'preparing');

    // Test 10: Order Status Transitions
    console.log('\n📋 TEST 10: Order Status Transitions');
    console.log('-'.repeat(60));
    
    const statuses = ['preparing', 'ready', 'completed'];
    for (const status of statuses) {
      verifiedOrder.status = status;
      await verifiedOrder.save();
      const check = await Order.findById(testOrder._id);
      logTest(`Status transition to ${status}`, check.status === status);
    }

    // Test 11: Order Population
    console.log('\n📋 TEST 11: Order Population');
    console.log('-'.repeat(60));
    
    const populatedOrder = await Order.findById(testOrder._id).populate('items.menuItemId');
    logTest('Order items populated', !!populatedOrder.items[0].menuItemId);
    logTest('Populated item has name', !!populatedOrder.items[0].menuItemId.name);

    // Test 12: Query Filters
    console.log('\n📋 TEST 12: Query Filters');
    console.log('-'.repeat(60));
    
    const pendingOrders = await Order.find({ paymentStatus: 'paid' });
    logTest('Filter by payment status works', pendingOrders.length > 0);
    
    const completedOrders = await Order.find({ status: 'completed' });
    logTest('Filter by order status works', completedOrders.length > 0);

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await Admin.deleteOne({ email: 'test@test.com' });
    await Menu.deleteOne({ name: 'Test Coffee' });
    await Order.deleteById(testOrder._id);
    console.log('✅ Cleanup complete');

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Tests Passed: ${testsPassed}`);
    console.log(`❌ Tests Failed: ${testsFailed}`);
    console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! System is ready for production.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review and fix issues.');
    }

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR:', error);
    testsFailed++;
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(testsFailed > 0 ? 1 : 0);
  }
}

runTests();
