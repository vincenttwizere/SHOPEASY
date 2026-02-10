const db = require('../config/db');

async function ensureCart(userId) {
  const [rows] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
  if (rows.length) return rows[0].id;
  const [res] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
  return res.insertId;
}

async function getCart(req, res, next) {
  try {
    const cartId = await ensureCart(req.user.id);
    const [items] = await db.query(
      `SELECT ci.id as itemId, p.id as productId, p.name, p.price, ci.quantity, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ message: 'Missing fields' });

    const cartId = await ensureCart(req.user.id);
    // If exists, update
    const [existing] = await db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
    if (existing.length) {
      const newQty = existing[0].quantity + quantity;
      await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
    } else {
      await db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity]);
    }
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const itemId = req.params.itemId;
    const { quantity } = req.body;
    if (quantity == null) return res.status(400).json({ message: 'Missing quantity' });
    await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
    res.json({ message: 'Updated' });
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const itemId = req.params.itemId;
    await db.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem };
