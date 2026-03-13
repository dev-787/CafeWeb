# 🚀 Quick Start - Admin Dashboard

## Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

## Access Admin

**URL:** http://localhost:5173/admin

**Login:**
- Email: `admin@cafe.com`
- Password: `admin123`

## Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Login page |
| `/admin/dashboard` | Statistics overview |
| `/admin/orders` | Manage orders |
| `/admin/menu` | Manage menu items |

## Quick Actions

### View Orders
1. Click "Orders" in sidebar
2. See all orders with details
3. Filter by status if needed

### Verify Payment
1. Find order with "verification_pending"
2. Click "Approve Payment"
3. Order moves to "preparing"

### Update Order Status
1. Click status action buttons:
   - "Start Preparing" → preparing
   - "Mark Ready" → ready
   - "Complete Order" → completed

### Add Menu Item
1. Click "Menu" in sidebar
2. Click "+ Add New Item"
3. Fill form and submit

### Edit Menu Item
1. Find item in menu
2. Click "Edit" button
3. Update and save

## Features

✅ Real-time order updates (5s refresh)
✅ Dashboard statistics (10s refresh)
✅ Payment verification
✅ Order status management
✅ Menu CRUD operations
✅ Protected routes
✅ Auto-logout on token expiry

## Troubleshooting

**Can't login?**
- Check backend is running on port 5000
- Verify MongoDB is connected

**Orders not showing?**
- Create test order from customer side
- Check backend logs

**Blank page?**
- Check browser console
- Verify all files created
- Clear browser cache

## API Endpoints

```
POST   /admin/login
GET    /admin/orders
PATCH  /admin/orders/:id/verify-payment
PATCH  /admin/orders/:id/status
GET    /api/menu
POST   /api/menu
PUT    /api/menu/:id
DELETE /api/menu/:id
```

## Files Created

```
frontend/
├── src/
│   ├── services/adminApi.js
│   ├── app/
│   │   ├── components/admin/
│   │   │   ├── AdminLayout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── pages/admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminOrders.jsx
│   │       └── AdminMenu.jsx
│   └── App.jsx (updated)
└── .env
```

## Next Steps

1. ✅ Start both servers
2. ✅ Login to admin panel
3. ✅ Test all features
4. ✅ Customize as needed
5. ✅ Deploy to production

**Your admin dashboard is ready!** 🎉

For detailed documentation, see:
- `ADMIN_FRONTEND_COMPLETE.md` - Complete overview
- `frontend/ADMIN_GUIDE.md` - Usage guide
- `frontend/TEST_ADMIN.md` - Testing checklist
