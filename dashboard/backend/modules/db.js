const { client } = require('./credentials');
const { ObjectId } = require('mongodb');

let db;
let adminDb;
client.connect((err, client) => {
  if (err) throw err;
  db = client.db('iNvolute');
  adminDb = client.db('admin');
});

function insert(collection, data) {
  return new Promise(async resolve => {
    try {
      const result = await db.collection(collection).insertOne(data);
      resolve({ status: 202, id: result.insertedId });
    } catch (e) {
      resolve(400);
    }
  });
}

function replace(collection, findObj, data) {
  return new Promise(async resolve => {
    try {
      await db.collection(collection).replaceOne(findObj, data);
      resolve(202);
    } catch (e) {
      resolve(400);
    }
  });
}

function remove(collection, removeObj) {
  return new Promise(async resolve => {
    try {
      await db.collection(collection).deleteOne(removeObj);
      resolve(202);
    } catch (e) {
      resolve(400);
    }
  });
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
        ID: '_id',
        Koncepty: 'draft',
        Připnuté: 'pinned',
      };

      try {
        if (
          req.query[key][0] === '/' &&
          req.query[key][req.query[key].length - 1] === '/'
        )
          value = RegExp(req.query[key].slice(1, -1));
        else if (loc[key] === '_id') value = ObjectId(req.query[key]);
        else if (loc[key] === 'draft') value = Boolean(req.query[key]);
        else if (loc[key] === 'pinned') value = Boolean(req.query[key]);
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
      .sort({ pinned: -1, date: -1 })
      .project({ bg: false, text: false })
      .toArray();
    if (result === null) throw 400;

    if (result.length === 0) res.status(404);

    result.sort((a, b) => {
      if (a.date == b.date && a.created > b.created) return -1;
      if (a.date == b.date && a.created < b.created) return 1;
      else return 0;
    });

    res.send(result);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function getNovinka(req, res) {
  try {
    const result = await db
      .collection('novinky')
      .find({ _id: ObjectId(req.params.id) })
      .next();
    res.json(result);
  } catch (error) {
    res.sendStatus(400);
  }
}

async function getUzivatele(req, res) {
  try {
    let result = await db
      .collection('users')
      .find({ name: { $ne: 'Admin' } })
      .project({
        password: false,
        totp: false,
        lastJWT: false,
        _id: false,
      })
      .sort({ name: 1 })
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
      .find({ $and: [{ name: req.params.name }, { name: { $ne: 'Admin' } }] })
      .project({
        name: true,
        'lastJWT.timestamp': true,
      })
      .next();
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
  }
}

async function getHraci(req, res) {
  try {
    let result = await db
      .collection('hraci')
      .find({})
      .project(
        req.query.img
          ? { _id: true, name: true }
          : { _id: true, name: true, img: true }
      )
      .toArray();
    if (result === null) throw 400;
    res.json(result);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function getHrac(req, res) {
  try {
    let result = await db
      .collection('hraci')
      .find({ name: req.params.name })
      .next();
    if (result === null) throw 400;
    res.json(result);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function getHry(req, res) {
  try {
    let games = await db.collection('hry').find({}).toArray();

    // Loading all players in question
    var players = [];
    games.forEach(game => {
      players = players.concat(game.players);
    });
    // Fetching
    players = await db
      .collection('hraci')
      .find({ _id: { $in: players } })
      .project({ sestava: false, links: false, text: false, img: false })
      .toArray();
    // Putting them into object
    playersObj = {};
    players.forEach(player => {
      playersObj[player._id] = player;
    });
    // Replacing ids by the players objects
    for (let i = 0; i < games.length; i++) {
      var arr = [];
      games[i].players.forEach(id => {
        arr.push(playersObj[id]);
      });
      games[i].players = arr;
    }

    res.json(games);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function pushPlayerToList(req, res) {
  try {
    await db
      .collection('hry')
      .updateOne(
        { _id: ObjectId(req.params.gameId) },
        { $push: { players: ObjectId(req.body.playerId) } }
      );
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function popPlayerFromList(req, res) {
  try {
    await db
      .collection('hry')
      .updateOne(
        { _id: ObjectId(req.params.gameId) },
        { $pull: { players: ObjectId(req.body.playerId) } }
      );
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function updateGameKey(req, res) {
  try {
    await db
      .collection('hry')
      .updateOne(
        { _id: ObjectId(req.params.gameId) },
        { $set: { [req.params.key]: req.body[req.params.key] } }
      );
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function updateMedia(req, res, id, gallery) {
  try {
    await db
      .collection('media')
      .updateOne({ _id: ObjectId(id) }, { $set: { gallery: gallery } });
    res.status(202).json({ id: id, gallery: gallery });
  } catch (e) {
    res.sendStatus(400);
  }
}

async function pin(req, res) {
  try {
    await db
      .collection('novinky')
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: { pinned: true } });
    res.sendStatus(202);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function unpin(req, res) {
  try {
    await db
      .collection('novinky')
      .updateOne({ _id: ObjectId(req.params.id) }, { $unset: { pinned: '' } });
    res.sendStatus(202);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
}

module.exports = {
  replace,
  remove,
  insert,
  findNovinky,
  getNovinka,
  getUzivatele,
  getUzivatel,
  stats,
  getHraci,
  getHrac,
  getHry,
  pushPlayerToList,
  popPlayerFromList,
  updateGameKey,
  updateMedia,
  pin,
  unpin,
};
