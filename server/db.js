import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'erp.db');

const isServerless = process.env.VERCEL === '1';
let db;

export async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (!isServerless && fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
    createTables();
    seedData();
    if (!isServerless) saveDb();
  }

  return db;
}

export function saveDb() {
  if (!db || isServerless) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      manager TEXT,
      budget REAL DEFAULT 0,
      description TEXT,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      department TEXT,
      position TEXT,
      salary REAL DEFAULT 0,
      hire_date TEXT,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE,
      category TEXT,
      quantity INTEGER DEFAULT 0,
      price REAL DEFAULT 0,
      reorder_level INTEGER DEFAULT 10,
      status TEXT DEFAULT 'In Stock',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer TEXT NOT NULL,
      items TEXT,
      total REAL DEFAULT 0,
      status TEXT DEFAULT 'Pending',
      order_date TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE,
      customer TEXT NOT NULL,
      amount REAL DEFAULT 0,
      due_date TEXT,
      status TEXT DEFAULT 'Unpaid',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function seedData() {
  // Seed departments
  const departments = [
    ['Engineering', 'Alice Johnson', 500000, 'Software development and engineering', 'Active'],
    ['Marketing', 'Bob Williams', 250000, 'Brand management and marketing campaigns', 'Active'],
    ['Sales', 'Carol Davis', 350000, 'Sales operations and client relationships', 'Active'],
    ['Human Resources', 'David Brown', 180000, 'Employee welfare and recruitment', 'Active'],
    ['Finance', 'Eva Martinez', 300000, 'Financial planning and accounting', 'Active'],
    ['Operations', 'Frank Lee', 420000, 'Day-to-day business operations', 'Active'],
  ];
  for (const d of departments) {
    db.run('INSERT INTO departments (name, manager, budget, description, status) VALUES (?, ?, ?, ?, ?)', d);
  }

  // Seed employees
  const employees = [
    ['Alice Johnson', 'alice@erp.com', '+1-555-0101', 'Engineering', 'VP of Engineering', 145000, '2021-03-15', 'Active'],
    ['Bob Williams', 'bob@erp.com', '+1-555-0102', 'Marketing', 'Marketing Director', 120000, '2020-07-22', 'Active'],
    ['Carol Davis', 'carol@erp.com', '+1-555-0103', 'Sales', 'Sales Manager', 110000, '2019-11-01', 'Active'],
    ['David Brown', 'david@erp.com', '+1-555-0104', 'Human Resources', 'HR Director', 105000, '2022-01-10', 'Active'],
    ['Eva Martinez', 'eva@erp.com', '+1-555-0105', 'Finance', 'CFO', 160000, '2018-06-20', 'Active'],
    ['Frank Lee', 'frank@erp.com', '+1-555-0106', 'Operations', 'COO', 155000, '2019-09-14', 'Active'],
    ['Grace Kim', 'grace@erp.com', '+1-555-0107', 'Engineering', 'Senior Developer', 125000, '2021-08-03', 'Active'],
    ['Henry Patel', 'henry@erp.com', '+1-555-0108', 'Engineering', 'Full-Stack Developer', 105000, '2022-04-18', 'Active'],
    ['Irene Chen', 'irene@erp.com', '+1-555-0109', 'Marketing', 'Content Strategist', 85000, '2023-02-28', 'Active'],
    ['Jack Wilson', 'jack@erp.com', '+1-555-0110', 'Sales', 'Account Executive', 95000, '2022-10-05', 'Active'],
    ['Karen Lopez', 'karen@erp.com', '+1-555-0111', 'Finance', 'Accountant', 78000, '2023-06-12', 'Active'],
    ['Liam O\'Brien', 'liam@erp.com', '+1-555-0112', 'Operations', 'Logistics Coordinator', 72000, '2023-09-01', 'On Leave'],
  ];
  for (const e of employees) {
    db.run('INSERT INTO employees (name, email, phone, department, position, salary, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', e);
  }

  // Seed products
  const products = [
    ['Laptop Pro 15"', 'LP-001', 'Electronics', 150, 1299.99, 20, 'In Stock'],
    ['Wireless Mouse', 'WM-002', 'Peripherals', 500, 29.99, 50, 'In Stock'],
    ['Mechanical Keyboard', 'MK-003', 'Peripherals', 300, 89.99, 30, 'In Stock'],
    ['4K Monitor 27"', 'MN-004', 'Electronics', 80, 449.99, 15, 'In Stock'],
    ['USB-C Hub', 'UH-005', 'Accessories', 200, 49.99, 25, 'In Stock'],
    ['Webcam HD', 'WC-006', 'Peripherals', 120, 69.99, 20, 'In Stock'],
    ['Standing Desk', 'SD-007', 'Furniture', 45, 599.99, 10, 'Low Stock'],
    ['Ergonomic Chair', 'EC-008', 'Furniture', 60, 399.99, 10, 'In Stock'],
    ['Noise-Cancelling Headphones', 'NH-009', 'Audio', 90, 249.99, 15, 'In Stock'],
    ['Portable SSD 1TB', 'PS-010', 'Storage', 200, 109.99, 25, 'In Stock'],
  ];
  for (const p of products) {
    db.run('INSERT INTO products (name, sku, category, quantity, price, reorder_level, status) VALUES (?, ?, ?, ?, ?, ?, ?)', p);
  }

  // Seed orders
  const orders = [
    ['Acme Corporation', 'Laptop Pro 15" x2, Wireless Mouse x5', 2749.93, 'Completed', '2026-02-15'],
    ['TechStart Inc.', '4K Monitor 27" x3, USB-C Hub x3', 1499.94, 'Processing', '2026-02-20'],
    ['GlobalTrade LLC', 'Standing Desk x5, Ergonomic Chair x5', 4999.90, 'Pending', '2026-02-25'],
    ['InnovateTech', 'Noise-Cancelling Headphones x10', 2499.90, 'Shipped', '2026-02-18'],
    ['DataFlow Systems', 'Portable SSD 1TB x20', 2199.80, 'Completed', '2026-02-10'],
    ['CloudNine Org', 'Mechanical Keyboard x15, Webcam HD x15', 2399.70, 'Processing', '2026-02-22'],
  ];
  for (const o of orders) {
    db.run('INSERT INTO orders (customer, items, total, status, order_date) VALUES (?, ?, ?, ?, ?)', o);
  }

  // Seed invoices
  const invoices = [
    ['INV-2026-001', 'Acme Corporation', 2749.93, '2026-03-15', 'Paid'],
    ['INV-2026-002', 'TechStart Inc.', 1499.94, '2026-03-20', 'Unpaid'],
    ['INV-2026-003', 'GlobalTrade LLC', 4999.90, '2026-03-25', 'Unpaid'],
    ['INV-2026-004', 'InnovateTech', 2499.90, '2026-03-18', 'Paid'],
    ['INV-2026-005', 'DataFlow Systems', 2199.80, '2026-03-10', 'Paid'],
    ['INV-2026-006', 'CloudNine Org', 2399.70, '2026-03-22', 'Overdue'],
  ];
  for (const inv of invoices) {
    db.run('INSERT INTO invoices (invoice_number, customer, amount, due_date, status) VALUES (?, ?, ?, ?, ?)', inv);
  }
}
