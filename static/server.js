const express = require('express');
const path = require('path');
const img = require('./modules/img');

const server = express();
const port = 3000;

server.get('/img/*', (req, res) => {
  img(req, res);
});

server.use('/', express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
  console.log(
    `<${require(__dirname + '/package.json').name}> listening on port ${port}`
  );
});
