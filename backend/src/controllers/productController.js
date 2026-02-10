const db = require('../config/db');

async function list(req, res, next) {
  try {
    const [rows] = await db.query('SELECT id, name, description, price, quantity, image_url FROM products');
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = req.params.id;
    const [rows] = await db.query('SELECT id, name, description, price, quantity, image_url FROM products WHERE id = ?', [id]);
    const p = rows[0];
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, description, price, quantity, image_url } = req.body;
    if (!name || price == null) return res.status(400).json({ message: 'Missing fields' });
    const [result] = await db.query('INSERT INTO products (name, description, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)', [name, description || '', price, quantity || 0, image_url || null]);
    const [rows] = await db.query('SELECT id, name, description, price, quantity, image_url FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const { name, description, price, quantity, image_url } = req.body;
    await db.query('UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, image_url = ? WHERE id = ?', [name, description, price, quantity, image_url, id]);
    const [rows] = await db.query('SELECT id, name, description, price, quantity, image_url FROM products WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
