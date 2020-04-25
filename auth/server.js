const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const bcrypt = require('bcrypt');

const validateUser = require('./modules/validateUser');
const issueJWT = require('./modules/issueJWT');
const validateJWT = require('./modules/validateJWT');
const { validate, encrypt } = require('./modules/totp');
const { log } = require('./modules/misc');
const { client, jwtSecret } = require('./modules/credentials');

const jwt = require('jsonwebtoken');

const port = 300;
const app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV == 'production' ? '*' : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

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
    const valid = await validate(totp, username, password, db);
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

app.post('/validateJWT', async (req, res) => {
  res.sendStatus(
    await validateJWT(req.cookies.Authorization, db, req.header('X-Real-IP'))
  );
});

app.get('/logout', async (req, res) => {
  await db.collection('users').updateOne(
    { 'lastJWT.token': req.cookies.Authorization },
    {
      $set: {
        'lastJWT.token': '',
      },
    }
  );
  res.clearCookie('Authorization');
  res.redirect(
    process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8080'
  );
});

app.get('/tokenPayload', (req, res) => {
  try {
    const payload = jwt.verify(req.cookies.Authorization, jwtSecret, {
      ignoreExpiration: false,
    });
    res.json(payload);
  } catch (e) {
    console.error(e);
    res.sendStatus(403);
  }
});

app.post('/createUser', async (req, res) => {
  var user = req.body;
  try {
    const payload = jwt.verify(req.cookies.Authorization, jwtSecret, {
      ignoreExpiration: false,
    });
    if (payload.tier < 3) throw 403;

    const matchingUsername = await db
      .collection('users')
      .find({ name: user.name })
      .next();

    if (matchingUsername != null) throw 409;

    user.totp = encrypt(user.totp, user.password);
    user.password = await bcrypt.hash(user.password, 12);

    await db.collection('users').insertOne(user);
    res.sendStatus(202);
  } catch (e) {
    if (typeof e == Number) res.sendStatus(e);
    else res.status(403).send(e);
  }
});

app.delete('/deleteUser/:name', (req, res) => {
  try {
    const payload = jwt.verify(req.cookies.Authorization, jwtSecret, {
      ignoreExpiration: false,
    });
    if (payload.tier < 3) throw 403;

    db.collection('users').remove({ name: req.params.name });
    res.sendStatus(202);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/updatePass/:name', async (req, res) => {
  var user = req.body;
  try {
    user.totp = encrypt(user.totp, user.password);
    user.password = await bcrypt.hash(user.password, 12);

    await db
      .collection('users')
      .updateOne(
        { name: req.params.name },
        { $set: { password: user.password, totp: user.totp } }
      );

    res.sendStatus(301);
  } catch (e) {
    res.statusStatus(403);
  }
});

app.post('/updateTotp/:name', async (req, res) => {
  var user = req.body;
  try {
    const payload = jwt.verify(req.cookies.Authorization, jwtSecret, {
      ignoreExpiration: false,
    });
    if (payload.tier < 3 && payload.name != req.params.name) throw 403;
    //Provided pass check
    const result = await db
      .collection('users')
      .find({ name: req.params.name })
      .next();
    const match = await bcrypt.compare(user.password, result.password);
    if (!match) throw 403;

    user.totp = encrypt(user.totp, user.password);

    await db
      .collection('users')
      .updateOne({ name: req.params.name }, { $set: { totp: user.totp } });
    res.sendStatus(301);
  } catch (e) {
    console.error(e);
    if (typeof e == Number) res.sendStatus(e);
    else res.status(403).send(e);
  }
});

app.post('/updateUser/:name', async (req, res) => {
  var user = req.body;
  try {
    const payload = jwt.verify(req.cookies.Authorization, jwtSecret, {
      ignoreExpiration: false,
    });
    if (payload.tier < 3 && payload.name != req.params.name) throw 403;

    await db
      .collection('users')
      .updateOne({ name: req.params.name }, { $set: user });
    res.sendStatus(202);
  } catch (e) {
    if (typeof e == Number) res.sendStatus(e);
    else res.status(403).send(e);
  }
});

app.listen(port, () =>
  console.log(`<jwt auth server> listening on port ${port}!`)
);
