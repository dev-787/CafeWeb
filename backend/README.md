# Cafe Backend API

Complete backend system for café ordering with UPI QR payment integration.

## Features

- Menu management (CRUD operations)
- Order creation and tracking
- UPI QR code generation for payments
- Payment verification system
- Admin authentication with JWT
- Order status management

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- QR Code Generation
- bcryptjs for password hashing

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cafe-db
JWT_SECRET=your_secure_jwt_secret
UPI_ID=yourupi@upi
CAFE_NAME=YourCafeName
ADMIN_EMAIL=admin@cafe.com
ADMIN_PASSWORD=admin123
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Menu Routes

**GET /api/menu**
- Get all menu items
- Query params: `category`, `available`

**POST /api/menu** (Admin only)
- Create new menu item
- Headers: `Authorization: Bearer <token>`

**PUT /api/menu/:id** (Admin only)
- Update menu item

**DELETE /api/menu/:id** (Admin only)
- Delete menu item

### Order Routes

**POST /api/orders**
- Create new order
- Body:
```json
{
  "customerName": "John Doe",
  "phone": "9876543210",
  "tableNumber": "5",
  "items": [
    {
      "menuItemId": "menu_id",
      "name": "Latte",
      "price": 200,
      "quantity": 2
    }
  ],
  "totalAmount": 400
}
```
- Response includes QR code data URL

**PATCH /api/orders/:id/payment**
- Submit payment UTR
- Body:
```json
{
  "utr": "123456789012"
}
```

**GET /api/orders/:id**
- Get order details

### Admin Routes

**POST /admin/login**
- Admin login
- Body:
```json
{
  "email": "admin@cafe.com",
  "password": "admin123"
}
```

**GET /admin/orders** (Protected)
- Get all orders
- Headers: `Authorization: Bearer <token>`
- Query params: `status`, `paymentStatus`

**PATCH /admin/orders/:id/status** (Protected)
- Update order status
- Body:
```json
{
  "status": "preparing"
}
```

**PATCH /admin/orders/:id/verify-payment** (Protected)
- Verify payment
- Body:
```json
{
  "approved": true
}
```

## Order Status Flow

1. `pending` - Order created
2. `preparing` - Order being prepared
3. `ready` - Order ready for pickup
4. `completed` - Order delivered
5. `cancelled` - Order cancelled

## Payment Status Flow

1. `pending` - Awaiting payment
2. `verification_pending` - UTR submitted, awaiting admin verification
3. `paid` - Payment verified
4. `rejected` - Payment rejected

## Default Admin Credentials

- Email: admin@cafe.com
- Password: admin123

**Change these in production!**

## Frontend Integration Example

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
// data.paymentQR contains QR code image
// data.orderId for tracking

// Submit UTR after payment
await fetch(`http://localhost:5000/api/orders/${orderId}/payment`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ utr: '123456789012' })
});
```

## Project Structure

```
backend/
├── controllers/
│   ├── authController.js
│   ├── menuController.js
│   └── orderController.js
├── models/
│   ├── Admin.js
│   ├── Menu.js
│   └── Order.js
├── routes/
│   ├── adminRoutes.js
│   ├── menuRoutes.js
│   └── orderRoutes.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   └── generateQR.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Security Notes

- Always use HTTPS in production
- Change default admin credentials
- Use strong JWT secret
- Validate all inputs
- Implement rate limiting
- Add request logging

## License

ISC
