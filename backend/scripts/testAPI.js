require('dotenv').config();

const API_BASE = process.env.API_BASE || 'http://localhost:5000';

console.log('🧪 API INTEGRATION TEST');
console.log('=' .repeat(60));
console.log(`Testing API at: ${API_BASE}\n`);

let testsPassed = 0;
let testsFailed = 0;
let adminToken = '';
let testOrderId = '';
let testMenuId = '';

const logTest = (name, passed, details = '') => {
  if (passed) {
    console.log(`✅ ${name}`);
    testsPassed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    testsFailed++;
  }
};

async function makeRequest(method, endpoint, body = null, token = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

async function runTests() {
  console.log('📋 TEST 1: Health Check');
  console.log('-'.repeat(60));
  const health = await makeRequest('GET', '/health');
  logTest('Server is running', health.status === 200);
  logTest('Health check returns success', health.data?.success === true);

  console.log('\n📋 TEST 2: Get Menu Items (Public)');
  console.log('-'.repeat(60));
  const menu = await makeRequest('GET', '/api/menu');
  logTest('Get menu returns 200', menu.status === 200);
  logTest('Menu has data array', Array.isArray(menu.data?.data));
  console.log(`   Found ${menu.data?.count || 0} menu items`);

  console.log('\n📋 TEST 3: Admin Login');
  console.log('-'.repeat(60));
  const login = await makeRequest('POST', '/admin/login', {
    email: process.env.ADMIN_EMAIL || 'admin@cafe.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  });
  logTest('Admin login successful', login.status === 200);
  logTest('Login returns token', !!login.data?.data?.token);
  
  if (login.data?.data?.token) {
    adminToken = login.data.data.token;
    console.log(`   Token: ${adminToken.substring(0, 20)}...`);
  }

  console.log('\n📋 TEST 4: Admin Login - Invalid Credentials');
  console.log('-'.repeat(60));
  const badLogin = await makeRequest('POST', '/admin/login', {
    email: 'wrong@email.com',
    password: 'wrongpass'
  });
  logTest('Invalid credentials rejected', badLogin.status === 401);

  console.log('\n📋 TEST 5: Create Menu Item (Admin)');
  console.log('-'.repeat(60));
  const createMenu = await makeRequest('POST', '/api/menu', {
    name: 'Test API Coffee',
    price: 199,
    category: 'coffee',
    description: 'API test item',
    available: true
  }, adminToken);
  logTest('Create menu item successful', createMenu.status === 201);
  logTest('Menu item has ID', !!createMenu.data?.data?._id);
  
  if (createMenu.data?.data?._id) {
    testMenuId = createMenu.data.data._id;
  }

  console.log('\n📋 TEST 6: Create Menu Item Without Auth');
  console.log('-'.repeat(60));
  const noAuthMenu = await makeRequest('POST', '/api/menu', {
    name: 'Unauthorized Item',
    price: 100,
    category: 'coffee'
  });
  logTest('Unauthorized request rejected', noAuthMenu.status === 401);

  console.log('\n📋 TEST 7: Create Order');
  console.log('-'.repeat(60));
  const createOrder = await makeRequest('POST', '/api/orders', {
    customerName: 'API Test Customer',
    phone: '9876543210',
    tableNumber: '99',
    items: [{
      menuItemId: testMenuId || '507f1f77bcf86cd799439011',
      name: 'Test Coffee',
      price: 199,
      quantity: 2
    }],
    totalAmount: 398
  });
  logTest('Create order successful', createOrder.status === 201);
  logTest('Order returns ID', !!createOrder.data?.data?.orderId);
  logTest('Order returns QR code', !!createOrder.data?.data?.paymentQR);
  logTest('QR code is base64', createOrder.data?.data?.paymentQR?.startsWith('data:image/png;base64,'));
  logTest('Order returns UPI ID', !!createOrder.data?.data?.upiId);
  
  if (createOrder.data?.data?.orderId) {
    testOrderId = createOrder.data.data.orderId;
    console.log(`   Order ID: ${testOrderId}`);
  }

  console.log('\n📋 TEST 8: Create Order - Invalid Phone');
  console.log('-'.repeat(60));
  const badOrder = await makeRequest('POST', '/api/orders', {
    customerName: 'Test',
    phone: '123',
    tableNumber: '1',
    items: [{ menuItemId: testMenuId, name: 'Test', price: 100, quantity: 1 }],
    totalAmount: 100
  });
  logTest('Invalid phone rejected', badOrder.status === 400);

  console.log('\n📋 TEST 9: Get Order by ID');
  console.log('-'.repeat(60));
  const getOrder = await makeRequest('GET', `/api/orders/${testOrderId}`);
  logTest('Get order successful', getOrder.status === 200);
  logTest('Order has customer name', !!getOrder.data?.data?.customerName);
  logTest('Order status is pending', getOrder.data?.data?.status === 'pending');
  logTest('Payment status is pending', getOrder.data?.data?.paymentStatus === 'pending');

  console.log('\n📋 TEST 10: Submit Payment (UTR)');
  console.log('-'.repeat(60));
  const submitPayment = await makeRequest('PATCH', `/api/orders/${testOrderId}/payment`, {
    utr: '123456789012'
  });
  logTest('Submit payment successful', submitPayment.status === 200);
  logTest('Payment status updated', submitPayment.data?.data?.paymentStatus === 'verification_pending');

  console.log('\n📋 TEST 11: Submit Payment - Invalid UTR');
  console.log('-'.repeat(60));
  const badUTR = await makeRequest('PATCH', `/api/orders/${testOrderId}/payment`, {
    utr: '123'
  });
  logTest('Invalid UTR rejected', badUTR.status === 400);

  console.log('\n📋 TEST 12: Get All Orders (Admin)');
  console.log('-'.repeat(60));
  const allOrders = await makeRequest('GET', '/admin/orders', null, adminToken);
  logTest('Get orders successful', allOrders.status === 200);
  logTest('Orders is array', Array.isArray(allOrders.data?.data));
  logTest('Orders count matches', allOrders.data?.count === allOrders.data?.data?.length);
  console.log(`   Found ${allOrders.data?.count || 0} orders`);

  console.log('\n📋 TEST 13: Get Orders Without Auth');
  console.log('-'.repeat(60));
  const noAuthOrders = await makeRequest('GET', '/admin/orders');
  logTest('Unauthorized request rejected', noAuthOrders.status === 401);

  console.log('\n📋 TEST 14: Verify Payment (Admin)');
  console.log('-'.repeat(60));
  const verifyPayment = await makeRequest('PATCH', `/admin/orders/${testOrderId}/verify-payment`, {
    approved: true
  }, adminToken);
  logTest('Verify payment successful', verifyPayment.status === 200);
  logTest('Payment status is paid', verifyPayment.data?.data?.paymentStatus === 'paid');
  logTest('Order status is preparing', verifyPayment.data?.data?.status === 'preparing');

  console.log('\n📋 TEST 15: Update Order Status (Admin)');
  console.log('-'.repeat(60));
  const statuses = ['ready', 'completed'];
  
  for (const status of statuses) {
    const updateStatus = await makeRequest('PATCH', `/admin/orders/${testOrderId}/status`, {
      status
    }, adminToken);
    logTest(`Update status to ${status}`, updateStatus.status === 200);
    logTest(`Status is ${status}`, updateStatus.data?.data?.status === status);
  }

  console.log('\n📋 TEST 16: Update Status - Invalid Value');
  console.log('-'.repeat(60));
  const badStatus = await makeRequest('PATCH', `/admin/orders/${testOrderId}/status`, {
    status: 'invalid_status'
  }, adminToken);
  logTest('Invalid status rejected', badStatus.status === 400);

  console.log('\n📋 TEST 17: Filter Orders by Status');
  console.log('-'.repeat(60));
  const filteredOrders = await makeRequest('GET', '/admin/orders?status=completed', null, adminToken);
  logTest('Filter by status works', filteredOrders.status === 200);

  console.log('\n📋 TEST 18: Update Menu Item (Admin)');
  console.log('-'.repeat(60));
  if (testMenuId) {
    const updateMenu = await makeRequest('PUT', `/api/menu/${testMenuId}`, {
      price: 250,
      available: false
    }, adminToken);
    logTest('Update menu item successful', updateMenu.status === 200);
    logTest('Price updated', updateMenu.data?.data?.price === 250);
  }

  console.log('\n📋 TEST 19: Delete Menu Item (Admin)');
  console.log('-'.repeat(60));
  if (testMenuId) {
    const deleteMenu = await makeRequest('DELETE', `/api/menu/${testMenuId}`, null, adminToken);
    logTest('Delete menu item successful', deleteMenu.status === 200);
  }

  console.log('\n📋 TEST 20: 404 Handler');
  console.log('-'.repeat(60));
  const notFound = await makeRequest('GET', '/api/nonexistent');
  logTest('404 handler works', notFound.status === 404);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 API TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 ALL API TESTS PASSED!');
  } else {
    console.log('\n⚠️  Some API tests failed. Please review.');
  }

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Check if server is running
console.log('⏳ Checking if server is running...\n');
makeRequest('GET', '/health')
  .then(response => {
    if (response.status === 200) {
      console.log('✅ Server is running. Starting tests...\n');
      runTests();
    } else {
      console.log('❌ Server is not running!');
      console.log('Please start the server first: npm run dev');
      process.exit(1);
    }
  })
  .catch(error => {
    console.log('❌ Cannot connect to server!');
    console.log('Error:', error.message);
    console.log('\nPlease start the server first: npm run dev');
    process.exit(1);
  });
