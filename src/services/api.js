const API_BASE = '/api';

async function request(endpoint, options = {}) {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Dashboard
export const getDashboard = () => request('/dashboard');

// Employees
export const getEmployees = () => request('/employees');
export const getEmployee = (id) => request(`/employees/${id}`);
export const createEmployee = (data) => request('/employees', { method: 'POST', body: data });
export const updateEmployee = (id, data) => request(`/employees/${id}`, { method: 'PUT', body: data });
export const deleteEmployee = (id) => request(`/employees/${id}`, { method: 'DELETE' });

// Departments
export const getDepartments = () => request('/departments');
export const getDepartment = (id) => request(`/departments/${id}`);
export const createDepartment = (data) => request('/departments', { method: 'POST', body: data });
export const updateDepartment = (id, data) => request(`/departments/${id}`, { method: 'PUT', body: data });
export const deleteDepartment = (id) => request(`/departments/${id}`, { method: 'DELETE' });

// Products
export const getProducts = () => request('/products');
export const getProduct = (id) => request(`/products/${id}`);
export const createProduct = (data) => request('/products', { method: 'POST', body: data });
export const updateProduct = (id, data) => request(`/products/${id}`, { method: 'PUT', body: data });
export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });

// Orders
export const getOrders = () => request('/orders');
export const getOrder = (id) => request(`/orders/${id}`);
export const createOrder = (data) => request('/orders', { method: 'POST', body: data });
export const updateOrder = (id, data) => request(`/orders/${id}`, { method: 'PUT', body: data });
export const deleteOrder = (id) => request(`/orders/${id}`, { method: 'DELETE' });

// Invoices
export const getInvoices = () => request('/invoices');
export const getInvoice = (id) => request(`/invoices/${id}`);
export const createInvoice = (data) => request('/invoices', { method: 'POST', body: data });
export const updateInvoice = (id, data) => request(`/invoices/${id}`, { method: 'PUT', body: data });
export const deleteInvoice = (id) => request(`/invoices/${id}`, { method: 'DELETE' });
