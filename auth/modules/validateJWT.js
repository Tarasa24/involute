const { jwtSecret } = require('./credentials');
const jwt = require('jsonwebtoken');

module.exports = async function validateJWT(token, db, ip) {
  try {
    if (token == undefined) return 404;

    const payload = jwt.verify(token, jwtSecret, { ignoreExpiration: false });

    if (![ip, false, '<missing X-Real-IP header>'].includes(payload.ip))
      return 404;

    const result = await db
      .collection('users')
      .find({ name: payload.name, admin: payload.admin })
      .next();
    if (result == null) return 404;
    //detect account change
    else if (result.name != payload.name || result.admin != payload.admin)
      return 404;
    if (result.lastJWT.token != token) return 404;

    return 204;
  } catch (err) {
    console.error(err);
    return 404;
  }
};
