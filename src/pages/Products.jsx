import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirm from '../components/DeleteConfirm';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const columns = [
    { key: 'name', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Qty' },
    { key: 'price', label: 'Price', format: (v) => `$${Number(v).toLocaleString()}` },
    { key: 'reorder_level', label: 'Reorder Level' },
    { key: 'status', label: 'Status' },
];

const emptyForm = { name: '', sku: '', category: '', quantity: '', price: '', reorder_level: '', status: 'In Stock' };

export default function Products() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const load = () => {
        setLoading(true);
        getProducts().then(setData).catch(console.error).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, quantity: Number(form.quantity), price: Number(form.price), reorder_level: Number(form.reorder_level) };
            if (current) { await updateProduct(current.id, payload); }
            else { await createProduct(payload); }
            setModalOpen(false); setCurrent(null); setForm(emptyForm); load();
        } catch (err) { alert(err.message); }
    };

    const handleEdit = (row) => {
        setCurrent(row);
        setForm({ name: row.name || '', sku: row.sku || '', category: row.category || '', quantity: row.quantity || '', price: row.price || '', reorder_level: row.reorder_level || '', status: row.status || 'In Stock' });
        setModalOpen(true);
    };

    const handleDelete = (row) => { setCurrent(row); setDeleteOpen(true); };

    const confirmDelete = async () => {
        try { await deleteProduct(current.id); setDeleteOpen(false); setCurrent(null); load(); }
        catch (err) { alert(err.message); }
    };

    const openCreate = () => { setCurrent(null); setForm(emptyForm); setModalOpen(true); };

    const renderBadge = (status) => (
        <span className={`badge badge-${status?.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
    );

    if (loading) return <div className="loading"><div className="spinner" /><span>Loading products...</span></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage inventory — {data.length} products tracked</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate} id="add-product"><Plus size={18} /> Add Product</button>
            </div>

            <DataTable title="All Products" columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} renderBadge={renderBadge} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={current ? 'Edit Product' : 'Add Product'}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group"><label>Product Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} id="product-name" /></div>
                            <div className="form-group"><label>SKU</label><input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} id="product-sku" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} id="product-category" /></div>
                            <div className="form-group"><label>Price</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} id="product-price" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Quantity</label><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} id="product-quantity" /></div>
                            <div className="form-group"><label>Reorder Level</label><input type="number" value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: e.target.value })} id="product-reorder" /></div>
                        </div>
                        <div className="form-group"><label>Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} id="product-status">
                                <option>In Stock</option><option>Low Stock</option><option>Out of Stock</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{current ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>

            <DeleteConfirm isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} itemName={current?.name} />
        </div>
    );
}
