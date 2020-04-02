const { jwtSecret } = require('./credentials');
const validateUser = require('./validateUser');
const jwt = require('jsonwebtoken');

async function issueJWT(username, password, remember, realIP, db) {
  function createJWT() {
    const secret = jwtSecret;
    var token;
    if (remember) {
      token = jwt.sign(
        {
          Name: username,
          ip: realIP || '<missing X-Real-IP header>',
        },
        secret,
        {
          algorithm: 'HS256',
          expiresIn: '30d',
        }
      );
    } else {
      token = jwt.sign(
        {
          Name: username,
          ip: 'false',
        },
        secret,
        {
          algorithm: 'HS256',
          expiresIn: '1h',
        }
      );
    }

    return token;
  }

  return new Promise(async (resolve, reject) => {
    try {
      userData = await validateUser(username, password, db);
      const token = createJWT();
      resolve(token);
    } catch (e) {
      reject(401);
    }
  });
}

module.exports = issueJWT;
