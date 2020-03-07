const baseUrl = '/api';

async function getData(path, options = { code: false, params: [] }) {
  if (path.charAt(0) == '/') {
    path = path.substring(1);
  }

  var url = `${baseUrl}/${path}`;
  options.params.forEach(e => {
    url += `/${e}`;
  });

  var result = await fetch(url);

  if (result.status === 400 && options.code) return result.status;
  else return result.json();
}

module.exports = { getData };

if (process.env.NODE_ENV === 'test') {
  module.exports = baseUrl;
}
