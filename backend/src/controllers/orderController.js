const db = require('../config/db');

async function placeOrder(req, res, next) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const userId = req.user.id;

    // get cart items
    const [cartRows] = await conn.query(
      `SELECT ci.id as itemId, p.id as productId, p.price, ci.quantity, p.quantity as stock
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (!cartRows.length) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: 'Cart empty' });
    }

    // Check stock and calculate total
    let total = 0;
    for (const it of cartRows) {
      if (it.quantity > it.stock) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({ message: `Insufficient stock for product ${it.productId}` });
      }
      total += Number(it.price) * it.quantity;
    }

    const [orderRes] = await conn.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', [userId, total]);
    const orderId = orderRes.insertId;

    // insert order items and decrement stock
    for (const it of cartRows) {
      await conn.query('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)', [orderId, it.productId, it.quantity, it.price]);
      await conn.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [it.quantity, it.productId]);
    }

    // clear cart
    await conn.query('DELETE ci FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = ?', [userId]);

    await conn.commit();
    conn.release();
    res.status(201).json({ orderId, total });
  } catch (err) {
    await conn.rollback();
    conn.release();
    next(err);
  }
}

async function listOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const [orders] = await db.query('SELECT id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const [orders] = await db.query('SELECT id, total, status, created_at FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
    if (!orders.length) return res.status(404).json({ message: 'Order not found' });
    const [items] = await db.query('SELECT oi.product_id, oi.quantity, oi.unit_price, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [orderId]);
    res.json({ order: orders[0], items });
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, listOrders, getOrder };
