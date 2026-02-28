import { useEffect, useState } from 'react';
import { Users, Building2, Package, ShoppingCart, DollarSign, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { getDashboard } from '../services/api';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboard()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
                <span>Loading dashboard...</span>
            </div>
        );
    }

    if (!data) {
        return <div className="empty-state"><h3>Could not load dashboard data</h3></div>;
    }

    const formatCurrency = (val) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's an overview of your enterprise.</p>
                </div>
            </div>

            <div className="stat-grid">
                <StatCard icon={Users} label="Total Employees" value={data.employees} color="blue" />
                <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(data.revenue)} color="emerald" />
                <StatCard icon={ShoppingCart} label="Orders" value={data.orders} color="purple" />
                <StatCard icon={Package} label="Products" value={data.products} color="amber" />
                <StatCard icon={Building2} label="Departments" value={data.departments} color="cyan" />
                <StatCard icon={FileText} label="Unpaid Invoices" value={data.unpaidInvoices} color="rose" />
            </div>

            {/* Recent Orders */}
            <div className="card" style={{ marginTop: '0.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Orders</h2>
                {data.recentOrders && data.recentOrders.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{order.customer}</td>
                                        <td>{order.items}</td>
                                        <td style={{ fontWeight: 600 }}>${Number(order.total).toLocaleString()}</td>
                                        <td>
                                            <span className={`badge badge-${order.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{order.order_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>No recent orders</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
