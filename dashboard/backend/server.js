const express = require('express');
const compression = require('compression');
const cors = require('cors');
const socket = require('socket.io');
const { ObjectId } = require('mongodb');

const fetchFromFrontendApi = require('./modules/fetcher');
const { checkStatus } = require('./modules/socket');
const db = require('./modules/db');

const port = 8181;
const server = express();

server.use(compression());
server.use(cors());
server.use(express.json({ limit: '15mb' }));

server.post('/produkt/:id', async (req, res) => {
  res.sendStatus(
    await db.replace(
      'eshop-produkty',
      { _id: ObjectId(req.params.id) },
      req.body
    )
  );
});

server.delete('/produkt/:id', async (req, res) => {
  res.sendStatus(
    await remove('eshop-produkty', { _id: ObjectId(req.params.id) })
  );
});

server.put('/produkt', async (req, res) => {
  const { status, id } = await db.insert('eshop-produkty', req.body);
  res.status(status).json({ id: id });
});

server.get('/novinky', async (req, res) => {
  db.findNovinky(req, res);
});

server.post('/novinka/:id', async (req, res) => {
  res.sendStatus(
    await db.replace('novinky', { _id: ObjectId(req.params.id) }, req.body)
  );
  db.replaceNovinka(req, res);
});

server.put('/novinka', async (req, res) => {
  const { status, id } = await db.insert('novinky', req.body);
  res.status(status).json({ id: id });
});

server.delete('/novinka/:id', async (req, res) => {
  res.sendStatus(await db.remove('novinky', { _id: ObjectId(req.params.id) }));
});

server.post('/oceneni/:id', async (req, res) => {
  res.sendStatus(
    await db.replace('oceneni', { _id: ObjectId(req.params.id) }, req.body)
  );
});

server.put('/oceneni', async (req, res) => {
  const { status, id } = await db.insert('oceneni', req.body);
  res.status(status).json({ id: id });
});

server.delete('/oceneni/:id', async (req, res) => {
  res.sendStatus(await db.remove('oceneni', { _id: ObjectId(req.params.id) }));
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

server.post('/hrac/:id', async (req, res) => {
  res.sendStatus(
    await db.replace('hraci', { _id: ObjectId(req.params.id) }, req.body)
  );
  db.replaceHrac(req, res);
});

server.put('/hrac', async (req, res) => {
  const { status, id } = await db.insert('hraci', req.body);
  res.status(status).json({ id: id });
});

server.delete('/hrac/:id', async (req, res) => {
  res.sendStatus(await db.remove('hraci', { _id: ObjectId(req.params.id) }));
});

server.get('/hry', (req, res) => {
  db.getHry(req, res);
});

server.post('/hra/:gameId/soupiska', (req, res) => {
  db.pushPlayerToList(req, res);
});

server.delete('/hra/:gameId/soupiska', (req, res) => {
  db.popPlayerFromList(req, res);
});

server.post('/hra/:gameId/:key', (req, res) => {
  db.updateGameKey(req, res);
});

server.put('/hra', async (req, res) => {
  const { status, id } = await db.insert('hry', req.body);
  res.status(status).json({ id: id });
});

server.delete('/hra/:id', async (req, res) => {
  res.sendStatus(await db.remove('hry'), { _id: ObjectId(req.params.id) });
});

server.post('/partner/:id', async (req, res) => {
  res.sendStatus(
    await db.replace('partneri', { _id: ObjectId(req.params.id) }, req.body)
  );
});

server.delete('/partner/:id', async (req, res) => {
  res.sendStatus(await db.remove('partneri', { _id: ObjectId(req.params.id) }));
});

server.put('/partner', async (req, res) => {
  const { status, id } = await db.insert('partneri', req.body);
  res.status(status).json({ id: id });
});

server.post('/sponzor/:id', async (req, res) => {
  res.sendStatus(
    await db.replace('sponzori', { _id: ObjectId(req.params.id) }, req.body)
  );
});

server.delete('/sponzor/:id', async (req, res) => {
  res.sendStatus(await db.remove('sponzori', { _id: ObjectId(req.params.id) }));
});

server.put('/sponzor', async (req, res) => {
  const { status, id } = await db.insert('sponzori', req.body);
  res.status(status).json({ id: id });
});

server.post('/odkaz/:id', async (req, res) => {
  res.sendStatus(
    await db.replace('links', { _id: ObjectId(req.params.id) }, req.body)
  );
});

server.delete('/odkaz/:id', async (req, res) => {
  res.sendStatus(await db.remove('links', { _id: ObjectId(req.params.id) }));
  db.deleteOdkaz(req, res);
});

server.put('/odkaz', async (req, res) => {
  const { status, id } = await db.insert('links', req.body);
  res.status(status).json({ id: id });
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
