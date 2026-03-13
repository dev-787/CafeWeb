# Complete Integration Guide

## System Architecture

```
Frontend (React) → Backend API (Express) → MongoDB
                ↓
            UPI Payment
                ↓
         Admin Dashboard
```

## Step-by-Step Integration

### Phase 1: Backend Setup (DONE ✅)

All backend files are created and ready to use.

### Phase 2: Start Backend Server

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run test-setup
npm run seed
npm run dev
```

### Phase 3: Frontend Integration

#### 1. Create API Service File

Create `frontend/src/services/api.js` - see FRONTEND_INTEGRATION.md

#### 2. Update Cart Component

Replace the `alert("order placed")` with actual API call:

```javascript
// In your cart component
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const handleOrderNow = async () => {
  try {
    const orderData = {
      customerName: "Customer Name", // Get from form
      phone: "9876543210",           // Get from form
      tableNumber: "5",              // Get from form
      items: cartItems.map(item => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: calculateTotal()
    };
    
    const result = await api.createOrder(orderData);
    
    // Navigate to payment page
    navigate('/payment', {
      state: {
        orderId: result.data.orderId,
        qrCode: result.data.paymentQR,
        amount: result.data.totalAmount
      }
    });
  } catch (error) {
    alert('Order failed: ' + error.message);
  }
};
```

#### 3. Create Payment Page

Create `frontend/src/pages/PaymentPage.jsx` - see FRONTEND_INTEGRATION.md

This page will:
- Display QR code
- Show amount and UPI ID
- Accept UTR input
- Submit payment confirmation

#### 4. Create Order Status Page

Create `frontend/src/pages/OrderStatusPage.jsx` - see FRONTEND_INTEGRATION.md

This page will:
- Show order status
- Poll for updates every 10 seconds
- Display payment verification status

#### 5. Create Admin Dashboard

Create `frontend/src/pages/AdminDashboard.jsx` - see FRONTEND_INTEGRATION.md

This page will:
- Admin login
- View all orders
- Verify payments
- Update order status

### Phase 4: Testing

#### Test 1: Create Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "phone": "9876543210",
    "tableNumber": "5",
    "items": [{
      "menuItemId": "MENU_ID",
      "name": "Coffee",
      "price": 100,
      "quantity": 2
    }],
    "totalAmount": 200
  }'
```

#### Test 2: Submit Payment

```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID/payment \
  -H "Content-Type: application/json" \
  -d '{"utr": "123456789012"}'
```

#### Test 3: Admin Login

```bash
curl -X POST http://localhost:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cafe.com",
    "password": "admin123"
  }'
```

#### Test 4: Verify Payment

```bash
curl -X PATCH http://localhost:5000/admin/orders/ORDER_ID/verify-payment \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"approved": true}'
```

### Phase 5: Environment Configuration

#### Frontend .env

```env
VITE_API_URL=http://localhost:5000
```

#### Backend .env

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cafe-db
JWT_SECRET=your_secure_secret_key_here
UPI_ID=yourupi@upi
CAFE_NAME=YourCafeName
ADMIN_EMAIL=admin@cafe.com
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

## Complete User Journey

### Customer Side

1. **Browse Menu** → GET /api/menu
2. **Add to Cart** → Local state management
3. **Fill Details** → Name, phone, table number
4. **Click Order Now** → POST /api/orders
5. **View QR Code** → Display returned QR image
6. **Scan & Pay** → Use any UPI app
7. **Enter UTR** → PATCH /api/orders/:id/payment
8. **Track Order** → GET /api/orders/:id (poll every 10s)
9. **Receive Order** → When status = "ready"

### Admin Side

1. **Login** → POST /admin/login
2. **View Orders** → GET /admin/orders
3. **See New Order** → paymentStatus = "verification_pending"
4. **Verify Payment** → Check bank/UPI app
5. **Approve Payment** → PATCH /admin/orders/:id/verify-payment
6. **Update Status** → PATCH /admin/orders/:id/status
   - pending → preparing
   - preparing → ready
   - ready → completed

## Data Flow Diagram

```
Customer Cart
     ↓
POST /api/orders
     ↓
Order Created (status: pending, payment: pending)
     ↓
QR Code Generated
     ↓
Customer Scans & Pays
     ↓
Customer Enters UTR
     ↓
PATCH /api/orders/:id/payment
     ↓
Order Updated (payment: verification_pending)
     ↓
Admin Sees Order
     ↓
Admin Verifies Payment
     ↓
PATCH /admin/orders/:id/verify-payment
     ↓
Order Updated (payment: paid, status: preparing)
     ↓
Admin Updates Status
     ↓
PATCH /admin/orders/:id/status
     ↓
Order Completed
```

## API Response Examples

### Create Order Response

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "65f1a2b3c4d5e6f7g8h9i0j3",
    "totalAmount": 500,
    "paymentQR": "data:image/png;base64,iVBORw0KGgo...",
    "upiId": "devcafe@upi",
    "cafeName": "DevCafe"
  }
}
```

### Get Orders Response (Admin)

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "customerName": "John Doe",
      "phone": "9876543210",
      "tableNumber": "5",
      "items": [...],
      "totalAmount": 500,
      "paymentStatus": "verification_pending",
      "utr": "123456789012",
      "status": "pending",
      "createdAt": "2024-03-10T10:30:00.000Z"
    }
  ]
}
```

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Use environment variables
- [ ] Never commit .env file
- [ ] Sanitize database queries
- [ ] Add CORS whitelist in production

## Performance Optimization

1. **Database Indexing**
```javascript
// Add to models
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
menuSchema.index({ category: 1, available: 1 });
```

2. **Caching**
- Cache menu items (rarely change)
- Use Redis for session management

3. **Pagination**
- Implement for admin orders list
- Limit results per page

## Monitoring

### Health Check

```bash
curl http://localhost:5000/health
```

### Check Logs

```bash
# Development
npm run dev

# Production with PM2
pm2 logs cafe-api
```

## Troubleshooting

### Issue: Order creation fails

**Check:**
- MongoDB is running
- All required fields provided
- Menu item IDs are valid

### Issue: QR code not displaying

**Check:**
- UPI_ID is set in .env
- qrcode package installed
- Response contains paymentQR field

### Issue: Admin can't login

**Check:**
- Admin exists in database
- JWT_SECRET is set
- Password is correct

### Issue: Payment verification not working

**Check:**
- Valid JWT token in Authorization header
- Order exists
- Payment status is "verification_pending"

## Production Deployment

See DEPLOYMENT.md for detailed deployment instructions.

Quick checklist:
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Use PM2 or similar
- [ ] Set up CI/CD

## Support Resources

- **README.md** - Complete API documentation
- **QUICKSTART.md** - Setup instructions
- **API_EXAMPLES.md** - Request/response examples
- **FRONTEND_INTEGRATION.md** - React integration
- **DEPLOYMENT.md** - Production deployment
- **Postman Collection** - API testing

## Next Steps

1. ✅ Backend is complete
2. ⏳ Integrate frontend with API
3. ⏳ Test complete flow
4. ⏳ Deploy to production
5. ⏳ Monitor and optimize

---

**Everything is ready! Start integrating the frontend with the backend API.** 🚀
