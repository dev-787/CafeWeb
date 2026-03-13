# Frontend Integration Guide

## Overview

This guide shows how to integrate your React frontend with the backend API.

## API Base URL

```javascript
const API_BASE_URL = 'http://localhost:5000';
// Production: 'https://api.yourcafe.com'
```

## 1. Create API Service

Create `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  // Menu APIs
  async getMenu(category = '') {
    const url = category 
      ? `${API_BASE_URL}/api/menu?category=${category}`
      : `${API_BASE_URL}/api/menu`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Order APIs
  async createOrder(orderData) {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }

  async submitPayment(orderId, utr) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ utr })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }

  async getOrder(orderId) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
    const data = await response.json();
    return data;
  }

  // Admin APIs
  async adminLogin(email, password) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }

  async getAdminOrders(token, filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    return data;
  }

  async verifyPayment(token, orderId, approved) {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/verify-payment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ approved })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }

  async updateOrderStatus(token, orderId, status) {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }
}

export default new ApiService();
```

## 2. Update Cart Component

Modify your cart's "Order Now" button:

```javascript
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Cart({ items, customerInfo }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOrderNow = async () => {
    try {
      setLoading(true);
      
      // Prepare order data
      const orderData = {
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        tableNumber: customerInfo.tableNumber,
        items: items.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      
      // Create order
      const result = await api.createOrder(orderData);
      
      // Navigate to payment page with QR code
      navigate('/payment', {
        state: {
          orderId: result.data.orderId,
          qrCode: result.data.paymentQR,
          amount: result.data.totalAmount,
          upiId: result.data.upiId,
          cafeName: result.data.cafeName
        }
      });
      
    } catch (error) {
      alert('Order creation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleOrderNow}
      disabled={loading || items.length === 0}
    >
      {loading ? 'Processing...' : 'Order Now'}
    </button>
  );
}
```

## 3. Create Payment Page

Create `frontend/src/pages/PaymentPage.jsx`:

```javascript
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, qrCode, amount, upiId, cafeName } = location.state || {};
  
  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitPayment = async () => {
    if (!utr || utr.length < 12) {
      alert('Please enter a valid UTR number (minimum 12 digits)');
      return;
    }

    try {
      setLoading(true);
      await api.submitPayment(orderId, utr);
      
      alert('Payment submitted successfully! Awaiting verification.');
      navigate('/order-status', { state: { orderId } });
      
    } catch (error) {
      alert('Payment submission failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) {
    return <div>No order found. Please create an order first.</div>;
  }

  return (
    <div className="payment-page">
      <h1>Complete Payment</h1>
      
      <div className="payment-details">
        <p>Order ID: {orderId}</p>
        <p>Amount: ₹{amount}</p>
        <p>Pay to: {upiId}</p>
      </div>

      <div className="qr-code">
        <h2>Scan QR Code to Pay</h2>
        <img src={qrCode} alt="Payment QR Code" />
      </div>

      <div className="utr-input">
        <h3>After Payment, Enter UTR Number</h3>
        <input
          type="text"
          placeholder="Enter 12-digit UTR number"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          maxLength={12}
        />
        <button onClick={handleSubmitPayment} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Payment'}
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
```

## 4. Create Order Status Page

Create `frontend/src/pages/OrderStatusPage.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

function OrderStatusPage() {
  const location = useLocation();
  const { orderId } = location.state || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await api.getOrder(orderId);
        setOrder(result.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
      // Poll every 10 seconds
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  const statusMessages = {
    pending: 'Order received, awaiting payment verification',
    preparing: 'Your order is being prepared',
    ready: 'Your order is ready for pickup!',
    completed: 'Order completed',
    cancelled: 'Order cancelled'
  };

  const paymentStatusMessages = {
    pending: 'Awaiting payment',
    verification_pending: 'Payment submitted, awaiting verification',
    paid: 'Payment verified',
    rejected: 'Payment rejected'
  };

  return (
    <div className="order-status">
      <h1>Order Status</h1>
      
      <div className="status-card">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {statusMessages[order.status]}</p>
        <p><strong>Payment:</strong> {paymentStatusMessages[order.paymentStatus]}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
      </div>

      <div className="order-items">
        <h2>Items</h2>
        {order.items.map((item, index) => (
          <div key={index}>
            {item.name} x {item.quantity} = ₹{item.price * item.quantity}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderStatusPage;
```

## 5. Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

For production:
```env
VITE_API_URL=https://api.yourcafe.com
```

## 6. Update Routes

In your `App.jsx`:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';
import OrderStatusPage from './pages/OrderStatusPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing routes */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-status" element={<OrderStatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 7. Admin Dashboard Integration

Create `frontend/src/pages/AdminDashboard.jsx`:

```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await api.adminLogin(email, password);
      setToken(result.data.token);
      localStorage.setItem('adminToken', result.data.token);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const result = await api.getAdminOrders(token);
      setOrders(result.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleVerifyPayment = async (orderId, approved) => {
    try {
      await api.verifyPayment(token, orderId, approved);
      fetchOrders();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(token, orderId, status);
      fetchOrders();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (!token) {
    return (
      <form onSubmit={handleLogin}>
        <h1>Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button onClick={() => {
        localStorage.removeItem('adminToken');
        setToken(null);
      }}>Logout</button>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <h3>Order #{order._id.slice(-6)}</h3>
            <p>Customer: {order.customerName}</p>
            <p>Table: {order.tableNumber}</p>
            <p>Amount: ₹{order.totalAmount}</p>
            <p>Payment: {order.paymentStatus}</p>
            <p>Status: {order.status}</p>
            {order.utr && <p>UTR: {order.utr}</p>}

            {order.paymentStatus === 'verification_pending' && (
              <div>
                <button onClick={() => handleVerifyPayment(order._id, true)}>
                  Approve Payment
                </button>
                <button onClick={() => handleVerifyPayment(order._id, false)}>
                  Reject Payment
                </button>
              </div>
            )}

            {order.paymentStatus === 'paid' && (
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
```

## Complete Flow Summary

1. Customer adds items to cart
2. Clicks "Order Now" → API creates order
3. Redirected to payment page with QR code
4. Customer scans QR and pays via UPI
5. Customer enters UTR number
6. Admin sees order in dashboard
7. Admin verifies payment
8. Admin updates order status (preparing → ready → completed)
9. Customer sees real-time status updates

## Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Test complete flow from cart to order completion
