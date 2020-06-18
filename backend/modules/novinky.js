const { ObjectId } = require('mongodb');

async function neighbors(req, res, db) {
  try {
    let current = await db
      .collection('novinky')
      .find({ _id: ObjectId(req.params.id) })
      .project({ date: true })
      .next();

    let pervious = await db
      .collection('novinky')
      .find({
        date: { $gte: current.date },
        draft: { $ne: true },
      })
      .sort({ date: 1, created: 1 })
      .project({ _id: true })
      .toArray();

    let next = await db
      .collection('novinky')
      .find({
        date: { $lte: current.date },
        draft: { $ne: true },
      })
      .sort({ date: -1, created: -1 })
      .project({ _id: true })
      .toArray();

    pervious = pervious.map(e => String(e._id));
    next = next.map(e => String(e._id));

    console.log(pervious, next.length);

    if (pervious.length < 2 && next.length < 2) throw 400;
    else if (pervious.length < 2)
      res.json({
        pervious: null,
        next: next[next.indexOf(req.params.id) + 1],
      });
    else if (next.length < 2)
      res.json({
        pervious: pervious[pervious.indexOf(req.params.id) + 1],
        next: null,
      });
    else
      res.json({
        pervious: pervious[pervious.indexOf(req.params.id) + 1],
        next: next[next.indexOf(req.params.id) + 1],
      });
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

    if (result.author) {
      try {
        const { name } = await db
          .collection('staff')
          .find({ linkedUser: ObjectId(result.author) })
          .project({ name: true })
          .next();

        result.author = name;
      } catch (e) {
        delete result.author;
      }
    }
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
        .find({
          tags: { $in: [req.query.tag] },
          draft: { $ne: true },
          pinned: { $ne: true },
        })
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

async function tags(req, res, db) {
  try {
    const result = await db
      .collection('novinky')
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
}

module.exports = { neighbors, novinka, cover, length, novinky, pinned, tags };
