import { useEffect, useState } from 'react';
import { Save, Store, Mail, CreditCard, Truck, DollarSign } from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        storeName: 'ShopEasy',
        storeEmail: 'admin@shopeasy.com',
        storePhone: '+1 (555) 123-4567',
        storeAddress: '123 Commerce St, City, State 12345',
        currency: 'USD',
        taxRate: '8.5',
        shippingFee: '5.00',
        freeShippingThreshold: '50.00',
        emailNotifications: true,
        orderNotifications: true,
        lowStockAlerts: true,
        lowStockThreshold: '10'
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
        setSaved(false);
    };

    const handleSave = async () => {
        try {
            // TODO: Save to backend API
            console.log('Saving settings:', settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert('Failed to save settings');
        }
    };

    return (
        <div className="admin-settings">
            <div className="settings-header">
                <h1>Settings</h1>
                <button className="btn-primary" onClick={handleSave}>
                    <Save size={18} />
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {/* Store Information */}
            <div className="settings-section">
                <div className="section-header">
                    <Store size={24} />
                    <h2>Store Information</h2>
                </div>
                <div className="settings-grid">
                    <div className="form-group">
                        <label>Store Name</label>
                        <input
                            type="text"
                            value={settings.storeName}
                            onChange={(e) => handleChange('storeName', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Store Email</label>
                        <input
                            type="email"
                            value={settings.storeEmail}
                            onChange={(e) => handleChange('storeEmail', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            value={settings.storePhone}
                            onChange={(e) => handleChange('storePhone', e.target.value)}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Store Address</label>
                        <input
                            type="text"
                            value={settings.storeAddress}
                            onChange={(e) => handleChange('storeAddress', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Currency & Tax */}
            <div className="settings-section">
                <div className="section-header">
                    <DollarSign size={24} />
                    <h2>Currency & Tax</h2>
                </div>
                <div className="settings-grid">
                    <div className="form-group">
                        <label>Currency</label>
                        <select value={settings.currency} onChange={(e) => handleChange('currency', e.target.value)}>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tax Rate (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={settings.taxRate}
                            onChange={(e) => handleChange('taxRate', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Shipping */}
            <div className="settings-section">
                <div className="section-header">
                    <Truck size={24} />
                    <h2>Shipping Settings</h2>
                </div>
                <div className="settings-grid">
                    <div className="form-group">
                        <label>Standard Shipping Fee ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={settings.shippingFee}
                            onChange={(e) => handleChange('shippingFee', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Free Shipping Threshold ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={settings.freeShippingThreshold}
                            onChange={(e) => handleChange('freeShippingThreshold', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="settings-section">
                <div className="section-header">
                    <Mail size={24} />
                    <h2>Notification Preferences</h2>
                </div>
                <div className="settings-toggles">
                    <label className="toggle-item">
                        <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                        />
                        <span>Email Notifications</span>
                    </label>
                    <label className="toggle-item">
                        <input
                            type="checkbox"
                            checked={settings.orderNotifications}
                            onChange={(e) => handleChange('orderNotifications', e.target.checked)}
                        />
                        <span>New Order Notifications</span>
                    </label>
                    <label className="toggle-item">
                        <input
                            type="checkbox"
                            checked={settings.lowStockAlerts}
                            onChange={(e) => handleChange('lowStockAlerts', e.target.checked)}
                        />
                        <span>Low Stock Alerts</span>
                    </label>
                </div>
                {settings.lowStockAlerts && (
                    <div className="form-group">
                        <label>Low Stock Threshold</label>
                        <input
                            type="number"
                            value={settings.lowStockThreshold}
                            onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
