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

// Admin: Get all orders
async function getAllOrders(req, res, next) {
  try {
    const [orders] = await db.query(
      `SELECT o.id, o.user_id, u.name as user_name, u.email, o.total, o.status, o.created_at 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// Admin: Update order status
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    next(err);
  }
}

// Admin: Get user statistics
async function getUserStats(req, res, next) {
  try {
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) as totalOrders FROM orders');
    const [[{ totalRevenue }]] = await db.query('SELECT COALESCE(SUM(total), 0) as totalRevenue FROM orders WHERE status != "cancelled"');
    const [[{ totalProducts }]] = await db.query('SELECT COUNT(*) as totalProducts FROM products');
    res.json({ totalUsers, totalOrders, totalRevenue, totalProducts });
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, listOrders, getOrder, getAllOrders, updateOrderStatus, getUserStats };
