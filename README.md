# ERP System — Full-Stack Enterprise Management

A modern, full-stack ERP (Enterprise Resource Planning) system built with **React**, **Express.js**, and **SQLite**. Manage employees, departments, products, orders, and invoices through a sleek dark-themed dashboard with full CRUD operations.

---

## ✨ Features

- **Dashboard** — Real-time KPI stat cards (revenue, headcount, orders, inventory) + recent orders feed
- **Employees** — Manage workforce with name, email, department, position, salary, hire date, status
- **Departments** — Track departments with manager, budget, and descriptions
- **Products** — Inventory management with SKU, category, quantity, price, reorder levels
- **Orders** — Customer order tracking with items, totals, and status workflow
- **Invoices** — Billing management with invoice numbers, amounts, due dates, payment status

### Every module includes:
- 🔍 **Search & Filter** — Instant text search across all columns
- ↕️ **Column Sorting** — Click any header to sort ascending/descending
- 📄 **Pagination** — 8 rows per page with smart page navigation
- ➕ **Create** — Modal forms with validation
- ✏️ **Edit** — Pre-filled modal forms for updates
- 🗑️ **Delete** — Confirmation dialog before removal

---

## 🛠️ Tech Stack

| Layer | Technology |
|------------|-------------------------------|
| Frontend   | React 18 + Vite               |
| Routing    | React Router v6               |
| Styling    | Vanilla CSS (dark glassmorphism) |
| Backend    | Express.js REST API           |
| Database   | SQLite (sql.js)               |
| Icons      | Lucide React                  |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohithkudumu/ERP-System.git
cd ERP-System

# Install dependencies
npm install
```

### Running the Application

```bash
# Start both frontend and backend together
npm run dev:all
```

Or run them separately:

```bash
# Frontend (http://localhost:5173)
npm run dev

# Backend API (http://localhost:3001)
npm run dev:server
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
ERP-System/
├── server/
│   ├── db.js              # SQLite database schema + seed data
│   └── index.js           # Express REST API (CRUD factory pattern)
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx        # Collapsible navigation sidebar
│   │   ├── Layout.jsx         # App layout wrapper
│   │   ├── DataTable.jsx      # Reusable data table (search, sort, paginate)
│   │   ├── Modal.jsx          # Form modal dialog
│   │   ├── StatCard.jsx       # KPI stat card
│   │   └── DeleteConfirm.jsx  # Delete confirmation dialog
│   ├── pages/
│   │   ├── Dashboard.jsx      # KPI overview + recent orders
│   │   ├── Employees.jsx      # Employee CRUD
│   │   ├── Departments.jsx    # Department CRUD
│   │   ├── Products.jsx       # Product/inventory CRUD
│   │   ├── Orders.jsx         # Order CRUD
│   │   └── Invoices.jsx       # Invoice CRUD
│   ├── services/
│   │   └── api.js             # Centralized API fetch wrapper
│   ├── App.jsx                # Router configuration
│   ├── main.jsx               # Entry point
│   └── index.css              # Design system (dark glassmorphism theme)
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔌 API Endpoints

All endpoints follow RESTful conventions:

| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| GET    | `/api/dashboard`       | Aggregated KPIs    |
| GET    | `/api/{module}`        | List all records   |
| GET    | `/api/{module}/:id`    | Get single record  |
| POST   | `/api/{module}`        | Create record      |
| PUT    | `/api/{module}/:id`    | Update record      |
| DELETE | `/api/{module}/:id`    | Delete record      |

**Modules:** `employees`, `departments`, `products`, `orders`, `invoices`

---

## 📊 Sample Data

The database auto-seeds on first run with:
- 12 employees across 6 departments
- 6 departments with managers and budgets
- 10 products with SKUs and inventory levels
- 6 customer orders
- 6 invoices with payment statuses

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
