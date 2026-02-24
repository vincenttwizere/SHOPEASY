const db = require('../config/db');

async function list(req, res, next) {
  try {
    const [rows] = await db.query('SELECT id, name, description, price, original_price, quantity, image_url, images FROM products');
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = req.params.id;
    const [rows] = await db.query('SELECT id, name, description, price, original_price, quantity, image_url, images FROM products WHERE id = ?', [id]);
    const p = rows[0];
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, description, price, original_price, quantity, image_url, images } = req.body;
    if (!name || price == null) return res.status(400).json({ message: 'Missing fields' });

    // images should be a JSON string or object, if object stringify it
    const imagesJson = images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null;

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, original_price, quantity, image_url, images) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description || '', price, original_price || null, quantity || 0, image_url || null, imagesJson]
    );
    const [rows] = await db.query('SELECT id, name, description, price, original_price, quantity, image_url, images FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const { name, description, price, original_price, quantity, image_url, images } = req.body;

    const imagesJson = images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null;

    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, original_price = ?, quantity = ?, image_url = ?, images = ? WHERE id = ?',
      [name, description, price, original_price || null, quantity, image_url, imagesJson, id]
    );
    const [rows] = await db.query('SELECT id, name, description, price, original_price, quantity, image_url, images FROM products WHERE id = ?', [id]);
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
