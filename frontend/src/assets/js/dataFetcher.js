const baseUrl =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8081';

function pathMiddleware(path) {
  if (path.charAt(0) == '/') {
    path = path.substring(1);
  }
  return path;
}

async function getData(path, options = { code: false, params: [] }) {
  path = pathMiddleware(path);
  var url = `${baseUrl}/${path}`;

  options.params.forEach((e) => {
    url += `/${e}`;
  });

  var result = await fetch(url);

  if (result.status === 400 && options.code) return result.status;
  else return result.json();
}

async function postData(path, data) {
  path = pathMiddleware(path);
  var url = `${baseUrl}/${path}`;

  var result = await fetch(url, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return result;
}

module.exports = { getData, postData };

if (process.env.NODE_ENV === 'test') module.exports = baseUrl;
