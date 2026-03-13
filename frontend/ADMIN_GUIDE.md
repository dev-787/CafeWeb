# Admin Dashboard Guide

## Overview

The admin dashboard is now fully integrated with the backend API. You can manage orders and menu items through a clean, intuitive interface.

## Access Admin Panel

1. Navigate to: `http://localhost:5173/admin`
2. You'll be redirected to the login page

## Default Login Credentials

```
Email: admin@cafe.com
Password: admin123
```

**⚠️ Change these credentials in production!**

## Admin Features

### 1. Dashboard (`/admin/dashboard`)

View real-time statistics:
- Total Orders
- Pending Orders
- Preparing Orders
- Completed Orders

Auto-refreshes every 10 seconds.

### 2. Orders Management (`/admin/orders`)

**Features:**
- View all orders in real-time
- Filter by status (all, pending, preparing, ready, completed)
- Auto-refresh every 5 seconds

**Order Information Displayed:**
- Order ID
- Customer name and phone
- Table number
- Items ordered with quantities
- Total amount
- Payment status
- Order status
- UTR number (if submitted)
- Created timestamp

**Actions Available:**

For orders with `verification_pending` payment:
- ✓ Approve Payment
- ✗ Reject Payment

For orders with `paid` payment:
- 👨‍🍳 Start Preparing (pending → preparing)
- ✓ Mark Ready (preparing → ready)
- ✓ Complete Order (ready → completed)
- ✗ Cancel Order

### 3. Menu Management (`/admin/menu`)

**Features:**
- View all menu items
- Add new items
- Edit existing items
- Delete items
- Toggle availability

**Menu Item Fields:**
- Name (required)
- Price (required)
- Category (required): coffee, tea, snacks, desserts, beverages, meals
- Description (optional)
- Image URL (optional)
- Available (checkbox)

**Actions:**
- ✏️ Edit - Modify item details
- 🚫 Disable / ✓ Enable - Toggle availability
- 🗑️ Delete - Remove item permanently

## API Integration

All admin pages connect to the backend API:

### Authentication
- `POST /admin/login` - Admin login
- Token stored in localStorage
- Auto-redirect to login if token expires

### Orders
- `GET /admin/orders` - Fetch all orders
- `PATCH /admin/orders/:id/verify-payment` - Approve/reject payment
- `PATCH /admin/orders/:id/status` - Update order status

### Menu
- `GET /api/menu` - Fetch menu items
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

## Security

- All admin routes are protected
- JWT token required for API requests
- Auto-redirect to login if not authenticated
- Token stored securely in localStorage

## Error Handling

The admin panel handles:
- API request failures
- Invalid/expired tokens
- Empty data states
- Network errors

Error messages are displayed clearly to the user.

## Workflow Example

### Complete Order Flow:

1. **New Order Arrives**
   - Customer creates order from frontend
   - Order appears in admin dashboard with status: `pending`
   - Payment status: `pending`

2. **Customer Pays**
   - Customer scans QR code and pays
   - Customer submits UTR number
   - Payment status changes to: `verification_pending`
   - Order appears in admin orders page

3. **Admin Verifies Payment**
   - Admin checks bank/UPI app
   - Admin clicks "Approve Payment"
   - Payment status: `paid`
   - Order status: `preparing`

4. **Kitchen Prepares Order**
   - Admin clicks "Start Preparing" (if not auto-updated)
   - Order status: `preparing`

5. **Order Ready**
   - Admin clicks "Mark Ready"
   - Order status: `ready`
   - Customer can pick up order

6. **Order Completed**
   - Admin clicks "Complete Order"
   - Order status: `completed`

## Customization

### Change Colors

Edit the Tailwind classes in the components:
- Primary color: `bg-[#1C4D19]` (dark green)
- Hover color: `bg-[#2d7a26]` (lighter green)

### Add More Features

The admin API service (`frontend/src/services/adminApi.js`) can be extended with additional endpoints.

## Troubleshooting

### "Session expired" error
- Token has expired (24 hours)
- Login again to get new token

### Orders not loading
- Check backend is running on port 5000
- Verify VITE_API_URL in .env file
- Check browser console for errors

### Can't login
- Verify backend is running
- Check admin credentials in backend .env
- Ensure MongoDB is connected

## Development

Start both servers:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access admin at: `http://localhost:5173/admin`

## Production Deployment

1. Update `VITE_API_URL` in frontend/.env to production API URL
2. Change default admin credentials
3. Enable HTTPS
4. Set up proper CORS configuration
5. Implement rate limiting on backend

## Support

For issues or questions:
- Check backend logs
- Check browser console
- Verify API endpoints are responding
- Ensure MongoDB is connected
