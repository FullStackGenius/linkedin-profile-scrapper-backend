const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: false,
      message: 'Access token is missing or malformed.',
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: false,
        message: 'Access denied. Invalid or expired token.',
        error: err.message,
      });
    }

    // Attach decoded token to req.user
    req.user = decoded;

    // Continue to next middleware or route
    next();
  });
};

module.exports = authenticateToken;
