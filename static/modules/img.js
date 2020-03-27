const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

function resize(path, format, width, height) {
  const readStream = fs.createReadStream(path);
  let transform = sharp();

  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height);
  }

  return readStream.pipe(transform);
}

module.exports = function img(req, res) {
  const widthString = req.query.width;
  const heightString = req.query.height;
  const format = req.query.format;
  const imgPath = req.path;
  const selfFormat = imgPath.slice(imgPath.indexOf('.')).toLowerCase();

  let width, height;
  if (widthString) width = parseInt(widthString);
  if (heightString) height = parseInt(heightString);

  if (imgPath.includes('..')) res.sendStatus(400);
  else if (!fs.existsSync(path.join(__dirname, `../public/${imgPath}`)))
    res.sendStatus(404);
  else if (
    !['.png', '.jpg', '.jpeg', '.webp', '.tiff', '.gif', '.svg'].includes(
      selfFormat
    )
  )
    res.sendFile(path.join(__dirname, `../public/${imgPath}`));
  else {
    try {
      res.type(`image/${format || 'png'}`);
      resize(
        path.join(__dirname, `../public/${imgPath}`),
        format,
        width,
        height
      ).pipe(res);
    } catch (error) {
      res.sendStatus(400);
    }
  }
};
