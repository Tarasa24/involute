const credentials = require('./modules/credentials');
const novinky = require('./modules/novinky');
const hraci = require('./modules/hraci');
const eshop = require('./modules/eshop');
const express = require('express');
const cors = require('cors');
const port = 8081;
const server = express();

var db = null;
credentials.client.connect((err, client) => {
  if (err) throw err;
  db = client.db('iNvolute');
});

server.use(cors());
server.use(express.json());

server.get('/novinka/:id/neighbors', async (req, res) => {
  await novinky.neighbors(req, res, db);
});

server.get('/novinka/:id', async (req, res) => {
  await novinky.novinka(req, res, db);
});

server.get('/novinky/length', async (req, res) => {
  await novinky.length(req, res, db);
});

server.get('/novinky/:skip/:limit', async (req, res) => {
  await novinky.novinky(req, res, db);
});

server.get('/partneri', async (req, res) => {
  let result = await db
    .collection('partneri')
    .find()
    .toArray();
  res.json(result);
});

server.get('/hraci', async (req, res) => {
  await hraci.hraci(req, res, db);
});

server.get('/hrac/:game/:name', async (req, res) => {
  await hraci.hrac(req, res, db);
});

server.get('/links', async (req, res) => {
  var result = await db
    .collection('links')
    .find({})
    .toArray();

  res.json(result);
});

server.get('/produkty', async (req, res) => {
  await eshop.produkty(req, res, db);
});

server.get('/produkt/:id', async (req, res) => {
  await eshop.produkt(req, res, db);
});

server.post('/objednat', (req, res) => {
  eshop.objednat(req, res, db);
});

server.listen(port, () =>
  console.log(`<Website Backend server> listening on port ${port}`)
);
