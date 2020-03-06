var assert = require('assert');

test('Base url for api requests should be /api', () => {
  let baseUrl = require('../src/assets/js/dataFetcher');

  expect(baseUrl).toBe('/api');
});
