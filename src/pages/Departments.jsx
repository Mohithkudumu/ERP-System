import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirm from '../components/DeleteConfirm';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/api';

const columns = [
    { key: 'name', label: 'Department' },
    { key: 'manager', label: 'Manager' },
    { key: 'budget', label: 'Budget', format: (v) => `$${Number(v).toLocaleString()}` },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
];

const emptyForm = { name: '', manager: '', budget: '', description: '', status: 'Active' };

export default function Departments() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const load = () => {
        setLoading(true);
        getDepartments().then(setData).catch(console.error).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (current) {
                await updateDepartment(current.id, { ...form, budget: Number(form.budget) });
            } else {
                await createDepartment({ ...form, budget: Number(form.budget) });
            }
            setModalOpen(false);
            setCurrent(null);
            setForm(emptyForm);
            load();
        } catch (err) { alert(err.message); }
    };

    const handleEdit = (row) => {
        setCurrent(row);
        setForm({ name: row.name || '', manager: row.manager || '', budget: row.budget || '', description: row.description || '', status: row.status || 'Active' });
        setModalOpen(true);
    };

    const handleDelete = (row) => { setCurrent(row); setDeleteOpen(true); };

    const confirmDelete = async () => {
        try { await deleteDepartment(current.id); setDeleteOpen(false); setCurrent(null); load(); }
        catch (err) { alert(err.message); }
    };

    const openCreate = () => { setCurrent(null); setForm(emptyForm); setModalOpen(true); };

    const renderBadge = (status) => (
        <span className={`badge badge-${status?.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
    );

    if (loading) return <div className="loading"><div className="spinner" /><span>Loading departments...</span></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Departments</h1>
                    <p>Manage organizational departments — {data.length} total</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate} id="add-department"><Plus size={18} /> Add Department</button>
            </div>

            <DataTable title="All Departments" columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} renderBadge={renderBadge} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={current ? 'Edit Department' : 'Add Department'}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group"><label>Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} id="dept-name" /></div>
                            <div className="form-group"><label>Manager</label><input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} id="dept-manager" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Budget</label><input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} id="dept-budget" /></div>
                            <div className="form-group"><label>Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} id="dept-status">
                                    <option>Active</option><option>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} id="dept-description" /></div>
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
