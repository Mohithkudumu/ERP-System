import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Building2,
    Package,
    ShoppingCart,
    FileText,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react';

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/departments', label: 'Departments', icon: Building2 },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/invoices', label: 'Invoices', icon: FileText },
];

export default function Sidebar({ collapsed, onToggle }) {
    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <Zap size={22} />
                </div>
                <span className="sidebar-title">ERP System</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-toggle">
                <button onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
        </aside>
    );
}
