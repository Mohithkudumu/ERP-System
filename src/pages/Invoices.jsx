import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirm from '../components/DeleteConfirm';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../services/api';

const columns = [
    { key: 'invoice_number', label: 'Invoice #' },
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Amount', format: (v) => `$${Number(v).toLocaleString()}` },
    { key: 'due_date', label: 'Due Date' },
    { key: 'status', label: 'Status' },
];

const emptyForm = { invoice_number: '', customer: '', amount: '', due_date: '', status: 'Unpaid' };

export default function Invoices() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const load = () => {
        setLoading(true);
        getInvoices().then(setData).catch(console.error).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, amount: Number(form.amount) };
            if (current) { await updateInvoice(current.id, payload); }
            else { await createInvoice(payload); }
            setModalOpen(false); setCurrent(null); setForm(emptyForm); load();
        } catch (err) { alert(err.message); }
    };

    const handleEdit = (row) => {
        setCurrent(row);
        setForm({ invoice_number: row.invoice_number || '', customer: row.customer || '', amount: row.amount || '', due_date: row.due_date || '', status: row.status || 'Unpaid' });
        setModalOpen(true);
    };

    const handleDelete = (row) => { setCurrent(row); setDeleteOpen(true); };

    const confirmDelete = async () => {
        try { await deleteInvoice(current.id); setDeleteOpen(false); setCurrent(null); load(); }
        catch (err) { alert(err.message); }
    };

    const openCreate = () => { setCurrent(null); setForm(emptyForm); setModalOpen(true); };

    const renderBadge = (status) => (
        <span className={`badge badge-${status?.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
    );

    if (loading) return <div className="loading"><div className="spinner" /><span>Loading invoices...</span></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Invoices</h1>
                    <p>Manage billing and invoices — {data.length} total</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate} id="add-invoice"><Plus size={18} /> Add Invoice</button>
            </div>

            <DataTable title="All Invoices" columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} renderBadge={renderBadge} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={current ? 'Edit Invoice' : 'New Invoice'}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group"><label>Invoice Number</label><input required value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} id="invoice-number" /></div>
                            <div className="form-group"><label>Customer</label><input required value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} id="invoice-customer" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Amount</label><input type="number" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} id="invoice-amount" /></div>
                            <div className="form-group"><label>Due Date</label><input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} id="invoice-due-date" /></div>
                        </div>
                        <div className="form-group"><label>Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} id="invoice-status">
                                <option>Unpaid</option><option>Paid</option><option>Overdue</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{current ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>

            <DeleteConfirm isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} itemName={current?.invoice_number} />
        </div>
    );
}
