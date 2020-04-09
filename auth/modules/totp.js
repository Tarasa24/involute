const speakeasy = require('speakeasy');
const crypto = require('crypto');

async function validate(totp, username, password, db) {
  async function getSecret(username, password) {
    function decrypt(text, secret) {
      var decipher = crypto.createDecipher('aes-128-cbc', secret);
      var dec = decipher.update(text, 'hex', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    }

    return new Promise(async (resolve, reject) => {
      try {
        const result = await db
          .collection('users')
          .find({ name: username })
          .next();
        if (result === null) return reject(401);

        return resolve(decrypt(result.totp, password));
      } catch (e) {
        return reject(401);
      }
    });
  }

  return new Promise(async (resolve, reject) => {
    try {
      const secret = await getSecret(username, password);
      const valid = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: totp,
        window: 1,
      });
      resolve(valid);
    } catch (code) {
      reject(code);
    }
  });
}

function encrypt(totp, password) {
  const c = crypto.createCipher('aes-128-cbc', password);
  var encrypted = c.update(totp, 'ascii', 'hex');
  encrypted += c.final('hex');

  return encrypted;
}

module.exports = { validate, encrypt };
