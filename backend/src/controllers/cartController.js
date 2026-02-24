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

    // Check stock
    const [product] = await db.query('SELECT quantity FROM products WHERE id = ?', [productId]);
    if (!product.length) return res.status(404).json({ message: 'Product not found' });
    if (product[0].quantity < quantity) {
      return res.status(400).json({ message: `Only ${product[0].quantity} items available` });
    }

    const cartId = await ensureCart(req.user.id);
    // If exists, update
    const [existing] = await db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
    if (existing.length) {
      const newQty = existing[0].quantity + quantity;
      if (product[0].quantity < newQty) {
        return res.status(400).json({ message: `Insufficient stock. You already have ${existing[0].quantity} in cart.` });
      }
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

    // We need to check stock for the product associated with this item
    const [item] = await db.query('SELECT product_id FROM cart_items WHERE id = ?', [itemId]);
    if (!item.length) return res.status(404).json({ message: 'Item not found' });

    const [product] = await db.query('SELECT quantity FROM products WHERE id = ?', [item[0].product_id]);
    if (product.length && product[0].quantity < quantity) {
      return res.status(400).json({ message: `Only ${product[0].quantity} items available` });
    }

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
