# API Response Examples

## 1. Create Order

**Request:**
```http
POST /api/orders
Content-Type: application/json

{
  "customerName": "Dev Kumar",
  "phone": "7984971610",
  "tableNumber": "5",
  "items": [
    {
      "menuItemId": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Cappuccino",
      "price": 150,
      "quantity": 2
    },
    {
      "menuItemId": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Chocolate Cake",
      "price": 200,
      "quantity": 1
    }
  ],
  "totalAmount": 500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "65f1a2b3c4d5e6f7g8h9i0j3",
    "totalAmount": 500,
    "paymentQR": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "upiId": "devcafe@upi",
    "cafeName": "DevCafe"
  }
}
```

## 2. Submit Payment UTR

**Request:**
```http
PATCH /api/orders/65f1a2b3c4d5e6f7g8h9i0j3/payment
Content-Type: application/json

{
  "utr": "123456789012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment submitted successfully. Awaiting verification.",
  "data": {
    "orderId": "65f1a2b3c4d5e6f7g8h9i0j3",
    "paymentStatus": "verification_pending"
  }
}
```

## 3. Admin Login

**Request:**
```http
POST /admin/login
Content-Type: application/json

{
  "email": "admin@cafe.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j4",
      "email": "admin@cafe.com"
    }
  }
}
```

## 4. Get All Orders (Admin)

**Request:**
```http
GET /admin/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "customerName": "Dev Kumar",
      "phone": "7984971610",
      "tableNumber": "5",
      "items": [
        {
          "menuItemId": {
            "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
            "name": "Cappuccino",
            "price": 150,
            "category": "coffee"
          },
          "name": "Cappuccino",
          "price": 150,
          "quantity": 2
        }
      ],
      "totalAmount": 500,
      "paymentMethod": "upi_qr",
      "paymentStatus": "verification_pending",
      "utr": "123456789012",
      "status": "pending",
      "createdAt": "2024-03-10T10:30:00.000Z",
      "updatedAt": "2024-03-10T10:35:00.000Z"
    }
  ]
}
```

## 5. Verify Payment (Admin)

**Request:**
```http
PATCH /admin/orders/65f1a2b3c4d5e6f7g8h9i0j3/verify-payment
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "approved": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment approved successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "customerName": "Dev Kumar",
    "paymentStatus": "paid",
    "status": "preparing",
    "utr": "123456789012"
  }
}
```

## 6. Update Order Status (Admin)

**Request:**
```http
PATCH /admin/orders/65f1a2b3c4d5e6f7g8h9i0j3/status
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "ready"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "status": "ready",
    "customerName": "Dev Kumar",
    "tableNumber": "5"
  }
}
```

## 7. Get All Menu Items

**Request:**
```http
GET /api/menu?category=coffee&available=true
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Cappuccino",
      "price": 150,
      "image": "https://example.com/cappuccino.jpg",
      "category": "coffee",
      "description": "Rich espresso with steamed milk",
      "available": true,
      "createdAt": "2024-03-10T08:00:00.000Z"
    }
  ]
}
```

## 8. Create Menu Item (Admin)

**Request:**
```http
POST /api/menu
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Espresso",
  "price": 100,
  "image": "https://example.com/espresso.jpg",
  "category": "coffee",
  "description": "Strong Italian coffee",
  "available": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "name": "Espresso",
    "price": 100,
    "category": "coffee",
    "available": true
  }
}
```

## Error Response Examples

**400 Bad Request:**
```json
{
  "success": false,
  "message": "All fields are required"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Order not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Error creating order",
  "error": "Validation failed: phone: Please provide a valid 10-digit phone number"
}
```
