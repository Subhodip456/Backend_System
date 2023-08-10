const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({path:'config.env'});
const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateUser = (req, res, next) => {
  //const token = req.headers.authorization;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
 
  if (token==null) {
   return res.status(400).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Invalid access token provided.',
    });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_TOKEN',
        message: 'Invalid access token provided...',
      });
    }
    // Add the decoded token payload to the request object
    req.user = decoded;
    next();
  });
};

module.exports = authenticateUser;
