const path = require('path');
const fs = require('fs');

function upload(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.sendStatus(400);
  }
  const file = req.files.file;
  const destination = path.join(
    __dirname + '/../',
    req.url.replace('/upload/', './public/')
  );

  file.mv(destination, err => {
    if (err) {
      res.sendStatus(500);
      console.error(err);
    } else res.sendStatus(202);
  });
}

function mkdir(req, res) {
  const dir = path.join(__dirname + '/../', req.url.replace('/', './public/'));

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    res.sendStatus(202);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
}

module.exports = { upload, mkdir };
