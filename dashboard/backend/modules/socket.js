const axios = require('axios');

function checkStatus(socket, status = {}) {
  const url =
    process.env.NODE_ENV === 'production'
      ? 'http://nginx/nginx_status'
      : 'http://localhost/nginx_status';
  axios.get(url).then(res => {
    res = res.data.split('\n');

    const thirdRow = res[3]
      .replace(/[^0-9., ]+/g, '')
      .slice(1, -1)
      .split(' ');
    const temp = {
      active: Number(res[0].substring(res[0].search(':') + 1, res[0].length)),
      reading: Number(thirdRow[0]),
      writing: Number(thirdRow[2]),
      idling: Number(thirdRow[4]),
    };
    if (JSON.stringify(status) !== JSON.stringify(temp)) {
      status = temp;
      socket.emit('status', JSON.stringify(status));
    }
  });

  setTimeout(() => {
    checkStatus(socket, status);
  }, 1000);
}

module.exports = { checkStatus };
