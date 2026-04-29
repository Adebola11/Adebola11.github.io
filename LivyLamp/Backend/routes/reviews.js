const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

// POST /products/:id/reviews — submit a review
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { id: product_id } = req.params;
    const user_id = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_id, user_id, rating, comment],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /products/:id/reviews — get all reviews for a product
router.get("/", async (req, res) => {
  try {
    const { id: product_id } = req.params;

    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.email
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [product_id],
    );

    const avgResult = await pool.query(
      `SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS total_reviews
       FROM reviews WHERE product_id = $1`,
      [product_id],
    );

    res.json({
      reviews: result.rows,
      average_rating: avgResult.rows[0].average_rating,
      total_reviews: avgResult.rows[0].total_reviews,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
