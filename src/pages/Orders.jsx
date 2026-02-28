import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirm from '../components/DeleteConfirm';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/api';

const columns = [
    { key: 'customer', label: 'Customer' },
    { key: 'items', label: 'Items' },
    { key: 'total', label: 'Total', format: (v) => `$${Number(v).toLocaleString()}` },
    { key: 'status', label: 'Status' },
    { key: 'order_date', label: 'Date' },
];

const emptyForm = { customer: '', items: '', total: '', status: 'Pending', order_date: '' };

export default function Orders() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const load = () => {
        setLoading(true);
        getOrders().then(setData).catch(console.error).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, total: Number(form.total) };
            if (current) { await updateOrder(current.id, payload); }
            else { await createOrder(payload); }
            setModalOpen(false); setCurrent(null); setForm(emptyForm); load();
        } catch (err) { alert(err.message); }
    };

    const handleEdit = (row) => {
        setCurrent(row);
        setForm({ customer: row.customer || '', items: row.items || '', total: row.total || '', status: row.status || 'Pending', order_date: row.order_date || '' });
        setModalOpen(true);
    };

    const handleDelete = (row) => { setCurrent(row); setDeleteOpen(true); };

    const confirmDelete = async () => {
        try { await deleteOrder(current.id); setDeleteOpen(false); setCurrent(null); load(); }
        catch (err) { alert(err.message); }
    };

    const openCreate = () => { setCurrent(null); setForm(emptyForm); setModalOpen(true); };

    const renderBadge = (status) => (
        <span className={`badge badge-${status?.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
    );

    if (loading) return <div className="loading"><div className="spinner" /><span>Loading orders...</span></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Orders</h1>
                    <p>Track and manage customer orders — {data.length} total</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate} id="add-order"><Plus size={18} /> Add Order</button>
            </div>

            <DataTable title="All Orders" columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} renderBadge={renderBadge} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={current ? 'Edit Order' : 'New Order'}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group"><label>Customer</label><input required value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} id="order-customer" /></div>
                            <div className="form-group"><label>Total</label><input type="number" step="0.01" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} id="order-total" /></div>
                        </div>
                        <div className="form-group"><label>Items</label><textarea value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} id="order-items" placeholder="e.g. Laptop Pro x2, Wireless Mouse x5" /></div>
                        <div className="form-row">
                            <div className="form-group"><label>Order Date</label><input type="date" value={form.order_date} onChange={(e) => setForm({ ...form, order_date: e.target.value })} id="order-date" /></div>
                            <div className="form-group"><label>Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} id="order-status">
                                    <option>Pending</option><option>Processing</option><option>Shipped</option><option>Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{current ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>

            <DeleteConfirm isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} itemName={`Order #${current?.id}`} />
        </div>
    );
}
