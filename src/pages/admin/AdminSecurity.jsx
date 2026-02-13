import { useEffect, useState } from 'react';
import { Shield, Activity, Clock, AlertTriangle, User, MapPin } from 'lucide-react';

export default function AdminSecurity() {
    const [logs, setLogs] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for demonstration
        setLogs([
            { id: 1, user: 'Admin User', action: 'Updated product #45', ip: '192.168.1.1', timestamp: new Date().toISOString() },
            { id: 2, user: 'Admin User', action: 'Created new discount code', ip: '192.168.1.1', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 3, user: 'Admin User', action: 'Updated order #123 status', ip: '192.168.1.1', timestamp: new Date(Date.now() - 7200000).toISOString() },
        ]);

        setLoginHistory([
            { id: 1, user: 'Admin User', ip: '192.168.1.1', location: 'New York, US', status: 'success', timestamp: new Date().toISOString() },
            { id: 2, user: 'Admin User', ip: '192.168.1.100', location: 'London, UK', status: 'failed', timestamp: new Date(Date.now() - 86400000).toISOString() },
        ]);

        setLoading(false);
    }, []);

    if (loading) return <div className="admin-loading">Loading...</div>;

    return (
        <div className="admin-security">
            <h1>Security & Activity</h1>

            {/* Security Overview */}
            <div className="security-stats">
                <div className="stat-card">
                    <Shield size={24} className="stat-icon" />
                    <div>
                        <h3>Security Status</h3>
                        <p className="status-good">Secure</p>
                    </div>
                </div>
                <div className="stat-card">
                    <Activity size={24} className="stat-icon" />
                    <div>
                        <h3>Active Sessions</h3>
                        <p>1</p>
                    </div>
                </div>
                <div className="stat-card">
                    <AlertTriangle size={24} className="stat-icon" />
                    <div>
                        <h3>Failed Logins (24h)</h3>
                        <p>1</p>
                    </div>
                </div>
            </div>

            {/* Activity Logs */}
            <div className="security-section">
                <h2>Recent Activity</h2>
                <div className="activity-table">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Action</th>
                                <th>IP Address</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        <div className="user-cell">
                                            <User size={16} />
                                            {log.user}
                                        </div>
                                    </td>
                                    <td>{log.action}</td>
                                    <td>{log.ip}</td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Login History */}
            <div className="security-section">
                <h2>Login History</h2>
                <div className="login-table">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>IP Address</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginHistory.map(login => (
                                <tr key={login.id}>
                                    <td>
                                        <div className="user-cell">
                                            <User size={16} />
                                            {login.user}
                                        </div>
                                    </td>
                                    <td>{login.ip}</td>
                                    <td>
                                        <div className="location-cell">
                                            <MapPin size={14} />
                                            {login.location}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${login.status}`}>
                                            {login.status}
                                        </span>
                                    </td>
                                    <td>{new Date(login.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Security Settings */}
            <div className="security-section">
                <h2>Security Settings</h2>
                <div className="security-options">
                    <label className="security-option">
                        <input type="checkbox" defaultChecked />
                        <div>
                            <h4>Two-Factor Authentication</h4>
                            <p>Add an extra layer of security to your account</p>
                        </div>
                    </label>
                    <label className="security-option">
                        <input type="checkbox" defaultChecked />
                        <div>
                            <h4>Login Notifications</h4>
                            <p>Get notified of new login attempts</p>
                        </div>
                    </label>
                    <label className="security-option">
                        <input type="checkbox" />
                        <div>
                            <h4>Session Timeout</h4>
                            <p>Automatically log out after 30 minutes of inactivity</p>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
