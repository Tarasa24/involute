const { ObjectId } = require('mongodb');

async function hraci(req, res, db) {
  var games = await db
    .collection('hry')
    .find({ bg: { $ne: '' }, players: { $ne: [] } })
    .toArray();

  // Loading all players in question
  var players = [];
  games.forEach(game => {
    players = players.concat(game.players);
  });
  // Fetching
  players = await db
    .collection('hraci')
    .find({ _id: { $in: players } })
    .project({ _id: true, img: true, name: true, links: true })
    .toArray();
  // Putting them into object
  playersObj = {};
  players.forEach(player => {
    const id = player._id;
    delete player._id;
    playersObj[id] = player;
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
}

async function hrac(req, res, db) {
  try {
    var player = await db
      .collection('hraci')
      .find({ name: req.params.name })
      .next();

    if (player == null) return res.sendStatus(400);

    var games = await db
      .collection('hry')
      .find({ players: ObjectId(player._id), bg: { $ne: '' } })
      .project({ name: true, bg: true })
      .toArray();

    res.json({
      game: games[Math.floor(Math.random() * games.length)],
      player: player,
    });
  } catch (error) {
    res.sendStatus(400);
  }
}

async function cover(req, res, db) {
  try {
    let hrac = await db
      .collection('hraci')
      .find({ name: req.params.name })
      .project({ img: true })
      .next();

    var base64 = hrac.img;
    if (base64 == undefined) res.sendStatus(404);
    else {
      const mime = base64.substring(5, base64.indexOf(';base64,'));
      base64 = base64.substring(base64.indexOf(';base64,') + ';base64,'.length);

      var img = Buffer.from(base64, 'base64');

      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Length': img.length,
      });
      res.end(img);
    }
  } catch (e) {
    res.sendStatus(400);
  }
}

module.exports = { hraci, hrac, cover };
