import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Download, Calendar } from 'lucide-react';

const COLORS = ['#ff6600', '#e65c00', '#ff9a56', '#ffa726', '#ff6b35'];

export default function AdminAnalytics() {
    const [dateRange, setDateRange] = useState('7days');
    const [stats, setStats] = useState(null);
    const [customerData, setCustomerData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch stats
            const statsRes = await fetch('http://localhost:4000/api/orders/admin/stats', { headers });
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch trends
            const trendsRes = await fetch('http://localhost:4000/api/analytics/sales-trends', { headers });
            const trendsData = await trendsRes.json();
            setRevenueData(trendsData);

            // Mock customer data
            setCustomerData([
                { name: 'New', value: 45 },
                { name: 'Returning', value: 55 },
            ]);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        alert('Export functionality coming soon!');
    };

    if (loading) return <div className="admin-loading">Loading analytics...</div>;

    return (
        <div className="admin-analytics">
            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1>Analytics Dashboard</h1>
                    <p>Detailed insights and performance metrics</p>
                </div>
                <div className="header-actions">
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="date-range-select">
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="year">This Year</option>
                    </select>
                    <button className="btn-secondary" onClick={handleExport}>
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon revenue">
                        <DollarSign size={24} />
                    </div>
                    <div className="metric-info">
                        <p className="metric-label">Total Revenue</p>
                        <h2 className="metric-value">${Number(stats?.totalRevenue || 0).toFixed(2)}</h2>
                        <span className="metric-change positive">+12.5%</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon orders">
                        <ShoppingBag size={24} />
                    </div>
                    <div className="metric-info">
                        <p className="metric-label">Total Orders</p>
                        <h2 className="metric-value">{stats?.totalOrders || 0}</h2>
                        <span className="metric-change positive">+8.2%</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon customers">
                        <Users size={24} />
                    </div>
                    <div className="metric-info">
                        <p className="metric-label">Total Customers</p>
                        <h2 className="metric-value">{stats?.totalUsers || 0}</h2>
                        <span className="metric-change positive">+15.3%</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon avg-order">
                        <TrendingUp size={24} />
                    </div>
                    <div className="metric-info">
                        <p className="metric-label">Avg. Order Value</p>
                        <h2 className="metric-value">${stats?.totalOrders ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}</h2>
                        <span className="metric-change negative">-2.1%</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-section">
                {/* Revenue Trend */}
                <div className="chart-card large">
                    <h3>Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#ff6600" strokeWidth={3} name="Revenue ($)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Customer Distribution */}
                <div className="chart-card">
                    <h3>Customer Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={customerData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {customerData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="insights-section">
                <h2>Performance Insights</h2>
                <div className="insights-grid">
                    <div className="insight-card">
                        <h4>Best Selling Day</h4>
                        <p className="insight-value">Saturday</p>
                        <p className="insight-detail">Average: $1,250 revenue</p>
                    </div>
                    <div className="insight-card">
                        <h4>Peak Hours</h4>
                        <p className="insight-value">2 PM - 5 PM</p>
                        <p className="insight-detail">35% of daily orders</p>
                    </div>
                    <div className="insight-card">
                        <h4>Conversion Rate</h4>
                        <p className="insight-value">3.2%</p>
                        <p className="insight-detail">Above industry average</p>
                    </div>
                    <div className="insight-card">
                        <h4>Customer Retention</h4>
                        <p className="insight-value">68%</p>
                        <p className="insight-detail">Returning customers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
