const express = require('express');
const compression = require('compression');
const cors = require('cors');
const socket = require('socket.io');

const fetchFromFrontendApi = require('./modules/fetcher');
const { checkStatus } = require('./modules/socket');
const db = require('./modules/db');

const port = 8181;
const server = express();

server.use(compression());
server.use(cors());
server.use(express.json({ limit: '15mb' }));

server.post('/produkt/:id', async (req, res) => {
  db.replaceProdukt(req, res);
});

server.delete('/produkt/:id', async (req, res) => {
  db.deleteProdukt(req, res);
});

server.put('/produkt', async (req, res) => {
  db.createProdukt(req, res);
});

server.get('/novinky', async (req, res) => {
  db.findNovinky(req, res);
});

server.post('/novinka/:id', (req, res) => {
  db.replaceNovinka(req, res);
});

server.put('/novinka', (req, res) => {
  db.createNovinka(req, res);
});

server.delete('/novinka/:id', (req, res) => {
  db.deleteNovinka(req, res);
});

server.post('/oceneni/:id', (req, res) => {
  db.replaceOceneni(req, res);
});

server.put('/oceneni', (req, res) => {
  db.createOceneni(req, res);
});

server.delete('/oceneni/:id', (req, res) => {
  db.deleteOceneni(req, res);
});

server.get('/uzivatele', (req, res) => {
  db.getUzivatele(req, res);
});

server.get('/uzivatel/:name', (req, res) => {
  db.getUzivatel(req, res);
});

server.get('/dbstats', (req, res) => {
  db.stats(req, res);
});

server.get('/hraci', (req, res) => {
  db.getHraci(req, res);
});

server.get('/hrac/:name', (req, res) => {
  db.getHrac(req, res);
});

server.post('/hrac/:id', (req, res) => {
  db.replaceHrac(req, res);
});

server.put('/hrac', (req, res) => {
  db.createHrac(req, res);
});

server.delete('/hrac/:id', (req, res) => {
  db.deleteHrac(req, res);
});

server.get('/*', async (req, res) => {
  const response = await fetchFromFrontendApi(req.url);
  if (response.error) {
    res.status(400);
    res.send(response.message);
  } else res.json(response);
});

server.post('/*', async (req, res) => {
  const response = await fetchFromFrontendApi(req.url, 'post', req.body);
  if (response.error) {
    res.status(400);
    res.send(response.message);
  } else res.json(response);
});

const app = server.listen(port, () =>
  console.log(
    `<${require(__dirname + '/package.json').name}> listening on port ${port}`
  )
);

const io = socket(app);
io.on('connect', socket => {
  checkStatus(socket);
});
