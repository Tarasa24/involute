async function hraci(req, res, db) {
  let result = await db.collection('hraci').find().toArray();
  res.json(result);
}

async function hrac(req, res, db) {
  var result = await db
    .collection('hraci')
    .find({ name_safe: req.params.game })
    .toArray();

  if (result.length == 0) return res.sendStatus(400);
  result = result[0];

  var player = {};
  var found = false;
  result.players.forEach((element) => {
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
}

module.exports = { hraci, hrac };
