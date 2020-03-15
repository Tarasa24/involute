var assert = require('assert');

test('Base url for api requests should be /api', () => {
  process.env.NODE_ENV = 'production' ;
  let baseUrl = require('../src/assets/js/dataFetcher');

  console.log(process.env.PROD);
  expect(baseUrl).toBe('/api');
});
