const staticUrl =
  process.env.NODE_ENV === 'production' ? '/static' : 'http://localhost:3000';

module.exports = { staticUrl };
