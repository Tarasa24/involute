const express = require('express');
const compression = require('compression');
const cors = require('cors');
const socket = require('socket.io');
const axios = require('axios');

const port = 8081;
const server = express();

server.use(compression());
server.use(cors());

const app = server.listen(port, () =>
  console.log(`<Website Backend server> listening on port ${port}`)
);

const io = socket(app);
io.on('connect', socket => {
  checkStatus(socket);
});

async function checkStatus(socket, status = {}) {
  axios.get('http://localhost/nginx_status').then(res => {
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
