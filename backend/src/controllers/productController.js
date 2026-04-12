const db = require('../config/db');

async function list(req, res, next) {
  try {
    // only return products that are active
    let sql = 'SELECT id, name, category, description, price, original_price, quantity, active, image_url, images, features, colors, sizes, specifications FROM products WHERE active != 0';
    const params = [];

    if (req.query.q) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const q = `%${req.query.q}%`;
      params.push(q, q);
    }
    if (req.query.category) {
      sql += ' AND category = ?';
      params.push(req.query.category);
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = req.params.id;
    const [rows] = await db.query(
      'SELECT id, name, category, description, price, original_price, quantity, active, image_url, images, features, colors, sizes, specifications FROM products WHERE id = ?',
      [id]
    );
    const p = rows[0];
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, category, description, price, original_price, quantity, image_url, images, active, features, colors, sizes, specifications } = req.body;
    if (!name || price == null) return res.status(400).json({ message: 'Missing fields' });

    const imagesJson = images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null;
    const featuresJson = features ? (typeof features === 'string' ? features : JSON.stringify(features)) : null;
    const colorsJson = colors ? (typeof colors === 'string' ? colors : JSON.stringify(colors)) : null;
    const sizesJson = sizes ? (typeof sizes === 'string' ? sizes : JSON.stringify(sizes)) : null;
    const specificationsJson = specifications ? (typeof specifications === 'string' ? specifications : JSON.stringify(specifications)) : null;

    const [result] = await db.query(
      'INSERT INTO products (name, category, description, price, original_price, quantity, active, image_url, images, features, colors, sizes, specifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        category || '',
        description || '',
        price,
        original_price || null,
        quantity || 0,
        active === false ? 0 : 1,
        image_url || null,
        imagesJson,
        featuresJson,
        colorsJson,
        sizesJson,
        specificationsJson
      ]
    );
    const [rows] = await db.query('SELECT id, name, category, description, price, original_price, quantity, active, image_url, images, features, colors, sizes, specifications FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const { name, category, description, price, original_price, quantity, image_url, images, active, features, colors, sizes, specifications } = req.body;

    const imagesJson = images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null;
    const featuresJson = features ? (typeof features === 'string' ? features : JSON.stringify(features)) : null;
    const colorsJson = colors ? (typeof colors === 'string' ? colors : JSON.stringify(colors)) : null;
    const sizesJson = sizes ? (typeof sizes === 'string' ? sizes : JSON.stringify(sizes)) : null;
    const specificationsJson = specifications ? (typeof specifications === 'string' ? specifications : JSON.stringify(specifications)) : null;

    await db.query(
      `UPDATE products SET
         name = ?,
         category = ?,
         description = ?,
         price = ?,
         original_price = ?,
         quantity = ?,
         active = ?,
         image_url = ?,
         images = ?,
         features = ?,
         colors = ?,
         sizes = ?,
         specifications = ?
       WHERE id = ?`,
      [
        name,
        category || '',
        description,
        price,
        original_price || null,
        quantity,
        active === false ? 0 : 1,
        image_url,
        imagesJson,
        featuresJson,
        colorsJson,
        sizesJson,
        specificationsJson,
        id
      ]
    );
    const [rows] = await db.query('SELECT id, name, category, description, price, original_price, quantity, active, image_url, images, features, colors, sizes, specifications FROM products WHERE id = ?', [id]);
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
