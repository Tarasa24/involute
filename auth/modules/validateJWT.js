const { jwtSecret } = require('./credentials');
const jwt = require('jsonwebtoken');

module.exports = function validateJWT(token) {
  try {
    jwt.verify(token, jwtSecret, { ignoreExpiration: false });
    return 204;
  } catch (err) {
    return 404;
  }
};
