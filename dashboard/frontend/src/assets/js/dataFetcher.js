const baseUrl =
  process.env.NODE_ENV === 'production'
    ? '/dashboard/api'
    : 'http://localhost:8181';

function pathMiddleware(path) {
  if (path.charAt(0) == '/') {
    path = path.substring(1);
  }
  return path;
}

async function getData(path, options = { code: false, params: [] }) {
  path = pathMiddleware(path);
  var url = `${baseUrl}/${path}`;

  options.params.forEach(e => {
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

async function deleteData(path, data) {
  path = pathMiddleware(path);
  var url = `${baseUrl}/${path}`;

  var result = await fetch(url, {
    method: 'DELETE',
    body: data,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return result;
}

async function putData(path, data) {
  path = pathMiddleware(path);
  var url = `${baseUrl}/${path}`;

  var result = await fetch(url, {
    method: 'PUT',
    body: data,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return result;
}

module.exports = { getData, postData, deleteData, putData };
