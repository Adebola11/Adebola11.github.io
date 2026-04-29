const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Apply auth + admin middleware to all routes in this file
router.use(authenticateToken, requireAdmin);

// GET /admin/orders — view all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await pool.query(
      `SELECT o.id, o.status, o.total, o.created_at, u.email,
        json_agg(json_build_object(
          'name', p.name,
          'quantity', oi.quantity,
          'price', oi.price
        )) AS items
       FROM orders o
       JOIN users u ON u.id = o.user_id
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p ON p.id = oi.product_id
       GROUP BY o.id, u.email
       ORDER BY o.created_at DESC`,
    );
    res.json(orders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /admin/orders/:id — update order status
router.patch("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /admin/products — add a new product
router.post("/products", async (req, res) => {
  try {
    const { name, description, price, image_url, stock_quantity } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const result = await pool.query(
      "INSERT INTO products (name, description, price, image_url, stock_quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, price, image_url, stock_quantity || 0],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /admin/products/:id — edit a product
router.patch("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, stock_quantity } = req.body;

    const existing = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updated = await pool.query(
      `UPDATE products SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        image_url = COALESCE($4, image_url),
        stock_quantity = COALESCE($5, stock_quantity)
       WHERE id = $6 RETURNING *`,
      [name, description, price, image_url, stock_quantity, id],
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /admin/products/:id — delete a product
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /admin/reviews/:id — remove a review
router.delete("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM reviews WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
