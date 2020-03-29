const path = require('path');
const fs = require('fs');

module.exports = function(req, res) {
  const destination = path.join(
    __dirname + '/../',
    req.url.replace('/', './public/')
  );
  function rmdirRecursive(dir) {
    var list = fs.readdirSync(dir);
    for (var i = 0; i < list.length; i++) {
      var filename = path.join(dir, list[i]);
      var stat = fs.statSync(filename);

      if (filename == '.' || filename == '..') {
      } else if (stat.isDirectory()) {
        rmdir(filename);
      } else {
        fs.unlinkSync(filename);
      }
    }
    fs.rmdirSync(dir);
  }

  if (fs.lstatSync(destination).isFile()) {
    try {
      fs.unlinkSync(destination);
      res.sendStatus(202);
    } catch (err) {
      res.sendStatus(400);
    }
  } else {
    try {
      rmdirRecursive(destination);
      res.sendStatus(202);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  }
};
