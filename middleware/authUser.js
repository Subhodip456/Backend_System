// middlewares/authenticateUser.js
const jwt = require('jsonwebtoken');
const jwtSecret = require('../controller/controller');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Invalid access token provided.',
    });
  }

  jwt.verify(token.replace('Bearer ', ''), jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_TOKEN',
        message: 'Invalid access token provided.',
      });
    }
    // Add the decoded token payload to the request object
    req.user = decoded;
    next();
  });
};

module.exports = authenticateUser;
