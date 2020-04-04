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

async function getTokenPayload() {
  if (process.env.NODE_ENV === 'production') {
    const authUrl =
      process.env.NODE_ENV === 'production'
        ? '/api/auth'
        : 'http://localhost:300';

    const result = await fetch(authUrl + '/tokenPayload', {
      method: 'GET',
      credentials: 'include',
    });
    return await result.json();
  } else return { name: 'Admin', tier: 9 };
}

module.exports = { getData, postData, deleteData, putData, getTokenPayload };
