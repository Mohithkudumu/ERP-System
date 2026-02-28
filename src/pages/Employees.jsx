import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import DeleteConfirm from '../components/DeleteConfirm';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/api';

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'position', label: 'Position' },
    { key: 'salary', label: 'Salary', format: (v) => `$${Number(v).toLocaleString()}` },
    { key: 'status', label: 'Status' },
];

const emptyForm = {
    name: '', email: '', phone: '', department: '', position: '', salary: '', hire_date: '', status: 'Active'
};

export default function Employees() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const load = () => {
        setLoading(true);
        getEmployees().then(setData).catch(console.error).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (current) {
                await updateEmployee(current.id, { ...form, salary: Number(form.salary) });
            } else {
                await createEmployee({ ...form, salary: Number(form.salary) });
            }
            setModalOpen(false);
            setCurrent(null);
            setForm(emptyForm);
            load();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (row) => {
        setCurrent(row);
        setForm({
            name: row.name || '',
            email: row.email || '',
            phone: row.phone || '',
            department: row.department || '',
            position: row.position || '',
            salary: row.salary || '',
            hire_date: row.hire_date || '',
            status: row.status || 'Active',
        });
        setModalOpen(true);
    };

    const handleDelete = (row) => {
        setCurrent(row);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteEmployee(current.id);
            setDeleteOpen(false);
            setCurrent(null);
            load();
        } catch (err) {
            alert(err.message);
        }
    };

    const openCreate = () => {
        setCurrent(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const renderBadge = (status) => (
        <span className={`badge badge-${status?.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
    );

    if (loading) {
        return <div className="loading"><div className="spinner" /><span>Loading employees...</span></div>;
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Employees</h1>
                    <p>Manage your workforce — {data.length} employees total</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate} id="add-employee">
                    <Plus size={18} /> Add Employee
                </button>
            </div>

            <DataTable
                title="All Employees"
                columns={columns}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderBadge={renderBadge}
            />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={current ? 'Edit Employee' : 'Add Employee'}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} id="employee-name" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} id="employee-email" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone</label>
                                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} id="employee-phone" />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} id="employee-department" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Position</label>
                                <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} id="employee-position" />
                            </div>
                            <div className="form-group">
                                <label>Salary</label>
                                <input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} id="employee-salary" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Hire Date</label>
                                <input type="date" value={form.hire_date} onChange={(e) => setForm({ ...form, hire_date: e.target.value })} id="employee-hire-date" />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} id="employee-status">
                                    <option>Active</option>
                                    <option>On Leave</option>
                                    <option>Inactive</option>
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

            <DeleteConfirm
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={current?.name}
            />
        </div>
    );
}
