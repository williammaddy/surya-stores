# 📚 Surya Stores — Full-Stack Stationery & Book Store Management Platform

A modern, freelance-grade **MERN (MongoDB, Express.js, React.js, Node.js)** web application built for **Surya Stores**, a premier local stationery, book, and school guide retail destination.

---

## 🌟 Key Features

### 🛒 Customer Storefront
* **Live Product Catalog**: Browse stationery, textbooks, CBSE school guides, educational toys, and office supplies with instant faceted filtering by Category, Brand, Price, and In-Stock status.
* **Instant Keyword Search & Sorting**: Real-time product search with sorting by Newest, Price (Low-to-High / High-to-Low), and Title.
* **Product Details View**: High-resolution image showcase, stock availability indicators, live quantity stepper, specifications, and related items recommendation.
* **Interactive Shopping Cart**: Line item quantity modification, instant INR (`₹`) subtotal calculation, and persistence in `localStorage`.
* **Zero-Card Checkout (COD / Store Pickup)**: Customer details autofilled from profile, address review, and order placement with **Cash / UPI on Delivery**.
* **Direct WhatsApp Integration**: 1-click WhatsApp buttons with pre-filled order confirmation (`"Hello Surya Stores, I have submitted order SURYA-2026-0001..."`) and custom booklist inquiry templates.
* **Customer Authentication & Order Tracking**: Customer registration, secure login, profile editor, and complete past order receipts history (`/orders`).

### 🛡️ Admin & Store Management Portal
* **Protected Role-Based Access Control**: Strict JWT token verification (`role: 'admin'`) with code-splitting for admin bundles.
* **Executive Dashboard**: Real-time KPI metrics (Total Orders, Pending Orders, Completed Orders, Revenue, Customer count, Active items), Low-Stock alerts list, and Recent Orders table.
* **Product Inventory Management**: Full CRUD, stock updater, active/inactive toggles, SKU generators, and image links.
* **Department & Category Management**: Dynamic category CRUD with delete safety checks that prevent deletion of categories containing active products.
* **Order Dispatch & Workflow**: Full order lifecycle management (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Completed` / `Cancelled`) with automatic inventory restock upon order cancellation.
* **Customer Directory**: View customer database with lifetime order counts and full purchase history modal.
* **Store Settings Editor**: Update Store Name, Contact Phone, WhatsApp Order Number, Email, Physical Address, and Business Hours live in MongoDB.

---

## 🏗️ System Architecture & Tech Stack

```
Surya Store/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection with retry & error handling
│   ├── controllers/
│   │   ├── authController.js     # Customer/Admin registration, login, profile
│   │   ├── productController.js  # Search, filter, pagination, admin CRUD
│   │   ├── categoryController.js # Dynamic categories with product count
│   │   ├── orderController.js    # Backend price calculation & atomic stock decrement
│   │   ├── userController.js     # Customer directory & dashboard analytics
│   │   └── settingsController.js # Configurable store contact and hours
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT extraction & authentication
│   │   ├── adminMiddleware.js    # Role validation (admin only)
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── User.js               # Customer & Admin schemas with bcrypt hashing
│   │   ├── Category.js           # Departments schema with auto-slugs
│   │   ├── Product.js            # Catalog schema with compound text indexes
│   │   ├── Order.js              # Order records (SURYA-YYYY-XXXX)
│   │   └── Settings.js           # Store contact, hours, and alert thresholds
│   ├── utils/
│   │   ├── generateOrderNumber.js# Sequential human-readable order numbers
│   │   └── email.js              # Nodemailer notification helper with simulation
│   ├── seed.js                   # MongoDB database seeder
│   ├── test_api.js               # Automated 11-step end-to-end test suite
│   ├── server.js                 # Express application entrypoint
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/           # Navbar, Footer, ProductCard, CategoryCard, Skeletons, Modals
    │   ├── context/              # AuthContext, CartContext, SettingsContext, ToastContext
    │   ├── layouts/              # CustomerLayout, AdminLayout
    │   ├── pages/
    │   │   ├── customer/         # Home, Products, ProductDetails, Cart, Checkout, OrderSuccess, Orders, Profile, Login, Register, About, Contact
    │   │   └── admin/            # AdminLogin, AdminDashboard, AdminProducts, AdminCategories, AdminOrders, AdminCustomers, AdminSettings
    │   ├── services/             # Axios API base client & endpoint modules
    │   ├── utils/                # formatCurrency (₹ INR formatter)
    │   ├── App.jsx               # Route definitions & guards
    │   └── main.jsx
    └── vite.config.js            # Vite proxy configuration
```

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
* **Node.js**: v18.0.0+
* **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install

# Seed sample data (Admin, 6 Categories, 22+ Products, 2 Orders, Store Settings)
npm run seed

# Run automated end-to-end API test suite
npm test

# Start backend server
npm run dev
```
> Backend runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
> Frontend runs on `http://localhost:5173`

---

## 🔑 Default Credentials (Seed Data)

| Role | Email | Password | Access Path |
| :--- | :--- | :--- | :--- |
| **Store Admin** | `admin@suryastores.com` | `admin123` | `/admin/login` or `/admin` |
| **Demo Customer** | `customer@gmail.com` | `customer123` | `/login` |

*(1-Click Demo buttons are available on both customer and admin login screens for instant evaluation)*

---

## 🔐 Security Best Practices Implemented

1. **Backend-Calculated Order Totals**: All product prices and order subtotals are verified and calculated from MongoDB on the server. Frontend prices are never trusted.
2. **Atomic Inventory Decrement**: Stock is checked and decremented server-side upon order creation. If an order is cancelled by the admin, products are automatically restocked.
3. **Role-Based Access Control**: Sensitive routes (`/api/admin/*`, `/api/categories` POST/PUT/DELETE, `/api/products` POST/PUT/DELETE) strictly enforce `req.user.role === 'admin'`.
4. **Order Privacy**: Customers can only view and query their own orders. Attempting to view another customer's order ID returns `403 Forbidden`.
5. **Password Protection**: Passwords are encrypted with bcrypt (10 rounds) and excluded from JSON serializations (`select: false`).
6. **Code Splitting**: Admin pages and scripts are separated into distinct chunks via React lazy loading, preventing admin UI code from leaking into the public bundle.

---

## 📦 Production Deployment

* **Frontend**: Deploy `frontend/` to **Vercel** / **Netlify** (configured with `VITE_API_URL=https://your-backend.railway.app/api`).
* **Backend**: Deploy `backend/` to **Render** / **Railway** with `MONGODB_URI` environment variable pointing to your MongoDB Atlas cluster.
