const { ObjectId } = require('mongodb');

async function hraci(req, res, db) {
  var games = await db
    .collection('hry')
    .find({ bg: { $ne: '' } })
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
  // Replacing ids by players objects
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

module.exports = { hraci, hrac };
