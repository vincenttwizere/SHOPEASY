const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function tokenHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, opts = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {}, tokenHeader());
  const res = await fetch(`${BASE}${path}`, Object.assign({}, opts, { headers }));
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try { msg = JSON.parse(text); } catch {}
    throw new Error(msg.message || res.statusText || 'API Error');
  }
  if (res.status === 204) return null;
  return res.json();
}

// Products
export async function getProducts(q) {
  const url = q ? `/api/products?q=${encodeURIComponent(q)}` : '/api/products';
  return request(url);
}

export async function getProduct(id) {
  return request(`/api/products/${id}`);
}

// Admin product management
export async function createProduct(payload) { return request('/api/products', { method: 'POST', body: JSON.stringify(payload) }); }
export async function updateProduct(id, payload) { return request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
export async function deleteProduct(id) { return request(`/api/products/${id}`, { method: 'DELETE' }); }

// Auth
export async function register(payload) {
  return request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export async function login(payload) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export function saveToken(token) { localStorage.setItem('token', token); }
export function clearToken() { localStorage.removeItem('token'); }

// Cart
export async function getCart() { return request('/api/cart'); }
export async function addToCart(payload) { return request('/api/cart/items', { method: 'POST', body: JSON.stringify(payload) }); }
export async function updateCartItem(itemId, payload) { return request(`/api/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify(payload) }); }
export async function removeCartItem(itemId) { return request(`/api/cart/items/${itemId}`, { method: 'DELETE' }); }

// Orders
export async function placeOrder() { return request('/api/orders', { method: 'POST' }); }
export async function getOrders() { return request('/api/orders'); }

// Wishlist (local storage)
export function getWishlist() { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }
export function addToWishlist(productId) {
  const list = getWishlist();
  if (!list.includes(productId)) list.push(productId);
  localStorage.setItem('wishlist', JSON.stringify(list));
}
export function removeFromWishlist(productId) {
  const list = getWishlist();
  localStorage.setItem('wishlist', JSON.stringify(list.filter(id => id !== productId)));
}
export function isInWishlist(productId) { return getWishlist().includes(productId); }

export default { getProducts, getProduct, register, login, saveToken, clearToken, getCart, addToCart, updateCartItem, removeCartItem, placeOrder, getOrders, getWishlist, addToWishlist, removeFromWishlist, isInWishlist };
