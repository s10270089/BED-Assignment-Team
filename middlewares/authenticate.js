const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please login to continue." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Token is valid, continue to next middleware or route
  } catch (err) {
    // If token is invalid or expired
    return res.status(401).json({ error: "Please login to continue." });
  }
}

module.exports = authenticate;
