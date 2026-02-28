import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="employees" element={<Employees />} />
                <Route path="departments" element={<Departments />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="invoices" element={<Invoices />} />
            </Route>
        </Routes>
    );
}
