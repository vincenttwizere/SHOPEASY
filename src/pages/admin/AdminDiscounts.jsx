import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Percent, DollarSign, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminDiscounts() {
    const [discounts, setDiscounts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Mock data for demonstration
        setDiscounts([
            { id: 1, code: 'SUMMER2024', type: 'percentage', value: 20, minPurchase: 50, maxUses: 100, usedCount: 45, expiresAt: '2024-08-31', active: true },
            { id: 2, code: 'WELCOME10', type: 'fixed', value: 10, minPurchase: 0, maxUses: null, usedCount: 230, expiresAt: null, active: true },
            { id: 3, code: 'FLASH50', type: 'percentage', value: 50, minPurchase: 100, maxUses: 50, usedCount: 50, expiresAt: '2024-06-30', active: false },
        ]);
    }, []);

    const handleCreate = () => {
        setEditing({
            code: '',
            type: 'percentage',
            value: 0,
            minPurchase: 0,
            maxUses: null,
            expiresAt: '',
            active: true
        });
    };

    const handleSave = () => {
        if (editing.id) {
            setDiscounts(discounts.map(d => d.id === editing.id ? editing : d));
        } else {
            setDiscounts([...discounts, { ...editing, id: Date.now(), usedCount: 0 }]);
        }
        setEditing(null);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this discount code?')) {
            setDiscounts(discounts.filter(d => d.id !== id));
        }
    };

    const toggleActive = (id) => {
        setDiscounts(discounts.map(d =>
            d.id === id ? { ...d, active: !d.active } : d
        ));
    };

    return (
        <div className="admin-discounts">
            <div className="page-header">
                <div>
                    <h1>Discount Codes</h1>
                    <p>{discounts.length} total codes</p>
                </div>
                <button className="btn-add" onClick={handleCreate}>
                    <Plus size={20} />
                    Create Discount
                </button>
            </div>

            {/* Discounts Table */}
            <div className="discounts-table">
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th>Min Purchase</th>
                            <th>Usage</th>
                            <th>Expires</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts.map(discount => (
                            <tr key={discount.id}>
                                <td>
                                    <code className="discount-code">{discount.code}</code>
                                </td>
                                <td>
                                    <span className={`type-badge ${discount.type}`}>
                                        {discount.type === 'percentage' ? <Percent size={14} /> : <DollarSign size={14} />}
                                        {discount.type}
                                    </span>
                                </td>
                                <td>
                                    {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                                </td>
                                <td>${discount.minPurchase}</td>
                                <td>
                                    <div className="usage-cell">
                                        {discount.usedCount} / {discount.maxUses || '∞'}
                                        {discount.maxUses && (
                                            <div className="usage-bar">
                                                <div
                                                    className="usage-fill"
                                                    style={{ width: `${(discount.usedCount / discount.maxUses) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {discount.expiresAt ? (
                                        <div className="expires-cell">
                                            <Calendar size={14} />
                                            {new Date(discount.expiresAt).toLocaleDateString()}
                                        </div>
                                    ) : (
                                        <span className="no-expiry">Never</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={`status-toggle ${discount.active ? 'active' : 'inactive'}`}
                                        onClick={() => toggleActive(discount.id)}
                                    >
                                        {discount.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                        {discount.active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn" onClick={() => setEditing(discount)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(discount.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit/Create Modal */}
            {editing && (
                <div className="modern-modal-overlay" onClick={() => setEditing(null)}>
                    <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing.id ? 'Edit Discount' : 'Create Discount'}</h2>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Discount Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g., SUMMER2024"
                                    value={editing.code}
                                    onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Value</label>
                                    <input
                                        type="number"
                                        placeholder={editing.type === 'percentage' ? '20' : '10.00'}
                                        value={editing.value}
                                        onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Minimum Purchase ($)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={editing.minPurchase}
                                        onChange={(e) => setEditing({ ...editing, minPurchase: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Max Uses (optional)</label>
                                    <input
                                        type="number"
                                        placeholder="Unlimited"
                                        value={editing.maxUses || ''}
                                        onChange={(e) => setEditing({ ...editing, maxUses: e.target.value || null })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Expiration Date (optional)</label>
                                <input
                                    type="date"
                                    value={editing.expiresAt || ''}
                                    onChange={(e) => setEditing({ ...editing, expiresAt: e.target.value })}
                                />
                            </div>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={editing.active}
                                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                                />
                                Active
                            </label>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSave}>
                                {editing.id ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
