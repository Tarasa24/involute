describe('Mongodb connection', () => {
  it('Mongodb url variable in production should point to the mongodb container', () => {
    process.env.NODE_ENV = 'production';
    let url = require('../modules/credentials').url;
    expect(url).toBe('mongodb://mongodb:27017');
  });
});
