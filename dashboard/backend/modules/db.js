const { client } = require('./credentials');
const { ObjectId } = require('mongodb');

let db;
let adminDb;
client.connect((err, client) => {
  if (err) throw err;
  db = client.db('iNvolute');
  adminDb = client.db('admin');
});

async function replaceProdukt(req, res) {
  try {
    let result = await db
      .collection('eshop-produkty')
      .replaceOne({ _id: ObjectId(req.params.id) }, req.body);
    if (result === null) throw 400;
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function deleteProdukt(req, res) {
  try {
    let result = await db
      .collection('eshop-produkty')
      .deleteOne({ _id: ObjectId(req.params.id) });
    if (result === null) throw 400;
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function createProdukt(req, res) {
  try {
    let result = await db.collection('eshop-produkty').insertOne(req.body);
    if (result === null) throw 400;
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function findNovinky(req, res) {
  const key = Object.keys(req.query)[0];
  var value;
  var searchObj = {};

  if (req.query[key] !== undefined) {
    if (req.query[key].length !== 0) {
      const loc = {
        Titulek: 'title',
        Hra: 'game',
        Datum: 'date',
        ID: '_id',
      };

      try {
        if (
          req.query[key][0] === '/' &&
          req.query[key][req.query[key].length - 1] === '/'
        )
          value = RegExp(req.query[key].slice(1, -1));
        else if (loc[key] === '_id') value = ObjectId(req.query[key]);
        else value = RegExp(req.query[key], 'i');
      } catch (e) {
        res.sendStatus(400);
        return;
      }

      searchObj = { [loc[key]]: value };
    }
  }

  try {
    let result = await db
      .collection('novinky')
      .find(searchObj)
      .sort({ date: -1, created: -1 })
      .toArray();
    if (result === null) throw 400;

    if (result.length === 0) res.status(404);
    res.send(result);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function replaceNovinka(req, res) {
  try {
    let result = await db
      .collection('novinky')
      .replaceOne({ _id: ObjectId(req.params.id) }, req.body);
    if (result === null) throw 400;
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function createNovinka(req, res) {
  try {
    let result = await db.collection('novinky').insertOne(req.body);
    if (result === null) throw 400;
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function deleteNovinka(req, res) {
  try {
    let result = await db
      .collection('novinky')
      .deleteOne({ _id: ObjectId(req.params.id) });
    if (result === null) throw 400;
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function replaceOceneni(req, res) {
  try {
    let result = await db
      .collection('oceneni')
      .replaceOne({ _id: ObjectId(req.params.id) }, req.body);
    if (result === null) throw 400;
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function createOceneni(req, res) {
  try {
    let result = await db.collection('oceneni').insertOne(req.body);
    if (result === null) throw 400;
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function deleteOceneni(req, res) {
  try {
    let result = await db
      .collection('oceneni')
      .deleteOne({ _id: ObjectId(req.params.id) });
    if (result === null) throw 400;
    res.sendStatus(202);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
}

async function getUzivatele(req, res) {
  try {
    let result = await db
      .collection('users')
      .find({ tier: { $lt: 9 } })
      .project({
        password: false,
        totp: false,
        lastJWT: false,
        _id: false,
      })
      .sort({ tier: 1 })
      .toArray();
    if (result === null) throw 400;
    res.json(result);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function getUzivatel(req, res) {
  try {
    let result = await db
      .collection('users')
      .find({ name: req.params.name, tier: { $lt: 9 } })
      .project({
        password: false,
        totp: false,
        'lastJWT.token': false,
        _id: false,
      })
      .next();
    if (result === null) throw 400;
    res.json(result);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function stats(req, res) {
  try {
    const stats = await db.stats();
    const { url } = await adminDb.command({ getFreeMonitoringStatus: 1 });

    stats.url = url;

    res.json(stats);
  } catch (e) {
    res.sendStatus(500);
    console.error(e);
  }
}

module.exports = {
  replaceProdukt,
  deleteProdukt,
  createProdukt,
  findNovinky,
  replaceNovinka,
  createNovinka,
  deleteNovinka,
  replaceOceneni,
  createOceneni,
  deleteOceneni,
  getUzivatele,
  getUzivatel,
  stats,
};
