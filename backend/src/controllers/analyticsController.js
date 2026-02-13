const db = require('../config/db');

// Get sales trends (last 7 days)
exports.getSalesTrends = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get top selling products
exports.getTopProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.image_url,
        COUNT(oi.id) as order_count,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) as revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id, p.name, p.image_url
      ORDER BY total_sold DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product performance metrics
exports.getProductPerformance = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.quantity as stock,
        COALESCE(SUM(oi.quantity), 0) as sold,
        COALESCE(COUNT(DISTINCT oi.order_id), 0) as orders,
        p.price
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id, p.name, p.quantity, p.price
      ORDER BY sold DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get revenue breakdown by category
// NOTE: Products table doesn't have category column, returning empty array for now
exports.getRevenueByCategory = async (req, res) => {
  try {
    // Since products table doesn't have a category column, return empty data
    // TODO: Add category column to products table or remove this endpoint
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get low stock products
exports.getLowStock = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, quantity, price, image_url
      FROM products
      WHERE quantity < 10
      ORDER BY quantity ASC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get recent orders summary
exports.getRecentOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.id,
        u.name as customer_name,
        o.total,
        o.status,
        o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
