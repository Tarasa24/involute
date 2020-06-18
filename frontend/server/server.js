const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const server = express();

const dist = path.join(__dirname, '../dist');
const index = fs.readFileSync(dist + '/index.html', 'utf-8');
const port = 8080;
const injectMeta = require('./inject.js');

server.use(helmet());
server.use(compression());
server.use(/^.+\.(js|css|png|ico|webp|svg|mp4|woff)$/, (req, res, next) => {
  res.setHeader('Cache-Control', 'max-age=63072000');
  next();
});

server.use(express.static(dist));
server.all('/novinka/:id', (req, res) => {
  var dom = new JSDOM(index, { runScripts: 'outside-only' });
  injectMeta.novinka(dom, req, res);
});
server.all('/hrac/:name', (req, res) => {
  var dom = new JSDOM(index, { runScripts: 'outside-only' });
  injectMeta.hrac(dom, req, res);
});
server.all('*', async (req, res) => {
  res.sendFile(dist + '/index.html');
});

server.listen(port, () => {
  console.log('frontend-server listening on port ' + port);
});
