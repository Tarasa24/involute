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
      .find({ _id: ObjectId(req.params.id) })
      .project({ _id: false })
      .next();

    if (result === null) throw 400;

    res.json(result);
  } catch (e) {
    res.sendStatus(400);
  }
}

async function length(req, res, db) {
  let result = await db.collection('novinky').estimatedDocumentCount();
  res.json(result);
}

async function novinky(req, res, db) {
  let skip = Number(req.params.skip);
  let limit = Number(req.params.limit);
  let result = await db
    .collection('novinky')
    .find()
    .sort({ date: -1, created: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  res.json(result);
}

module.exports = { neighbors, novinka, length, novinky };
