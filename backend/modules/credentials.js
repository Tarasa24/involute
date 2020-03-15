var MongoClient = require('mongodb').MongoClient;
var url = process.env.PROD
  ? 'mongodb://mongodb:27017'
  : 'mongodb://localhost:27017';
const client = new MongoClient(url, {
  useUnifiedTopology: true,
});
module.exports = { client, url };
