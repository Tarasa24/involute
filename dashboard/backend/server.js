const express = require('express');
const compression = require('compression');
const cors = require('cors');
const socket = require('socket.io');
const { ObjectId } = require('mongodb');
const axios = require('axios');

const fetchFromFrontendApi = require('./modules/fetcher');
const { checkStatus } = require('./modules/socket');
const db = require('./modules/db');

const port = 8181;
const server = express();

server.use(compression());
server.use(cors());
server.use(express.json({ limit: '15mb' }));

server.get('/novinky', async (req, res) => {
  db.findNovinky(req, res);
});

server.get('/novinka/:id', async (req, res) => {
  db.getNovinka(req, res);
});

server.post('/novinka/:id', async (req, res) => {
  const keys = Object.keys(req.body);
  for (const key of keys) {
    if (!req.body[key]) delete req.body[key];
  }
  delete req.body._id;

  req.body.author = ObjectId(req.body.author);

  res.sendStatus(
    await db.replace('novinky', { _id: ObjectId(req.params.id) }, req.body)
  );
});

server.put('/novinka', async (req, res) => {
  const keys = Object.keys(req.body);
  for (const key of keys) {
    if (!req.body[key]) delete req.body[key];
  }
  const { status, id } = await db.insert('novinky', req.body);
  res.status(status).json({ id: id });
});

server.delete('/novinka/:id', async (req, res) => {
  res.sendStatus(await db.remove('novinky', { _id: ObjectId(req.params.id) }));
});

server.put('/novinky/pinned/:id', async (req, res) => {
  db.pin(req, res);
});

server.delete('/novinky/pinned/:id', async (req, res) => {
  db.unpin(req, res);
});

server.get('/novinky/tags', async (req, res) => {
  db.getTags(req, res);
});

server.post('/oceneni/:id', async (req, res) => {
  res.sendStatus(
    await db.replace('oceneni', { _id: ObjectId(req.params.id) }, req.body)
  );
});

server.put('/oceneni', async (req, res) => {
  req.body.game = req.body.game != null ? ObjectId(req.body.game) : null;
  const { status, id } = await db.insert('oceneni', req.body);
  res.status(status).json({ id: id });
});

server.delete('/oceneni/:id', async (req, res) => {
  res.sendStatus(await db.remove('oceneni', { _id: ObjectId(req.params.id) }));
});

server.post('/media/:id', async (req, res) => {
  if (req.body.type == 'images') {
    const staticUrl =
      process.env.NODE_ENV === 'production'
        ? 'http://static:5000'
        : 'http://localhost:5000';

    const response = await axios({
      method: 'POST',
      url: `${staticUrl}/api/mv/${req.params.id}`,
      data: req.body.gallery,
    });

    req.body.gallery = response.data;
  }

  res.sendStatus(
    await db.replace('media', { _id: ObjectId(req.params.id) }, req.body)
  );
});

server.put('/media', async (req, res) => {
  if (req.body.type == 'images') {
    const { id } = await db.insert('media', req.body);

    const staticUrl =
      process.env.NODE_ENV === 'production'
        ? 'http://static:5000'
        : 'http://localhost:5000';

    const response = await axios({
      method: 'POST',
      url: `${staticUrl}/api/mv/${id}`,
      data: req.body.gallery,
    });

    if (response.status === 200)
      await db.updateMedia(req, res, id, response.data);
    else res.sendStatus(response.status);
  } else {
    const { status, id } = await db.insert('media', req.body);
    res.status(status).json({ id: id });
  }
});

server.delete('/media/:id', async (req, res) => {
  if ((await db.remove('media', { _id: ObjectId(req.params.id) })) === 202) {
    const staticUrl =
      process.env.NODE_ENV === 'production'
        ? 'http://static:5000'
        : 'http://localhost:5000';

    const response = await axios({
      method: 'DELETE',
      url: `${staticUrl}/api/rmdir/${req.params.id}`,
    });
    if (response.status === 200) res.sendStatus(202);
    else res.sendStatus(response.status);
  } else res.sendStatus(400);
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

server.get('/staff', async (req, res) => {
  db.getStaff(req, res);
});

server.get('/staff/:name', async (req, res) => {
  db.getStaffProfile(req, res);
});

server.post('/staff/:id', async (req, res) => {
  if (req.body.linkedUser) req.body.linkedUser = ObjectId(req.body.linkedUser);

  res.sendStatus(
    await db.replace('staff', { _id: ObjectId(req.params.id) }, req.body)
  );
});

server.delete('/staff/:id', async (req, res) => {
  res.sendStatus(await db.remove('staff', { _id: ObjectId(req.params.id) }));
});

server.put('/staff', async (req, res) => {
  if (req.body.linkedUser) req.body.linkedUser = ObjectId(req.body.linkedUser);

  const { status, id } = await db.insert('staff', req.body);
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
