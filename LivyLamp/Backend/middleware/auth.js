const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. Please log in." });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user.is_admin) {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
