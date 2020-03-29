const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const dirTree = require('directory-tree');
const path = require('path');

const img = require('./modules/img');
const upload = require('./modules/upload');
const remove = require('./modules/remove');

const server = express();
const port = 3000;

server.use(cors());
server.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath: true,
  })
);

server.get('/img/*', (req, res) => {
  img(req, res);
});

server.use('/', express.static(path.join(__dirname, 'public')));

server.post('/upload/*', (req, res) => {
  upload.upload(req, res);
});

server.put('/*', (req, res) => {
  upload.mkdir(req, res);
});

server.delete('/*', (req, res) => {
  remove(req, res);
});

server.get('/tree', (req, res) => {
  res.json(
    dirTree(path.join(__dirname, './public'), {
      normalizePath: true,
      exclude: /.gitkeep/,
    })
  );
});

server.listen(port, () => {
  console.log(
    `<${require(__dirname + '/package.json').name}> listening on port ${port}`
  );
});
