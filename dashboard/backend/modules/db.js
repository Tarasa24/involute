const { client } = require('./credentials');
const { ObjectId } = require('mongodb');

let db;
client.connect((err, client) => {
  if (err) throw err;
  db = client.db('iNvolute');
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

module.exports = { replaceProdukt, deleteProdukt };
