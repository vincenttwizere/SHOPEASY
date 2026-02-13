import { useEffect, useState } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, User, Search } from 'lucide-react';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [reply, setReply] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Mock data for demonstration
        setMessages([
            {
                id: 1,
                user: 'John Doe',
                email: 'john@example.com',
                subject: 'Question about order #123',
                message: 'Hi, I haven\'t received my order yet. Can you help?',
                status: 'new',
                timestamp: new Date().toISOString(),
                replies: []
            },
            {
                id: 2,
                user: 'Jane Smith',
                email: 'jane@example.com',
                subject: 'Product inquiry',
                message: 'Do you have this product in blue color?',
                status: 'replied',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                replies: [
                    { from: 'admin', text: 'Yes, we have it in blue. Check our website!', timestamp: new Date(Date.now() - 1800000).toISOString() }
                ]
            },
            {
                id: 3,
                user: 'Bob Johnson',
                email: 'bob@example.com',
                subject: 'Refund request',
                message: 'I would like to return my order and get a refund.',
                status: 'read',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                replies: []
            },
        ]);
    }, []);

    const filteredMessages = messages.filter(m => {
        if (filter === 'all') return true;
        return m.status === filter;
    });

    const handleReply = () => {
        if (!reply.trim() || !selectedMessage) return;

        const updatedMessages = messages.map(m => {
            if (m.id === selectedMessage.id) {
                return {
                    ...m,
                    status: 'replied',
                    replies: [...m.replies, {
                        from: 'admin',
                        text: reply,
                        timestamp: new Date().toISOString()
                    }]
                };
            }
            return m;
        });

        setMessages(updatedMessages);
        setSelectedMessage({
            ...selectedMessage,
            status: 'replied',
            replies: [...selectedMessage.replies, {
                from: 'admin',
                text: reply,
                timestamp: new Date().toISOString()
            }]
        });
        setReply('');
    };

    const markAsRead = (id) => {
        setMessages(messages.map(m =>
            m.id === id && m.status === 'new' ? { ...m, status: 'read' } : m
        ));
    };

    return (
        <div className="admin-messages">
            <h1>Messages & Support</h1>

            <div className="messages-container">
                {/* Messages List */}
                <div className="messages-list">
                    <div className="messages-header">
                        <div className="filter-tabs">
                            <button
                                className={filter === 'all' ? 'active' : ''}
                                onClick={() => setFilter('all')}
                            >
                                All ({messages.length})
                            </button>
                            <button
                                className={filter === 'new' ? 'active' : ''}
                                onClick={() => setFilter('new')}
                            >
                                New ({messages.filter(m => m.status === 'new').length})
                            </button>
                            <button
                                className={filter === 'read' ? 'active' : ''}
                                onClick={() => setFilter('read')}
                            >
                                Read ({messages.filter(m => m.status === 'read').length})
                            </button>
                            <button
                                className={filter === 'replied' ? 'active' : ''}
                                onClick={() => setFilter('replied')}
                            >
                                Replied ({messages.filter(m => m.status === 'replied').length})
                            </button>
                        </div>
                    </div>

                    <div className="messages-items">
                        {filteredMessages.map(message => (
                            <div
                                key={message.id}
                                className={`message-item ${selectedMessage?.id === message.id ? 'selected' : ''} ${message.status}`}
                                onClick={() => {
                                    setSelectedMessage(message);
                                    markAsRead(message.id);
                                }}
                            >
                                <div className="message-item-header">
                                    <div className="message-user">
                                        <User size={16} />
                                        <strong>{message.user}</strong>
                                    </div>
                                    <span className={`status-indicator ${message.status}`}>
                                        {message.status === 'new' && '●'}
                                        {message.status === 'replied' && <CheckCircle size={14} />}
                                    </span>
                                </div>
                                <div className="message-subject">{message.subject}</div>
                                <div className="message-preview">{message.message.substring(0, 60)}...</div>
                                <div className="message-time">
                                    <Clock size={12} />
                                    {new Date(message.timestamp).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="message-detail">
                    {selectedMessage ? (
                        <>
                            <div className="detail-header">
                                <div>
                                    <h2>{selectedMessage.subject}</h2>
                                    <p className="message-meta">
                                        From: {selectedMessage.user} ({selectedMessage.email})
                                    </p>
                                </div>
                                <span className={`status-badge ${selectedMessage.status}`}>
                                    {selectedMessage.status}
                                </span>
                            </div>

                            <div className="message-thread">
                                {/* Original Message */}
                                <div className="thread-item customer">
                                    <div className="thread-avatar">
                                        <User size={20} />
                                    </div>
                                    <div className="thread-content">
                                        <div className="thread-header">
                                            <strong>{selectedMessage.user}</strong>
                                            <span className="thread-time">
                                                {new Date(selectedMessage.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p>{selectedMessage.message}</p>
                                    </div>
                                </div>

                                {/* Replies */}
                                {selectedMessage.replies.map((r, idx) => (
                                    <div key={idx} className={`thread-item ${r.from}`}>
                                        <div className="thread-avatar">
                                            {r.from === 'admin' ? 'A' : <User size={20} />}
                                        </div>
                                        <div className="thread-content">
                                            <div className="thread-header">
                                                <strong>{r.from === 'admin' ? 'You (Admin)' : selectedMessage.user}</strong>
                                                <span className="thread-time">
                                                    {new Date(r.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p>{r.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Box */}
                            <div className="reply-box">
                                <textarea
                                    placeholder="Type your reply..."
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    rows="4"
                                />
                                <button className="btn-primary" onClick={handleReply}>
                                    <Send size={18} />
                                    Send Reply
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-message-selected">
                            <MessageSquare size={64} />
                            <p>Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
