const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const uuid = require('uuid-random');
const { CronJob } = require('cron');
const findRemoveSync = require('find-remove');

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const compression = require('compression');

const port = 5000;
const server = express();
server.use(cors());
server.use(express.json());
server.use(fileUpload());
server.use(compression());

server.use('/', express.static(path.join(__dirname, 'public')));

server.post('/api/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  try {
    const tempUrl = path.join(__dirname, 'public/temp');
    var urls = [];

    if (req.files['files[]'].length === undefined)
      req.files['files[]'] = [req.files['files[]']];

    for (const file of req.files['files[]']) {
      let fileName;
      const extension = mime.extension(file.mimetype);

      while (1) {
        fileName = uuid();
        if (!fs.existsSync(`${tempUrl}/${fileName}.${extension}`)) break;
      }

      await file.mv(`${tempUrl}/${fileName}.${extension}`);
      urls.push(`/temp/${fileName}.${extension}`);
    }

    res.status(202).json(urls);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

server.post('/api/mv/:id', (req, res) => {
  try {
    var arr = [];
    for (const file of req.body) {
      if (!file.includes('/temp/')) {
        arr.push(file);
        continue;
      }

      const oldPath = file;
      const newPath = file.replace('/temp/', `/media/${req.params.id}/`);

      if (
        !fs.existsSync(path.join(__dirname, `public/media/${req.params.id}/`))
      ) {
        fs.mkdirSync(path.join(__dirname, `public/media/${req.params.id}/`));
      }

      fs.renameSync(
        path.join(__dirname, 'public' + oldPath),
        path.join(__dirname, 'public' + newPath)
      );

      arr.push(newPath);
    }

    res.json(arr);
  } catch (error) {
    if (error.code == 'ENOENT') res.sendStatus(404);
    else res.sendStatus(500);
  }
});

server.delete('/api/rmdir/:dir', (req, res) => {
  try {
    fs.rmdirSync(
      path.join(__dirname, 'public/media/' + req.params.dir.replace('..', '')),
      {
        recursive: true,
      }
    );
    res.sendStatus(200);
  } catch (error) {
    if (error.code == 'ENOENT') res.sendStatus(404);
    else res.sendStatus(500);
  }
});

server.delete('/api/rm/:file(*)', (req, res) => {
  try {
    fs.unlinkSync(
      path.join(__dirname, 'public/' + req.params.file.replace('..', ''))
    );
    res.sendStatus(200);
  } catch (error) {
    if (error.code == 'ENOENT') res.sendStatus(404);
    else res.sendStatus(500);
  }
});

server.listen(port, () =>
  console.log(
    `${require('./package.json').name} server listening on port ${port}`
  )
);

const deleteOldTempFiles = new CronJob('0 * * * *', () => {
  findRemoveSync(__dirname + path.join(__dirname, 'public/temp'), {
    age: { seconds: 60 * 60 },
  });
});
deleteOldTempFiles.start();
