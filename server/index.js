import express from 'express';
import cors from 'cors';
import { getDb, saveDb } from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── Dashboard ────────────────────────────────────────────
app.get('/api/dashboard', async (req, res) => {
    try {
        const db = await getDb();
        const employees = db.exec('SELECT COUNT(*) as count FROM employees')[0]?.values[0][0] || 0;
        const departments = db.exec('SELECT COUNT(*) as count FROM departments')[0]?.values[0][0] || 0;
        const products = db.exec('SELECT COUNT(*) as count FROM products')[0]?.values[0][0] || 0;
        const orders = db.exec('SELECT COUNT(*) as count FROM orders')[0]?.values[0][0] || 0;
        const revenue = db.exec('SELECT COALESCE(SUM(total), 0) as total FROM orders')[0]?.values[0][0] || 0;
        const invoices = db.exec('SELECT COUNT(*) as count FROM invoices')[0]?.values[0][0] || 0;
        const unpaidInvoices = db.exec("SELECT COUNT(*) as count FROM invoices WHERE status = 'Unpaid' OR status = 'Overdue'")[0]?.values[0][0] || 0;

        const recentOrders = db.exec('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
        const recentOrdersList = recentOrders.length > 0
            ? recentOrders[0].values.map(row => {
                const obj = {};
                recentOrders[0].columns.forEach((col, i) => obj[col] = row[i]);
                return obj;
            })
            : [];

        res.json({
            employees,
            departments,
            products,
            orders,
            revenue,
            invoices,
            unpaidInvoices,
            recentOrders: recentOrdersList
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Helper: rows to objects ──────────────────────────────
function rowsToObjects(result) {
    if (!result || result.length === 0) return [];
    return result[0].values.map(row => {
        const obj = {};
        result[0].columns.forEach((col, i) => obj[col] = row[i]);
        return obj;
    });
}

function rowToObject(result) {
    const rows = rowsToObjects(result);
    return rows.length > 0 ? rows[0] : null;
}

// ─── Generic CRUD Factory ─────────────────────────────────
function createCrudRoutes(tableName, fields) {
    const router = express.Router();

    // GET all
    router.get('/', async (req, res) => {
        try {
            const db = await getDb();
            const result = db.exec(`SELECT * FROM ${tableName} ORDER BY created_at DESC`);
            res.json(rowsToObjects(result));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // GET by id
    router.get('/:id', async (req, res) => {
        try {
            const db = await getDb();
            const result = db.exec(`SELECT * FROM ${tableName} WHERE id = ?`, [req.params.id]);
            const row = rowToObject(result);
            if (!row) return res.status(404).json({ error: 'Not found' });
            res.json(row);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // POST create
    router.post('/', async (req, res) => {
        try {
            const db = await getDb();
            const cols = fields.filter(f => req.body[f] !== undefined);
            const vals = cols.map(f => req.body[f]);
            const placeholders = cols.map(() => '?').join(', ');

            db.run(
                `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${placeholders})`,
                vals
            );
            saveDb();

            const result = db.exec(`SELECT * FROM ${tableName} WHERE id = last_insert_rowid()`);
            res.status(201).json(rowToObject(result));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // PUT update
    router.put('/:id', async (req, res) => {
        try {
            const db = await getDb();
            const cols = fields.filter(f => req.body[f] !== undefined);
            const vals = cols.map(f => req.body[f]);
            const setClause = cols.map(f => `${f} = ?`).join(', ');

            db.run(
                `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
                [...vals, req.params.id]
            );
            saveDb();

            const result = db.exec(`SELECT * FROM ${tableName} WHERE id = ?`, [req.params.id]);
            const row = rowToObject(result);
            if (!row) return res.status(404).json({ error: 'Not found' });
            res.json(row);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // DELETE
    router.delete('/:id', async (req, res) => {
        try {
            const db = await getDb();
            const result = db.exec(`SELECT * FROM ${tableName} WHERE id = ?`, [req.params.id]);
            const row = rowToObject(result);
            if (!row) return res.status(404).json({ error: 'Not found' });

            db.run(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id]);
            saveDb();
            res.json({ message: 'Deleted successfully', deleted: row });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
}

// ─── Mount Routes ─────────────────────────────────────────
app.use('/api/employees', createCrudRoutes('employees', [
    'name', 'email', 'phone', 'department', 'position', 'salary', 'hire_date', 'status'
]));

app.use('/api/departments', createCrudRoutes('departments', [
    'name', 'manager', 'budget', 'description', 'status'
]));

app.use('/api/products', createCrudRoutes('products', [
    'name', 'sku', 'category', 'quantity', 'price', 'reorder_level', 'status'
]));

app.use('/api/orders', createCrudRoutes('orders', [
    'customer', 'items', 'total', 'status', 'order_date'
]));

app.use('/api/invoices', createCrudRoutes('invoices', [
    'invoice_number', 'customer', 'amount', 'due_date', 'status'
]));

// ─── Start Server ─────────────────────────────────────────
async function start() {
    await getDb();
    app.listen(PORT, () => {
        console.log(`✅ ERP API server running on http://localhost:${PORT}`);
    });
}

start().catch(console.error);
