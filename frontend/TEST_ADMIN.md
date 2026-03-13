# Admin Dashboard Testing Guide

## Prerequisites

1. Backend server running on `http://localhost:5000`
2. Frontend server running on `http://localhost:5173`
3. MongoDB connected

## Quick Test Checklist

### ✅ Test 1: Admin Login

1. Navigate to `http://localhost:5173/admin`
2. Should redirect to `/admin/login`
3. Enter credentials:
   - Email: `admin@cafe.com`
   - Password: `admin123`
4. Click "Sign In"
5. Should redirect to `/admin/dashboard`

**Expected Result:** Successfully logged in and redirected to dashboard

---

### ✅ Test 2: Dashboard Statistics

1. On dashboard page
2. Should see 4 stat cards:
   - Total Orders
   - Pending Orders
   - Preparing Orders
   - Completed Orders
3. Numbers should reflect actual data from backend

**Expected Result:** Statistics display correctly

---

### ✅ Test 3: View Orders

1. Click "Orders" in sidebar
2. Should navigate to `/admin/orders`
3. Should see list of all orders (if any exist)
4. Each order should show:
   - Order ID
   - Customer info
   - Items
   - Total amount
   - Payment status
   - Order status

**Expected Result:** Orders list displays correctly

---

### ✅ Test 4: Filter Orders

1. On orders page
2. Click filter buttons: All, Pending, Preparing, Ready, Completed
3. Orders should filter accordingly

**Expected Result:** Filtering works correctly

---

### ✅ Test 5: Payment Verification

**Setup:** Create a test order from customer side with UTR submitted

1. Find order with payment status "verification_pending"
2. Click "Approve Payment"
3. Order should update:
   - Payment status → "paid"
   - Order status → "preparing"

**Expected Result:** Payment verified successfully

---

### ✅ Test 6: Update Order Status

1. Find order with status "preparing"
2. Click "Mark Ready"
3. Status should change to "ready"
4. Click "Complete Order"
5. Status should change to "completed"

**Expected Result:** Status transitions work correctly

---

### ✅ Test 7: View Menu

1. Click "Menu" in sidebar
2. Should navigate to `/admin/menu`
3. Should see grid of menu items
4. Each item should show:
   - Name
   - Category
   - Price
   - Description
   - Availability status
   - Action buttons

**Expected Result:** Menu items display correctly

---

### ✅ Test 8: Add Menu Item

1. On menu page
2. Click "+ Add New Item"
3. Fill form:
   - Name: "Test Coffee"
   - Price: 199
   - Category: Coffee
   - Description: "Test item"
   - Available: checked
4. Click "Create"
5. Should see success message
6. New item should appear in grid

**Expected Result:** Menu item created successfully

---

### ✅ Test 9: Edit Menu Item

1. Find the test item created above
2. Click "Edit" button
3. Change price to 250
4. Click "Update"
5. Should see success message
6. Price should update in grid

**Expected Result:** Menu item updated successfully

---

### ✅ Test 10: Toggle Availability

1. Find any menu item
2. Click "Disable" button
3. Badge should change to "Unavailable"
4. Click "Enable" button
5. Badge should change to "Available"

**Expected Result:** Availability toggles correctly

---

### ✅ Test 11: Delete Menu Item

1. Find the test item
2. Click delete (🗑️) button
3. Confirm deletion
4. Should see success message
5. Item should disappear from grid

**Expected Result:** Menu item deleted successfully

---

### ✅ Test 12: Auto-Refresh

1. On orders page
2. Create a new order from customer side
3. Wait 5 seconds
4. New order should appear automatically

**Expected Result:** Auto-refresh works (5s for orders, 10s for dashboard)

---

### ✅ Test 13: Protected Routes

1. Click "Logout"
2. Should redirect to `/admin/login`
3. Try to access `/admin/dashboard` directly
4. Should redirect back to `/admin/login`

**Expected Result:** Protected routes work correctly

---

### ✅ Test 14: Invalid Login

1. On login page
2. Enter wrong credentials
3. Click "Sign In"
4. Should see error message
5. Should stay on login page

**Expected Result:** Invalid credentials rejected

---

### ✅ Test 15: Session Expiry

1. Login to admin
2. Open browser DevTools → Application → Local Storage
3. Delete `adminToken`
4. Try to perform any action (e.g., view orders)
5. Should redirect to login page

**Expected Result:** Session expiry handled correctly

---

## Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution:** Ensure backend is running on port 5000

### Issue: "Session expired"
**Solution:** Login again (token expires after 24 hours)

### Issue: Orders not showing
**Solution:** 
- Check MongoDB is connected
- Verify orders exist in database
- Check browser console for errors

### Issue: Menu items not loading
**Solution:**
- Run `npm run seed` in backend to create sample menu
- Check API endpoint is responding

### Issue: Blank admin page
**Solution:**
- Check browser console for errors
- Verify all admin files are created
- Ensure App.jsx has admin routes

## API Endpoints Being Used

```
POST   /admin/login                          - Admin login
GET    /admin/orders                         - Get all orders
PATCH  /admin/orders/:id/verify-payment     - Verify payment
PATCH  /admin/orders/:id/status             - Update order status
GET    /api/menu                             - Get menu items
POST   /api/menu                             - Create menu item
PUT    /api/menu/:id                         - Update menu item
DELETE /api/menu/:id                         - Delete menu item
```

## Browser Console Commands

Test API directly from browser console:

```javascript
// Check if token exists
localStorage.getItem('adminToken')

// Remove token (logout)
localStorage.removeItem('adminToken')

// Test API call
fetch('http://localhost:5000/admin/orders', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
  }
}).then(r => r.json()).then(console.log)
```

## Success Criteria

All 15 tests should pass for the admin dashboard to be considered fully functional.

✅ Admin can login
✅ Dashboard shows statistics
✅ Orders can be viewed and managed
✅ Payment verification works
✅ Order status updates work
✅ Menu items can be created
✅ Menu items can be edited
✅ Menu items can be deleted
✅ Availability can be toggled
✅ Auto-refresh works
✅ Protected routes work
✅ Error handling works
✅ Session management works
