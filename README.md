# 🛒 SHOPEASY – Full-Stack E-Commerce Web Application

SHOPEASY is a modern and responsive **full-stack e-commerce web application** powered by **React, Vite, Node.js, Express, and MySQL**. It includes secure JWT‑based authentication, role‑based authorization, and a complete admin dashboard for managing products, users, and orders.  
The project delivers a polished user interface, smooth navigation, and a scalable architecture suitable for real‑world online shopping platforms.

---

## 🚀 Project Overview

SHOPEASY enables users to:
- Browse products by category
- View detailed product information
- Navigate through a clean and user-friendly interface
- Interact with a backend system that manages products and data

The frontend is developed using **React** with **Vite**, while the backend is powered by **Node.js** and **MySQL** with an Express API; together they form a secure and maintainable full-stack e-commerce system.

---

## 🧩 Features

### Frontend
- ⚡ Fast development and build using **Vite**
- 🧱 Component-based architecture with **React**
- 📱 Fully responsive design
- 🖼️ Centered and optimized product images
- 🧭 Navigation bar and footer
- 📄 Pages: Home, Products, Product Details, About Us, Contact Us
- 🎨 Styled using **plain CSS (no Tailwind CSS)**

### Backend
- 🌐 RESTful API built with **Node.js** and **Express**
- 🗄️ **MySQL** database for persistent data storage
- 🔄 API communication between frontend and backend
- 📦 Modular and scalable backend structure

---

## � Setup & Configuration

1. **Clone repository**
   ```bash
   git clone <repo-url> shop
   cd shop
   ```

2. **Install dependencies**
   - Frontend: `npm install` in `shop/`
   - Backend: `npm install` in `shop/backend/`

3. **Configure environment**
   - Copy `backend/.env.example` to `backend/.env` (create if missing) and set:
     ```dotenv
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=your_db_user
     DB_PASSWORD=your_password
     DB_NAME=shopeasy
     JWT_SECRET=change_this
     PORT=4000
     FRONTEND_ORIGIN=http://localhost:5173
     ```
   - Frontend may set `VITE_API_URL` in `.env` at project root to point to the backend URL (default `http://localhost:4000`).

4. **Initialize database**
   ```bash
   node backend/setup_db.js
   # optionally run sample data script
   node backend/create_sample_data.js
   ```
   The `setup_db.js` script will alter the `products` table if it already exists, adding fields such as `category`, `active`, and `images`.

5. **Run development servers**
   - Backend: `npm run dev` from `shop/backend`
   - Frontend: `npm run dev` from `shop/`

---

## �🛠️ Technologies Used

### Frontend
- React.js
- Vite
- JavaScript (ES6+)
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MySQL

---

## 📁 Project Structure

```bash
shopeasy/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   ├── database/
│   ├── server.js
│   └── package.json
│
└── README.md
