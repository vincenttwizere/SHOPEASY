import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    LogOut,
    MessageSquare,
    BarChart3,
    FileText,
    Percent,
    Settings,
    Shield,
    HelpCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ onLogout, user }) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) onLogout();
        navigate('/');
    };

    return (
        <div className="admin-layout-modern">
            {/* Sidebar */}
            <aside className={`sidebar-modern ${collapsed ? 'collapsed' : ''}`}>
                {/* Logo */}
                <div className="sidebar-header">
                    <div className="logo-modern">
                        <div className="logo-icon">S</div>
                        {!collapsed && <span className="logo-text">ShopEasy</span>}
                    </div>
                    <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav-modern">
                    {/* Menu Section */}
                    <div className="nav-section">
                        {!collapsed && <div className="section-label">Menu</div>}
                        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <LayoutDashboard size={20} />
                            {!collapsed && <span>Dashboard</span>}
                        </NavLink>
                        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <ShoppingCart size={20} />
                            {!collapsed && <span>Order</span>}
                            {!collapsed && <span className="badge">6</span>}
                        </NavLink>
                        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Users size={20} />
                            {!collapsed && <span>Customers</span>}
                        </NavLink>
                        <NavLink to="/admin/messages" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <MessageSquare size={20} />
                            {!collapsed && <span>Message</span>}
                        </NavLink>
                    </div>

                    {/* Tools Section */}
                    <div className="nav-section">
                        {!collapsed && <div className="section-label">Tools</div>}
                        <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Package size={20} />
                            {!collapsed && <span>Product</span>}
                        </NavLink>
                        <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <BarChart3 size={20} />
                            {!collapsed && <span>Analytic</span>}
                        </NavLink>
                        <NavLink to="/admin/invoice" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <FileText size={20} />
                            {!collapsed && <span>Invoice</span>}
                        </NavLink>
                        <NavLink to="/admin/discounts" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Percent size={20} />
                            {!collapsed && <span>Discount</span>}
                        </NavLink>
                    </div>

                    {/* Settings Section */}
                    <div className="nav-section">
                        {!collapsed && <div className="section-label">Settings</div>}
                        <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Settings size={20} />
                            {!collapsed && <span>Settings</span>}
                        </NavLink>
                        <NavLink to="/admin/security" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Shield size={20} />
                            {!collapsed && <span>Security</span>}
                        </NavLink>
                        <NavLink to="/admin/help" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <HelpCircle size={20} />
                            {!collapsed && <span>Get Help</span>}
                        </NavLink>
                    </div>
                </nav>

                {/* Logout */}
                <div className="sidebar-footer">
                    <button className="nav-item logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`admin-main-modern ${collapsed ? 'expanded' : ''}`}>
                {/* Top Bar */}
                <div className="top-bar-modern">
                    <div className="search-global">
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="top-bar-actions">
                        <button className="icon-btn-top">
                            <MessageSquare size={20} />
                            <span className="notification-dot"></span>
                        </button>
                        <button className="icon-btn-top">
                            <ShoppingCart size={20} />
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="user-profile-top">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=ff6600&color=fff" alt="Admin" />
                            <div className="user-info">
                                <div className="user-name">{user?.name || 'Admin User'}</div>
                                <div className="user-role">Admin Store</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="page-content-modern">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
