import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from 'lucide-react';

export default function AdminLayout({ onLogout }) {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>ShopEasy Admin</h2>
                </div>
                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Package size={20} />
                        <span>Products</span>
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Users size={20} />
                        <span>Users</span>
                    </NavLink>
                </nav>
                <button className="admin-logout" onClick={onLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}
