const { ObjectId } = require('mongodb');

async function neighbors(req, res, db) {
  try {
    let current = await db
      .collection('novinky')
      .find({ _id: ObjectId(req.params.id) })
      .next();

    let pervious = await db
      .collection('novinky')
      .find({ date: { $gt: current.date } })
      .sort({ date: 1, created: 1 })
      .project({ _id: true })
      .next();

    let next = await db
      .collection('novinky')
      .find({ date: { $lt: current.date } })
      .sort({ date: -1, created: -1 })
      .project({ _id: true })
      .next();

    if (pervious === null && next === null) throw 400;
    else if (pervious === null) res.json({ pervious: null, next: next._id });
    else if (next === null) res.json({ pervious: pervious._id, next: null });
    else res.json({ pervious: pervious._id, next: next._id });
  } catch (e) {
    res.sendStatus(400);
  }
}

async function novinka(req, res, db) {
  try {
    let result = await db
      .collection('novinky')
      .find({ _id: ObjectId(req.params.id), draft: { $ne: true } })
      .project({ _id: false, bg: false })
      .next();
    if (result === null) throw 400;

    const { name } = await db
      .collection('users')
      .find({ _id: ObjectId(result.author) })
      .project({ name: true })
      .next();

    result.author = name;

    res.json(result);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function cover(req, res, db) {
  try {
    let result = await db
      .collection('novinky')
      .find({ _id: ObjectId(req.params.id), draft: { $ne: true } })
      .project({ bg: true })
      .next();

    var base64 = result.bg;
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

async function length(req, res, db) {
  if (req.query.tag) {
    res.json(
      await db
        .collection('novinky')
        .find({ tags: { $in: [req.query.tag] } })
        .count()
    );
  } else {
    const all = await db.collection('novinky').estimatedDocumentCount();
    const exclude = await db
      .collection('novinky')
      .find({ pinned: true, draft: true })
      .count();
    res.json(all - exclude);
  }
}

async function novinky(req, res, db) {
  let skip = Number(req.params.skip);
  let limit = Number(req.params.limit);
  let find = { pinned: { $ne: true }, draft: { $ne: true } };

  if (req.query.tag)
    find = { draft: { $ne: true }, tags: { $in: [req.query.tag] } };

  let result = await db
    .collection('novinky')
    .find(find)
    .sort({ date: -1, created: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  res.json(result);
}

async function pinned(req, res, db) {
  let result = await db
    .collection('novinky')
    .find({ pinned: true })
    .sort({ date: -1, created: -1 })
    .limit(2)
    .toArray();
  res.json(result);
}

module.exports = { neighbors, novinka, cover, length, novinky, pinned };
