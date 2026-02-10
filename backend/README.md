# Shopeasy Backend

Express + MySQL backend for Shopeasy.

Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies: `npm install`.
3. Create the database and run the SQL in `sql/schema.sql`.
4. Start server: `npm run dev` (needs `nodemon`) or `npm start`.

API

- `POST /api/auth/register` - register customer
- `POST /api/auth/login` - login, returns JWT
- `GET /api/products` - list products
- `POST /api/products` - create product (admin)
- `PUT /api/products/:id` - update product (admin)
- `DELETE /api/products/:id` - delete product (admin)
- Cart and Orders under `/api/cart` and `/api/orders`.
