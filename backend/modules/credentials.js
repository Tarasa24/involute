var MongoClient = require('mongodb').MongoClient;
var url = process.env.NODE_ENV === 'production'
  ? 'mongodb://mongodb:27017'
  : 'mongodb://localhost:27017';
const client = new MongoClient(url, {
  useUnifiedTopology: true,
});
module.exports = { client, url };
