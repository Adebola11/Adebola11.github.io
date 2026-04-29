const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

// POST /orders — place an order
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = await pool.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
      [userId, total],
    );
    const orderId = newOrder.rows[0].id;
    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.product_id, item.quantity, item.price],
      );
      await pool.query(
        "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2",
        [item.quantity, item.product_id],
      );
    }
    res.status(201).json({ message: "Order placed successfully", order_id: orderId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /orders — get logged-in user's orders
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await pool.query(
      `SELECT o.id, o.status, o.total, o.created_at,
        json_agg(json_build_object(
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'name', p.name
        )) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId],
    );
    res.json(orders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
