# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cafe-db
JWT_SECRET=your_super_secret_jwt_key_change_this
UPI_ID=yourupi@upi
CAFE_NAME=YourCafeName
ADMIN_EMAIL=admin@cafe.com
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

### 3. Start MongoDB

If using local MongoDB:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud):
- Create free cluster at mongodb.com
- Get connection string
- Update MONGODB_URI in .env

### 4. Seed Sample Menu (Optional)

```bash
npm run seed
```

This creates 10 sample menu items.

### 5. Start Server

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

Server runs at: http://localhost:5000

### 6. Test API

Health check:
```bash
curl http://localhost:5000/health
```

Get menu:
```bash
curl http://localhost:5000/api/menu
```

## Testing the Complete Flow

### Step 1: Admin Login

```bash
curl -X POST http://localhost:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cafe.com",
    "password": "admin123"
  }'
```

Save the token from response.

### Step 2: Create Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "phone": "9876543210",
    "tableNumber": "5",
    "items": [
      {
        "menuItemId": "MENU_ITEM_ID_HERE",
        "name": "Cappuccino",
        "price": 150,
        "quantity": 2
      }
    ],
    "totalAmount": 300
  }'
```

Response includes QR code and orderId.

### Step 3: Submit Payment

```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID_HERE/payment \
  -H "Content-Type: application/json" \
  -d '{
    "utr": "123456789012"
  }'
```

### Step 4: Admin Views Orders

```bash
curl http://localhost:5000/admin/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 5: Admin Verifies Payment

```bash
curl -X PATCH http://localhost:5000/admin/orders/ORDER_ID_HERE/verify-payment \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "approved": true
  }'
```

### Step 6: Admin Updates Order Status

```bash
curl -X PATCH http://localhost:5000/admin/orders/ORDER_ID_HERE/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "preparing"
  }'
```

## Frontend Integration

Update your frontend to call these endpoints:

```javascript
// In your Order Now handler
const handleOrderNow = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'John Doe',
        phone: '9876543210',
        tableNumber: '5',
        items: cartItems,
        totalAmount: calculateTotal()
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Navigate to payment page with QR code
      navigate('/payment', {
        state: {
          orderId: result.data.orderId,
          qrCode: result.data.paymentQR,
          amount: result.data.totalAmount
        }
      });
    }
  } catch (error) {
    console.error('Order creation failed:', error);
  }
};
```

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

Solution: Start MongoDB service or check MONGODB_URI

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

Solution: Change PORT in .env or kill process using port 5000

### JWT Token Invalid

```
Error: Invalid or expired token
```

Solution: Login again to get new token

## Production Deployment

1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Change default admin password
4. Use MongoDB Atlas
5. Enable HTTPS
6. Add rate limiting
7. Set up logging
8. Use PM2 for process management

```bash
npm install -g pm2
pm2 start server.js --name cafe-api
pm2 save
pm2 startup
```

## Support

For issues, check:
- Server logs
- MongoDB connection
- Environment variables
- API documentation in README.md
