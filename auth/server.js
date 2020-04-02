const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const validateUser = require('./modules/validateUser');
const issueJWT = require('./modules/issueJWT');
const validateJWT = require('./modules/validateJWT');
const validateTotp = require('./modules/totp');
const { log } = require('./modules/misc');
const { client } = require('./modules/credentials');

const port = 300;
const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV == 'production' ? '*' : 'http://localhost:8080',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Příliš mnoho requestů, zkuste to znovu za 1 hodinu',
  })
);

let db;
client.connect((err, client) => {
  if (err) throw err;
  db = client.db('iNvolute');
});

app.post('/validateUser', async (req, res) => {
  try {
    const valid = await validateUser(req.body.username, req.body.password, db);
    if (valid) {
      log(req, 'User validated');
      res.status(200).send();
    } else {
      res.status(500).send();
    }
  } catch (error) {
    log(req, error);
    res.status(403).send();
  }
});

app.post('/issueJWT', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const totp = req.body.totp;
  const remember = req.body.remember;
  try {
    const valid = await validateTotp(totp, username, password, db);
    if (!valid) {
      log(req, 'Failed totp');
      throw 401;
    } else {
      const JWTToken = await issueJWT(
        username,
        password,
        remember,
        req.header('X-Real-IP'),
        db
      );

      const maxAgeMultiplier = remember ? 24 * 30 : 1;
      log(req, 'Issued JWT');
      res
        .cookie('Authorization', `${JWTToken}`, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * maxAgeMultiplier,
        })
        .status(200)
        .send();
    }
  } catch (code) {
    res.status(code).send();
  }
});

app.post('/validateJWT', (req, res) => {
  res.sendStatus(validateJWT(req.cookies.Authorization));
});

app.get('/logout', (req, res) => {
  res.clearCookie('Authorization');
  res.redirect(
    process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8080'
  );
});

app.listen(port, () =>
  console.log(`<jwt auth server> listening on port ${port}!`)
);
