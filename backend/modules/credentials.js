var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://mongodb:27017';
const client = new MongoClient(url, {
  useUnifiedTopology: true,
});
module.exports = { client };

if (process.env.NODE_ENV === 'test') {
  module.exports = url;
}
