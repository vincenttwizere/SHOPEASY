import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';

const COLORS = ['#ff6600', '#e65c00', '#ff9a56', '#ffa726', '#ff6b35'];

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [salesTrends, setSalesTrends] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [revenueByCategory, setRevenueByCategory] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            // Fetch all analytics data in parallel
            const [statsRes, trendsRes, topProdRes, revCatRes, lowStockRes, recentRes] = await Promise.all([
                fetch('http://localhost:4000/api/orders/admin/stats', { headers }),
                fetch('http://localhost:4000/api/analytics/sales-trends', { headers }),
                fetch('http://localhost:4000/api/analytics/top-products', { headers }),
                fetch('http://localhost:4000/api/analytics/revenue-by-category', { headers }),
                fetch('http://localhost:4000/api/analytics/low-stock', { headers }),
                fetch('http://localhost:4000/api/analytics/recent-orders', { headers })
            ]);

            const [statsData, trendsData, topProdData, revCatData, lowStockData, recentData] = await Promise.all([
                statsRes.json(),
                trendsRes.json(),
                topProdRes.json(),
                revCatRes.json(),
                lowStockRes.json(),
                recentRes.json()
            ]);

            setStats(statsData);
            setSalesTrends(trendsData);
            setTopProducts(topProdData);
            setRevenueByCategory(revCatData);
            setLowStock(lowStockData);
            setRecentOrders(recentData);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="admin-loading">Loading dashboard...</div>;
    if (error) return (
        <div className="admin-error">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button onClick={fetchDashboardData}>Retry</button>
        </div>
    );

    return (
        <div className="admin-dashboard">
            <h1>Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <div className="stat-value">{stats?.totalUsers || 0}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon products">
                        <Package size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <div className="stat-value">{stats?.totalProducts || 0}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orders">
                        <ShoppingCart size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <div className="stat-value">{stats?.totalOrders || 0}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <div className="stat-value">${Number(stats?.totalRevenue || 0).toFixed(2)}</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Sales Trends */}
                <div className="chart-card">
                    <h3>Sales Trends (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#ff6600" strokeWidth={2} name="Orders" />
                            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ffa726" strokeWidth={2} name="Revenue ($)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products */}
                <div className="chart-card">
                    <h3>Top 10 Selling Products</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProducts.slice(0, 10)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total_sold" fill="#ff6600" name="Units Sold" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Category */}
                <div className="chart-card">
                    <h3>Revenue by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={revenueByCategory}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="revenue"
                                nameKey="category"
                            >
                                {revenueByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStock.length > 0 && (
                <div className="alert-section">
                    <div className="alert-header">
                        <AlertTriangle size={20} color="#ff6600" />
                        <h3>Low Stock Alert</h3>
                    </div>
                    <div className="low-stock-grid">
                        {lowStock.map(product => (
                            <div key={product.id} className="low-stock-item">
                                <img src={product.image_url} alt={product.name} />
                                <div className="low-stock-info">
                                    <h4>{product.name}</h4>
                                    <p className="stock-warning">Only {product.quantity} left</p>
                                    <p className="price">${product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Orders */}
            <div className="recent-orders-section">
                <h3>Recent Orders</h3>
                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.customer_name}</td>
                                    <td>${order.total.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge ${order.status}`}>{order.status}</span>
                                    </td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
