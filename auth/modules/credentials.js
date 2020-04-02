var MongoClient = require('mongodb').MongoClient;

var url =
  process.env.NODE_ENV === 'production'
    ? 'mongodb://mongodb:27017'
    : 'mongodb://localhost:27017';
const client = new MongoClient(url, {
  useUnifiedTopology: true,
});

//for dev purposes only, this secret is never used in production
const jwtSecret =
  process.env.SECRET ||
  '699bc89a7cdb9c2589da18acda9e8e557fcdb241a6897b9dbd58a7e7780c6826';

module.exports = { client, jwtSecret };
