const credentials = require('./modules/credentials');
const novinky = require('./modules/novinky');
const hraci = require('./modules/hraci');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const port = 8081;
const server = express();

var db = null;
credentials.client.connect((err, client) => {
  if (err) throw err;
  db = client.db('iNvolute');
});

server.use(compression());
server.use(cors());
server.use(express.json());

server.get('/novinka/:id/neighbors', async (req, res) => {
  await novinky.neighbors(req, res, db);
});

server.get('/novinka/:id', async (req, res) => {
  await novinky.novinka(req, res, db);
});

server.get('/novinka/cover/:id', async (req, res) => {
  await novinky.cover(req, res, db);
});

server.get('/novinky/length', async (req, res) => {
  await novinky.length(req, res, db);
});

server.get('/novinky/pinned', async (req, res) => {
  await novinky.pinned(req, res, db);
});

server.get('/novinky/:skip/:limit', async (req, res) => {
  await novinky.novinky(req, res, db);
});

server.get('/novinky/tags', async (req, res) => {
  await novinky.tags(req, res, db);
});

server.get('/staff', async (req, res) => {
  var ret = { Management: [], Creators: [] };
  const response = await db
    .collection('staff')
    .find()
    .project({
      name: true,
      role: true,
      category: true,
      img: true,
    })
    .toArray();
  response.forEach(staff => {
    const category = staff.category;
    delete staff.category;
    ret[category].push(staff);
  });

  res.json(ret);
});

server.get('/staff/:name', async (req, res) => {
  var staff = await db
    .collection('staff')
    .find({ name: req.params.name })
    .next();

  if (staff == null) {
    res.sendStatus(404);
    return;
  }

  if (staff.linkedUser) {
    staff.articles = await db
      .collection('novinky')
      .find({ author: staff.linkedUser, draft: { $ne: true } })
      .project({ _id: true, title: true, sub: true, date: true })
      .toArray();
    if (staff.articles.length == 0) delete staff.articles;
  }

  delete staff.linkedUser;
  res.json(staff);
});

server.get('/partneri', async (req, res) => {
  let result = await db.collection('partneri').find().toArray();
  res.json(result);
});

server.get('/hraci', async (req, res) => {
  await hraci.hraci(req, res, db);
});

server.get('/hrac/:name', async (req, res) => {
  await hraci.hrac(req, res, db);
});

server.get('/hrac/cover/:name', async (req, res) => {
  await hraci.cover(req, res, db);
});

server.get('/links', async (req, res) => {
  var result = await db.collection('links').find({}).toArray();

  res.json(result);
});

server.get('/oceneni', async (req, res) => {
  const oceneni = await db
    .collection('oceneni')
    .find({})
    .sort({ _id: -1 })
    .toArray();

  const hry = await db
    .collection('hry')
    .find({})
    .project({ _id: true, name: true })
    .toArray();

  hryObj = {};

  hry.forEach(hra => {
    hryObj[hra._id] = hra.name;
  });

  result = oceneni;

  oceneni.forEach((e, index) => {
    result[index].game = hryObj[e.game];
  });

  res.json(result);
});

server.get('/icons', async (req, res) => {
  let result = await db
    .collection('hry')
    .find({ icon: { $ne: '' } })
    .project({ _id: true, icon: true, name: true })
    .toArray();
  res.json(result);
});

server.get('/sponzori', async (req, res) => {
  let result = await db
    .collection('sponzori')
    .find({ img: { $ne: '' } })
    .toArray();
  res.json(result);
});

server.get('/media/:skip/:limit', async (req, res) => {
  let skip = Number(req.params.skip);
  let limit = Number(req.params.limit);
  let result = await db
    .collection('media')
    .find(req.query.tag ? { tags: { $in: [req.query.tag] } } : {})
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  res.json(result);
});

server.get('/media/length', async (req, res) => {
  if (req.query.tag) {
    res.json(
      await db
        .collection('media')
        .find({ tags: { $in: [req.query.tag] } })
        .count()
    );
  } else res.json(await db.collection('media').estimatedDocumentCount());
});

server.get('/media/tags', async (req, res) => {
  try {
    const result = await db
      .collection('media')
      .find({ tags: { $exists: true } })
      .project({ tags: true })
      .toArray();

    var tags = {};
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].tags.length; j++) {
        const tag = result[i].tags[j];
        if (!tags[tag]) tags[tag] = 1;
        else tags[tag] = tags[tag] + 1;
      }
    }
    res.json(Object.entries(tags).sort((a, b) => b[1] - a[1]));
  } catch (error) {
    res.sendStatus(400);
  }
});

server.listen(port, () =>
  console.log(`<Website Backend server> listening on port ${port}`)
);
