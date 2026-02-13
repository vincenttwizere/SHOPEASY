import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api';
import { Search, Filter, Plus, Edit2, Trash2, X } from 'lucide-react';

function ProductForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: 0,
    category: '',
    image_url: '',
    ...initial
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial.image_url || '');

  useEffect(() => {
    setForm({ name: '', description: '', price: '', quantity: 0, category: '', image_url: '', ...initial });
    setImagePreview(initial.image_url || '');
    setImageFile(null);
  }, [initial]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    let finalForm = { ...form };

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          finalForm.image_url = `http://localhost:4000${data.imageUrl}`;
        } else {
          alert('Failed to upload image');
          return;
        }
      } catch (err) {
        alert('Error uploading image: ' + err.message);
        return;
      }
    }

    onSave(finalForm);
  };

  return (
    <div className="modern-modal-overlay" onClick={onCancel}>
      <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial.id ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                placeholder="e.g., Electronics"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <div className="image-upload-modern">
              <label htmlFor="image-upload" className="upload-area">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="preview-img" />
                ) : (
                  <div className="upload-placeholder">
                    <Plus size={32} />
                    <p>Click to upload image</p>
                  </div>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Product description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                placeholder="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>
            {initial.id ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  async function load() {
    setLoading(true);
    try {
      const data = await getProducts();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Price filter
    if (priceFilter === 'low') {
      filtered = filtered.filter(p => p.price < 50);
    } else if (priceFilter === 'medium') {
      filtered = filtered.filter(p => p.price >= 50 && p.price < 200);
    } else if (priceFilter === 'high') {
      filtered = filtered.filter(p => p.price >= 200);
    }

    setFilteredItems(filtered);
  }, [searchQuery, categoryFilter, priceFilter, items]);

  async function handleCreate(payload) {
    try {
      await createProduct(payload);
      load();
      setEditing(null);
    } catch (err) {
      alert(err.message || 'Create failed');
    }
  }

  async function handleUpdate(id, payload) {
    try {
      await updateProduct(id, payload);
      load();
      setEditing(null);
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  }

  const toggleActive = (product) => {
    // Toggle active status (you can add this field to your database)
    const updated = { ...product, active: !product.active };
    handleUpdate(product.id, updated);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: '#ef4444', width: '0%' };
    if (quantity < 10) return { label: 'Low Stock', color: '#f59e0b', width: '30%' };
    if (quantity < 50) return { label: 'Medium Stock', color: '#eab308', width: '60%' };
    return { label: 'In Stock', color: '#10b981', width: '90%' };
  };

  const categories = ['all', ...new Set(items.map(p => p.category).filter(Boolean))];

  return (
    <div className="modern-products-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="subtitle">{filteredItems.length} total products</p>
        </div>
        <button className="btn-add" onClick={() => setEditing({})}>
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-box-modern">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="all">All Prices</option>
            <option value="low">Under $50</option>
            <option value="medium">$50 - $200</option>
            <option value="high">Over $200</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="loading-state">Loading products...</div>
      ) : (
        <div className="modern-table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(product => {
                const stockStatus = getStockStatus(product.quantity);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info-cell">
                        <img src={product.image_url} alt={product.name} className="product-thumb" />
                        <div>
                          <div className="product-name">{product.name}</div>
                          <div className="product-id">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="price-cell">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="stock-cell">{product.quantity}</td>
                    <td>
                      <div className="stock-indicator">
                        <div className="stock-bar">
                          <div
                            className="stock-fill"
                            style={{ width: stockStatus.width, backgroundColor: stockStatus.color }}
                          />
                        </div>
                        <span className="stock-label">{product.quantity}/1000</span>
                      </div>
                    </td>
                    <td>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={product.active !== false}
                          onChange={() => toggleActive(product)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" onClick={() => setEditing(product)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="icon-btn delete" onClick={() => handleDelete(product.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredItems.length === 0 && !loading && (
            <div className="empty-state">
              <p>No products found</p>
            </div>
          )}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editing !== null && (
        <ProductForm
          initial={editing}
          onSave={(form) => editing.id ? handleUpdate(editing.id, form) : handleCreate(form)}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
