# Café Website — Setup Guide

## Frontend

```bash
cd frontend
npm install   # or: pnpm install
npm run dev   # → http://localhost:5173
```

## Backend

```bash
cd backend
npm install
npm run dev   # → http://localhost:5000
```

## Admin Panel

URL: http://localhost:5173/admin/login  
Email: admin@cafe.com  
Password: admin123

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/orders | public | Place an order |
| GET | /admin/orders | Bearer | List orders |
| PATCH | /admin/orders/:id/status | Bearer | Update status |
| PATCH | /admin/orders/:id/verify-payment | Bearer | Verify payment |
| POST | /admin/login | public | Get token |
| GET | /api/menu | public | Get menu items |
| POST | /api/menu | Bearer | Add item |
| PUT | /api/menu/:id | Bearer | Edit item |
| DELETE | /api/menu/:id | Bearer | Delete item |

## Notes

- Backend stores data in `backend/data/orders.json` and `backend/data/menu.json` (no database needed)
- The auth token is a static secret defined in `backend/.env`
- Frontend uses Vite on port 5173; backend uses Express on port 5000
