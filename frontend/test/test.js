var assert = require('assert');

process.env.PROD = true;

test('Base url for api requests should be /api', () => {
  let baseUrl = require('../src/assets/js/dataFetcher');

  console.log(process.env.PROD);
  expect(baseUrl).toBe('/api');
});
