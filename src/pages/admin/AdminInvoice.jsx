import { useEffect, useState } from 'react';
import { FileText, Download, Send, Printer, Eye } from 'lucide-react';

export default function AdminInvoice() {
    const [invoices, setInvoices] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch orders
            const ordersRes = await fetch('http://localhost:4000/api/orders/admin/all', { headers });
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setOrders(ordersData);
            }

            // Mock invoices data
            setInvoices([
                { id: 1, invoiceNumber: 'INV-2024-001', orderId: 1, customerName: 'John Doe', total: 125.50, status: 'paid', createdAt: new Date().toISOString() },
                { id: 2, invoiceNumber: 'INV-2024-002', orderId: 2, customerName: 'Jane Smith', total: 89.99, status: 'pending', createdAt: new Date(Date.now() - 86400000).toISOString() },
            ]);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateInvoice = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const newInvoice = {
            id: invoices.length + 1,
            invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
            orderId: order.id,
            customerName: order.user_name,
            total: order.total,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        setInvoices([newInvoice, ...invoices]);
        alert(`Invoice ${newInvoice.invoiceNumber} generated successfully!`);
    };

    const downloadPDF = (invoice) => {
        alert(`Downloading PDF for ${invoice.invoiceNumber}...`);
        // TODO: Implement actual PDF generation
    };

    const sendEmail = (invoice) => {
        alert(`Sending invoice ${invoice.invoiceNumber} via email...`);
        // TODO: Implement email sending
    };

    if (loading) return <div className="admin-loading">Loading...</div>;

    return (
        <div className="admin-invoice">
            <div className="page-header">
                <div>
                    <h1>Invoices</h1>
                    <p>{invoices.length} total invoices</p>
                </div>
            </div>

            {/* Generate Invoice Section */}
            <div className="generate-section">
                <h2>Generate New Invoice</h2>
                <div className="generate-form">
                    <select className="order-select" onChange={(e) => e.target.value && generateInvoice(parseInt(e.target.value))}>
                        <option value="">Select an order...</option>
                        {orders.filter(o => !invoices.find(inv => inv.orderId === o.id)).map(order => (
                            <option key={order.id} value={order.id}>
                                Order #{order.id} - {order.user_name} - ${order.total.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="invoices-table">
                <table>
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>
                                    <div className="invoice-number">
                                        <FileText size={16} />
                                        {invoice.invoiceNumber}
                                    </div>
                                </td>
                                <td>#{invoice.orderId}</td>
                                <td>{invoice.customerName}</td>
                                <td className="amount">${invoice.total.toFixed(2)}</td>
                                <td>
                                    <span className={`status-badge ${invoice.status}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn" onClick={() => alert('View invoice')} title="View">
                                            <Eye size={16} />
                                        </button>
                                        <button className="icon-btn" onClick={() => downloadPDF(invoice)} title="Download PDF">
                                            <Download size={16} />
                                        </button>
                                        <button className="icon-btn" onClick={() => sendEmail(invoice)} title="Send Email">
                                            <Send size={16} />
                                        </button>
                                        <button className="icon-btn" onClick={() => window.print()} title="Print">
                                            <Printer size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {invoices.length === 0 && (
                    <div className="empty-state">
                        <FileText size={48} />
                        <p>No invoices generated yet</p>
                        <p className="empty-hint">Select an order above to generate an invoice</p>
                    </div>
                )}
            </div>
        </div>
    );
}
