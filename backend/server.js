const credentials = require('./modules/credentials');
const { ObjectId } = require('mongodb');
const express = require('express');
var cors = require('cors');
const port = 8081;
const server = express();

var db = null;
credentials.client.connect((err, client) => {
  if (err) throw err;
  db = client.db('iNvolute');
});

server.use(cors());

server.get('/novinka/:id/neighbors', async (req, res) => {
  try {
    let pervious = await db
      .collection('novinky')
      .find({ _id: { $gt: ObjectId(req.params.id) } })
      .sort({ _id: 1 })
      .project({ _id: true })
      .next();

    let next = await db
      .collection('novinky')
      .find({ _id: { $lt: ObjectId(req.params.id) } })
      .sort({ _id: -1 })
      .project({ _id: true })
      .next();

    if (pervious === null && next === null) throw 400;
    else if (pervious === null) res.json({ pervious: null, next: next._id });
    else if (next === null) res.json({ pervious: pervious._id, next: null });
    else res.json({ pervious: pervious._id, next: next._id });
  } catch (e) {
    res.sendStatus(400);
  }
});

server.get('/novinka/:id', async (req, res) => {
  try {
    let result = await db
      .collection('novinky')
      .find({ _id: ObjectId(req.params.id) })
      .project({ _id: false })
      .next();

    if (result === null) throw 400;

    res.json(result);
  } catch (e) {
    res.sendStatus(400);
  }
});

server.get('/novinky/length', async (req, res) => {
  let result = await db.collection('novinky').estimatedDocumentCount();

  res.json(result);
});

server.get('/novinky/:skip/:limit', async (req, res) => {
  let skip = Number(req.params.skip);
  let limit = Number(req.params.limit);
  let result = await db
    .collection('novinky')
    .find()
    .skip(skip)
    .sort({ _id: -1 })
    .limit(limit)
    .toArray();
  res.json(result);
});

server.get('/partneri', async (req, res) => {
  let result = await db
    .collection('partneri')
    .find()
    .toArray();
  res.json(result);
});

server.get('/hraci', async (req, res) => {
  let result = await db
    .collection('hraci')
    .find()
    .toArray();
  res.json(result);
});

server.get('/hrac/:game/:name', async (req, res) => {
  var result = await db
    .collection('hraci')
    .find({ name_safe: req.params.game })
    .toArray();

  if (result.length == 0) return res.sendStatus(400);
  result = result[0];

  var player = {};
  var found = false;
  result.players.forEach(element => {
    if (element.name.toLowerCase() == req.params.name.toLowerCase()) {
      player = element;
      found = true;
    }
  });

  if (!found) return res.sendStatus(400);

  res.json({
    game: { name: result.name, bg: result.bg },
    player: player,
  });
});

server.get('/links', async (req, res) => {
  var result = await db
    .collection('links')
    .find({})
    .toArray();

  res.json(result);
});

server.listen(port, () =>
  console.log(`<Website Backend server> listening on port ${port}`)
);
