# System Workflow

## Complete Order Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CUSTOMER FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. Browse Menu
   │
   ├─→ GET /api/menu
   │   Response: List of menu items
   │
2. Add Items to Cart (Frontend State)
   │
3. Fill Customer Details
   │   - Name
   │   - Phone (10 digits)
   │   - Table Number
   │
4. Click "Order Now"
   │
   ├─→ POST /api/orders
   │   Request: {
   │     customerName, phone, tableNumber,
   │     items: [{menuItemId, name, price, quantity}],
   │     totalAmount
   │   }
   │   Response: {
   │     orderId,
   │     totalAmount,
   │     paymentQR (base64 image),
   │     upiId,
   │     cafeName
   │   }
   │
5. Payment Page
   │   - Display QR Code
   │   - Show Amount: ₹500
   │   - Show UPI ID: devcafe@upi
   │
6. Customer Scans QR
   │   - Opens any UPI app (GPay, PhonePe, Paytm)
   │   - Amount pre-filled: ₹500
   │   - Pays to: devcafe@upi
   │
7. Customer Completes Payment
   │   - Gets 12-digit UTR number
   │
8. Customer Enters UTR
   │
   ├─→ PATCH /api/orders/:orderId/payment
   │   Request: { utr: "123456789012" }
   │   Response: {
   │     success: true,
   │     message: "Payment submitted. Awaiting verification."
   │   }
   │
9. Order Status Page
   │
   ├─→ GET /api/orders/:orderId (Poll every 10s)
   │   Response: {
   │     status: "pending" | "preparing" | "ready" | "completed",
   │     paymentStatus: "verification_pending" | "paid"
   │   }
   │
10. Order Ready Notification
    │   Status: "ready"
    │
11. Customer Picks Up Order
    │   Status: "completed"


┌─────────────────────────────────────────────────────────────────┐
│                          ADMIN FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. Admin Opens Dashboard
   │
2. Admin Login
   │
   ├─→ POST /admin/login
   │   Request: { email, password }
   │   Response: { token, admin: {id, email} }
   │
3. View All Orders
   │
   ├─→ GET /admin/orders (Auto-refresh every 5s)
   │   Headers: Authorization: Bearer <token>
   │   Response: {
   │     count: 10,
   │     data: [orders array]
   │   }
   │
4. New Order Appears
   │   - paymentStatus: "verification_pending"
   │   - status: "pending"
   │   - utr: "123456789012"
   │
5. Admin Verifies Payment
   │   - Checks bank/UPI app
   │   - Confirms UTR matches
   │   - Confirms amount matches
   │
6. Admin Approves Payment
   │
   ├─→ PATCH /admin/orders/:orderId/verify-payment
   │   Headers: Authorization: Bearer <token>
   │   Request: { approved: true }
   │   Response: {
   │     paymentStatus: "paid",
   │     status: "preparing"
   │   }
   │
7. Kitchen Prepares Order
   │
8. Admin Updates Status
   │
   ├─→ PATCH /admin/orders/:orderId/status
   │   Headers: Authorization: Bearer <token>
   │   Request: { status: "ready" }
   │   Response: { status: "ready" }
   │
9. Customer Picks Up
   │
10. Admin Marks Complete
    │
    ├─→ PATCH /admin/orders/:orderId/status
    │   Request: { status: "completed" }


┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE STATES                             │
└─────────────────────────────────────────────────────────────────┘

Order Created:
  status: "pending"
  paymentStatus: "pending"
  utr: ""

Customer Submits UTR:
  status: "pending"
  paymentStatus: "verification_pending"
  utr: "123456789012"

Admin Approves Payment:
  status: "preparing"
  paymentStatus: "paid"
  utr: "123456789012"

Order Ready:
  status: "ready"
  paymentStatus: "paid"

Order Completed:
  status: "completed"
  paymentStatus: "paid"


┌─────────────────────────────────────────────────────────────────┐
│                    STATUS TRANSITIONS                            │
└─────────────────────────────────────────────────────────────────┘

