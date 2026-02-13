import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api';

function ProductForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: 0, image_url: '', ...initial });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial.image_url || '');

  useEffect(() => {
    setForm({ name: '', description: '', price: '', quantity: 0, image_url: '', ...initial });
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

    // If there's a new image file, upload it first
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
    <div className="product-form">
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <div className="image-upload-section">
        <label htmlFor="image-upload" className="image-upload-label">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          ) : (
            <div className="image-placeholder">Click to upload image</div>
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

      <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
      <div>
        <button className="btn primary" onClick={handleSubmit}>Save</button>
        <button className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getProducts();
      setItems(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(payload) {
    try { await createProduct(payload); load(); setEditing(null); } catch (err) { alert(err.message || 'Create failed'); }
  }

  async function handleUpdate(id, payload) {
    try { await updateProduct(id, payload); load(); setEditing(null); } catch (err) { alert(err.message || 'Update failed'); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete product?')) return;
    try { await deleteProduct(id); load(); } catch (err) { alert(err.message || 'Delete failed'); }
  }

  return (
    <div className="admin-products">
      <h1>Admin - Products</h1>
      <button className="btn primary" onClick={() => setEditing({})}>Create Product</button>
      {loading && <p>Loading...</p>}
      <div className="admin-list">
        {items.map(p => (
          <div key={p.id} className="admin-item">
            <img src={p.image_url} alt={p.name} />
            <div>
              <h4>{p.name}</h4>
              <p>${p.price} — {p.quantity} in stock</p>
            </div>
            <div className="admin-actions">
              <button className="btn" onClick={() => setEditing(p)}>Edit</button>
              <button className="btn" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <div className="admin-editor">
          <h3>{editing.id ? 'Edit Product' : 'Create Product'}</h3>
          <ProductForm initial={editing} onSave={(form) => editing.id ? handleUpdate(editing.id, form) : handleCreate(form)} onCancel={() => setEditing(null)} />
        </div>
      )}
    </div>
  );
}
