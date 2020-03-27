const express = require('express');
const cors = require('cors');
const dirTree = require('directory-tree');
const path = require('path');
const img = require('./modules/img');

const server = express();
const port = 3000;

server.use(cors());
server.get('/img/*', (req, res) => {
  img(req, res);
});

server.use('/', express.static(path.join(__dirname, 'public')));

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
