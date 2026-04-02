require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Paths ──────────────────────────────────────────────────────────────────
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const MENU_FILE   = path.join(__dirname, 'data', 'menu.json');

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());

// ── JSON file helpers ──────────────────────────────────────────────────────
function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

// ── Auth middleware ────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  // Accept the static token issued at login
  if (token !== process.env.JWT_SECRET) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  next();
}

// ══════════════════════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════════════════════
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (
    email    === (process.env.ADMIN_EMAIL    || 'admin@cafe.com') &&
    password === (process.env.ADMIN_PASSWORD || 'admin123')
  ) {
    return res.json({
      success: true,
      data: { token: process.env.JWT_SECRET || 'cafe-admin-secret-token-2024' }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// ══════════════════════════════════════════════════════════════════════════
//  ORDERS
// ══════════════════════════════════════════════════════════════════════════

// POST /api/orders  — place a new order (public)
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, tableNumber, items, totalAmount } = req.body;

    if (!customerName || !tableNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const orders = readJSON(ORDERS_FILE);

    const newOrder = {
      orderId:      uuidv4(),
      customerName: String(customerName).trim(),
      tableNumber:  String(tableNumber).trim(),
      items,
      totalAmount:  Number(totalAmount) || 0,
      status:       'pending',
      paymentStatus:'pending',
      createdAt:    new Date().toISOString()
    };

    orders.push(newOrder);
    writeJSON(ORDERS_FILE, orders);

    return res.status(201).json({
      success: true,
      orderId: newOrder.orderId,
      message: 'Order placed!'
    });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /admin/orders  — list orders, newest first (protected)
app.get('/admin/orders', requireAuth, (req, res) => {
  try {
    let orders = readJSON(ORDERS_FILE);

    // Optional status filter
    const { status } = req.query;
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    // Newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Normalise _id so the frontend can use order._id or order.orderId
    const normalised = orders.map(o => ({ ...o, _id: o.orderId }));

    return res.json({ success: true, data: normalised });
  } catch (err) {
    console.error('GET /admin/orders error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /admin/orders/:orderId/status  (protected)
app.patch('/admin/orders/:orderId/status', requireAuth, (req, res) => {
  try {
    const { orderId } = req.params;
    const { status }  = req.body;

    const valid = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const orders = readJSON(ORDERS_FILE);
    const idx    = orders.findIndex(o => o.orderId === orderId);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    orders[idx].status = status;
    writeJSON(ORDERS_FILE, orders);

    return res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    console.error('PATCH status error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /admin/orders/:orderId/verify-payment  (protected)
app.patch('/admin/orders/:orderId/verify-payment', requireAuth, (req, res) => {
  try {
    const { orderId }  = req.params;
    const { approved } = req.body;

    const orders = readJSON(ORDERS_FILE);
    const idx    = orders.findIndex(o => o.orderId === orderId);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    orders[idx].paymentStatus = approved ? 'paid' : 'rejected';
    writeJSON(ORDERS_FILE, orders);

    return res.json({ success: true });
  } catch (err) {
    console.error('PATCH verify-payment error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ══════════════════════════════════════════════════════════════════════════
//  MENU
// ══════════════════════════════════════════════════════════════════════════

// GET /api/menu  (public)
app.get('/api/menu', (req, res) => {
  try {
    const menu = readJSON(MENU_FILE);
    return res.json({ success: true, data: menu });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/menu  (protected)
app.post('/api/menu', requireAuth, (req, res) => {
  try {
    const menu    = readJSON(MENU_FILE);
    const newItem = { _id: uuidv4(), ...req.body, available: req.body.available ?? true };
    menu.push(newItem);
    writeJSON(MENU_FILE, menu);
    return res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/menu/:id  (protected)
app.put('/api/menu/:id', requireAuth, (req, res) => {
  try {
    const menu = readJSON(MENU_FILE);
    const idx  = menu.findIndex(i => i._id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    menu[idx] = { ...menu[idx], ...req.body, _id: req.params.id };
    writeJSON(MENU_FILE, menu);
    return res.json({ success: true, data: menu[idx] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/menu/:id  (protected)
app.delete('/api/menu/:id', requireAuth, (req, res) => {
  try {
    let menu = readJSON(MENU_FILE);
    const before = menu.length;
    menu = menu.filter(i => i._id !== req.params.id);

    if (menu.length === before) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    writeJSON(MENU_FILE, menu);
    return res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ success: true, message: 'Server running' }));

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Café backend running on http://localhost:${PORT}`);
  console.log(`   Admin login: ${process.env.ADMIN_EMAIL || 'admin@cafe.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
});
