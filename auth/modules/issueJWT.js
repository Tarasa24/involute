const { jwtSecret } = require('./credentials');
const validateUser = require('./validateUser');
const jwt = require('jsonwebtoken');

async function issueJWT(username, password, remember, realIP, db) {
  function createJWT(tier) {
    const secret = jwtSecret;
    const token = jwt.sign(
      {
        name: username,
        tier: tier,
        ip: remember ? realIP || '<missing X-Real-IP header>' : false,
      },
      secret,
      {
        algorithm: 'HS256',
        expiresIn: remember ? '30d' : '1h',
      }
    );

    return token;
  }

  return new Promise(async (resolve, reject) => {
    try {
      userData = await validateUser(username, password, db);
      const token = createJWT(userData.tier);

      await db.collection('users').update(
        { name: username },
        {
          $set: {
            lastJWT: {
              token: token,
              timestamp: Math.floor(Date.now() / 1000),
            },
          },
        }
      );

      resolve(token);
    } catch (e) {
      reject(401);
    }
  });
}

module.exports = issueJWT;
