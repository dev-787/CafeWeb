# ✅ Backend Setup Complete

## What Was Built

A complete production-ready backend system for your café ordering website with:

- **Node.js + Express.js** REST API
- **MongoDB** database with Mongoose ODM
- **UPI QR Code** payment integration (no external gateway)
- **JWT Authentication** for admin panel
- **Order Management** system
- **Menu Management** CRUD operations

## 📁 Project Structure

```
backend/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── menuController.js
│   └── orderController.js
├── models/              # Database schemas
│   ├── Admin.js
│   ├── Menu.js
│   └── Order.js
├── routes/              # API endpoints
│   ├── adminRoutes.js
│   ├── menuRoutes.js
│   └── orderRoutes.js
├── middleware/          # Auth middleware
│   └── authMiddleware.js
├── utils/               # Helper functions
│   └── generateQR.js    # UPI QR generation
├── scripts/             # Utility scripts
│   ├── seedMenu.js      # Sample data
│   └── testSetup.js     # Config test
├── server.js            # Main server file
├── package.json
├── .env.example
└── Documentation files
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cafe-db
JWT_SECRET=your_secure_secret_key
UPI_ID=yourupi@upi
CAFE_NAME=YourCafeName
ADMIN_EMAIL=admin@cafe.com
ADMIN_PASSWORD=admin123
```

### 3. Test Configuration

```bash
npm run test-setup
```

### 4. Seed Sample Menu (Optional)

```bash
npm run seed
```

### 5. Start Server

```bash
npm run dev
```

Server runs at: **http://localhost:5000**

## 📡 API Endpoints

### Public Endpoints

- `GET /api/menu` - Get all menu items
- `POST /api/orders` - Create new order (returns QR code)
- `PATCH /api/orders/:id/payment` - Submit UTR after payment
- `GET /api/orders/:id` - Get order details

### Admin Endpoints (Protected)

- `POST /admin/login` - Admin login
- `GET /admin/orders` - Get all orders
- `PATCH /admin/orders/:id/status` - Update order status
- `PATCH /admin/orders/:id/verify-payment` - Verify payment

## 🔄 Complete Customer Flow

1. **Customer orders** → Frontend sends cart to `POST /api/orders`
2. **Backend creates order** → Returns QR code with exact amount
3. **Customer scans QR** → Pays via any UPI app
4. **Customer enters UTR** → `PATCH /api/orders/:id/payment`
5. **Admin verifies** → `PATCH /admin/orders/:id/verify-payment`
6. **Admin updates status** → preparing → ready → completed

## 🔐 Default Admin Credentials

```
Email: admin@cafe.com
Password: admin123
```

**⚠️ Change these in production!**

## 📚 Documentation Files

- **README.md** - Complete API documentation
- **QUICKSTART.md** - Step-by-step setup guide
- **API_EXAMPLES.md** - Request/response examples
- **FRONTEND_INTEGRATION.md** - React integration guide
- **DEPLOYMENT.md** - Production deployment guide
- **Cafe_API.postman_collection.json** - Postman collection for testing

## 🧪 Testing with Postman

1. Import `Cafe_API.postman_collection.json` into Postman
2. Run "Admin Login" to get token (auto-saved)
3. Test all endpoints with pre-configured requests

## 🔗 Frontend Integration

See `FRONTEND_INTEGRATION.md` for complete React integration examples.

Quick example:

```javascript
// Create order
const response = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'John',
    phone: '9876543210',
    tableNumber: '5',
    items: cartItems,
    totalAmount: 400
  })
});

const { data } = await response.json();
// data.paymentQR contains QR code image (base64)
// data.orderId for tracking
```

## 💳 UPI Payment Flow

1. Backend generates UPI link: `upi://pay?pa=yourupi@upi&pn=CafeName&am=400&cu=INR`
2. Converts to QR code using `qrcode` library
3. Returns base64 image to frontend
4. Customer scans with any UPI app (GPay, PhonePe, Paytm, etc.)
5. Customer pays exact amount
6. Customer submits 12-digit UTR number
7. Admin manually verifies payment

## 📊 Database Models

### Order Model
- Customer info (name, phone, table)
- Items array with quantities
- Total amount
- Payment status (pending → verification_pending → paid/rejected)
- Order status (pending → preparing → ready → completed)
- UTR number

### Menu Model
- Name, price, image, category
- Description, availability

### Admin Model
- Email, hashed password
- JWT authentication

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcryptjs
- **QR Generation:** qrcode library
- **Security:** CORS, input validation

## 📦 NPM Scripts

```bash
npm start          # Production mode
npm run dev        # Development with auto-reload
npm run seed       # Seed sample menu items
npm run test-setup # Test environment configuration
```

## 🔧 Next Steps

1. ✅ Backend is ready
2. Update frontend to call these APIs (see FRONTEND_INTEGRATION.md)
3. Test complete flow locally
4. Deploy to production (see DEPLOYMENT.md)
5. Change default admin password
6. Add your UPI ID

## 🐛 Troubleshooting

**MongoDB connection error?**
- Start MongoDB: `mongod` or use MongoDB Atlas

**Port 5000 in use?**
- Change PORT in .env file

**QR not generating?**
- Check UPI_ID format in .env
- Verify qrcode package installed

## 📞 Support

Check documentation files for detailed guides:
- Setup issues → QUICKSTART.md
- API usage → API_EXAMPLES.md
- Frontend → FRONTEND_INTEGRATION.md
- Deployment → DEPLOYMENT.md

## ✨ Features Implemented

✅ Complete REST API
✅ UPI QR code generation
✅ Order management
✅ Payment verification
✅ Admin authentication
✅ Menu CRUD operations
✅ Input validation
✅ Error handling
✅ MongoDB integration
✅ JWT security
✅ Production-ready code
✅ Comprehensive documentation

---

**Your backend is ready to use! Start the server and begin testing.** 🎉
