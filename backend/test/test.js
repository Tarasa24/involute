var assert = require('assert');

test('Mongodb url variable should point to the mongodb container', () => {
  let url = require('../modules/credentials');
  expect(url).toBe('mongodb://mongodb:27017');
});