Order Status:
  pending → preparing → ready → completed
     ↓
  cancelled (if needed)

Payment Status:
  pending → verification_pending → paid
                                    ↓
                                rejected (if invalid)


┌─────────────────────────────────────────────────────────────────┐
│                      ERROR SCENARIOS                             │
└─────────────────────────────────────────────────────────────────┘

Scenario 1: Invalid Phone Number
  Request: { phone: "123" }
  Response: 400 Bad Request
  Message: "Please provide a valid 10-digit phone number"

Scenario 2: Invalid UTR
  Request: { utr: "123" }
  Response: 400 Bad Request
  Message: "Valid UTR number is required (minimum 12 characters)"

Scenario 3: Order Not Found
  Request: GET /api/orders/invalid_id
  Response: 404 Not Found
  Message: "Order not found"

Scenario 4: Unauthorized Admin Access
  Request: GET /admin/orders (no token)
  Response: 401 Unauthorized
  Message: "Access denied. No token provided."

Scenario 5: Payment Already Submitted
  Request: PATCH /api/orders/:id/payment (already submitted)
  Response: 400 Bad Request
  Message: "Payment already submitted for this order"


┌─────────────────────────────────────────────────────────────────┐
│                    TIMING EXPECTATIONS                           │
└─────────────────────────────────────────────────────────────────┘

Order Creation:        < 1 second
QR Generation:         < 1 second
Payment Submission:    < 1 second
Admin Verification:    Manual (1-5 minutes)
Status Update:         < 1 second
Order Preparation:     Manual (5-15 minutes)


┌─────────────────────────────────────────────────────────────────┐
│                    REAL-TIME UPDATES                             │
└─────────────────────────────────────────────────────────────────┘

Customer Side:
  - Poll GET /api/orders/:id every 10 seconds
  - Update UI when status changes

Admin Side:
  - Poll GET /admin/orders every 5 seconds
  - Show notification for new orders
  - Highlight orders needing verification


┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT VERIFICATION                          │
└─────────────────────────────────────────────────────────────────┘

Manual Verification Steps:
1. Admin sees order with UTR: "123456789012"
2. Admin opens bank/UPI app
3. Admin checks transaction history
4. Admin verifies:
   ✓ UTR matches
   ✓ Amount matches (₹500)
   ✓ Received to correct UPI ID
   ✓ Transaction successful
5. Admin clicks "Approve Payment"
6. Order moves to "preparing" status


┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY MEASURES                             │
└─────────────────────────────────────────────────────────────────┘

✓ JWT token for admin authentication
✓ Password hashing with bcrypt
✓ Input validation on all endpoints
✓ Phone number format validation
✓ UTR length validation
✓ Protected admin routes
✓ CORS enabled
✓ Environment variables for secrets
✓ No sensitive data in responses
✓ Manual payment verification


┌─────────────────────────────────────────────────────────────────┐
│                    SCALABILITY NOTES                             │
└─────────────────────────────────────────────────────────────────┘

Current Setup:
  - Single server instance
  - Manual payment verification
  - Polling for updates

Future Enhancements:
  - WebSocket for real-time updates
  - Automated payment verification (UPI API)
  - Multiple admin users
  - Order history and analytics
  - Customer accounts
  - Loyalty program
  - Push notifications
  - SMS notifications
  - Email receipts
```

## Quick Reference

### Customer Actions
- Browse menu → Add to cart → Order → Pay → Track → Pickup

### Admin Actions
- Login → View orders → Verify payment → Update status → Complete

### Key Endpoints
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/payment` - Submit UTR
- `POST /admin/login` - Admin login
- `GET /admin/orders` - View all orders
- `PATCH /admin/orders/:id/verify-payment` - Verify payment
- `PATCH /admin/orders/:id/status` - Update status

### Status Values
- Order: pending, preparing, ready, completed, cancelled
- Payment: pending, verification_pending, paid, rejected
