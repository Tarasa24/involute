const bcrypt = require('bcrypt');

module.exports = async function validateUser(username, password, db) {
  async function getUser(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db
          .collection('users')
          .find({ name: username })
          .next();
        if (result === null) return reject(401);
        return resolve(result);
      } catch (e) {
        return reject();
      }
    });
  }

  async function comparePass(pass1, pass2) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pass1, pass2, (err, result) => {
        if (err) return reject();
        if (!result) return reject();

        return resolve(result);
      });
    });
  }

  return new Promise(async function (resolve, reject) {
    getUser(username)
      .then(userData => {
        comparePass(password, userData.password)
          .then(() => {
            resolve(userData);
          })
          .catch(() => {
            reject('Password does not match');
          });
      })
      .catch(() => {
        reject('Username does not match');
      });
  });
};
