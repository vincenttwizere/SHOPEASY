import { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/api/orders/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="admin-loading">Loading...</div>;

    return (
        <div className="admin-dashboard">
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users">
                        <Users size={32} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-value">{stats?.totalUsers || 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon products">
                        <Package size={32} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p className="stat-value">{stats?.totalProducts || 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orders">
                        <ShoppingCart size={32} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{stats?.totalOrders || 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon revenue">
                        <DollarSign size={32} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <p className="stat-value">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
