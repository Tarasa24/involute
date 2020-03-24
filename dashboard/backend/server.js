const express = require('express');
const compression = require('compression');
const cors = require('cors');
const socket = require('socket.io');

const fetchFromFrontendApi = require('./modules/fetcher');
const { checkStatus } = require('./modules/socket');

const port = 8081;
const server = express();

server.use(compression());
server.use(cors());
server.use(express.json());

server.get('/*', async (req, res) => {
  const response = await fetchFromFrontendApi(req.url);
  if (response.error) {
    res.status(400);
    res.send(response.message);
  } else res.json(response);
});

server.post('/*', async (req, res) => {
  const response = await fetchFromFrontendApi(req.url, 'post', req.body);
  if (response.error) {
    res.status(400);
    res.send(response.message);
  } else res.json(response);
});

const app = server.listen(port, () =>
  console.log(
    `<${require(__dirname + '/package.json').name}> listening on port ${port}`
  )
);

const io = socket(app);
io.on('connect', socket => {
  checkStatus(socket);
});
