const credentials = require('./credentials.js');
const { ObjectId } = require('mongodb');

let db;
credentials.client.connect((err, client) => {
  if (err) throw err;
  db = client.db('iNvolute');
});

function addMeta(dom, property, content) {
  dom.window.eval(
    `var meta = document.createElement('meta'); meta.setAttribute('property', '${property}'); meta.setAttribute('content', '${content}'); document.head.appendChild(meta)`
  );
}

function addTitle(dom, title) {
  dom.window.document.title = 'iNvolute | ' + title;
}

function addDescription(dom, description) {
  dom.window.document.querySelector(
    'meta[name=description]'
  ).content = description;
}

async function novinka(dom, req, res) {
  const novinka = await db
    .collection('novinky')
    .find({ _id: ObjectId(req.params.id) })
    .project({ bg: false })
    .next();
  if (novinka != null) {
    const twitter = await db
      .collection('links')
      .find({ name: 'Twitter' })
      .project({ sub: true })
      .next();

    const hostUrl = req.protocol + '://' + req.get('host');

    addTitle(dom, novinka.title);

    addDescription(dom, novinka.sub);
    addMeta(dom, 'twitter:card', 'summary_large_image');
    addMeta(
      dom,
      'twitter:site',
      twitter.sub.indexOf('@') === 0
        ? twitter.sub
        : '@' + twitter.sub.replace('/', '')
    );
    addMeta(dom, 'twitter:title', novinka.title);
    addMeta(dom, 'twitter:description', novinka.sub);
    addMeta(
      dom,
      'twitter:image:src',
      `${hostUrl}/api/novinka/cover/${req.params.id}`
    );
    addMeta(dom, 'og:title', novinka.title);
    addMeta(dom, 'og:url', hostUrl + req.originalUrl);
    addMeta(dom, 'og:type', 'article');
    addMeta(dom, 'og:image', `${hostUrl}/api/novinka/cover/${req.params.id}`);
    addMeta(dom, 'og:description', novinka.sub);
    addMeta(
      dom,
      'article:published_time',
      new Date(novinka.created * 1000).toISOString()
    );
  }

  res.send(dom.serialize());
}

async function hrac(dom, req, res) {
  const player = await db
    .collection('hraci')
    .find({ name: req.params.name })
    .project({ _id: true, role: true })
    .next();

  if (player != null) {
    var game = await db
      .collection('hry')
      .find({ players: ObjectId(player._id) })
      .project({ name: true })
      .next();

    const twitter = await db
      .collection('links')
      .find({ name: 'Twitter' })
      .project({ sub: true })
      .next();

    const hostUrl = req.protocol + '://' + req.get('host');

    addTitle(dom, 'iNvolute | ' + req.params.name);
    addDescription(dom, `${game.name} hráč celku iNvolute`);

    addMeta(dom, 'twitter:card', 'summary');
    addMeta(
      dom,
      'twitter:site',
      twitter.sub.indexOf('@') === 0
        ? twitter.sub
        : '@' + twitter.sub.replace('/', '')
    );
    addMeta(dom, 'twitter:title', req.params.name);
    addMeta(dom, 'twitter:description', `${game.name} hráč celku iNvolute`);
    addMeta(
      dom,
      'twitter:image',
      `${hostUrl}/api/hrac/cover/${req.params.name}`
    );

    addMeta(dom, 'og:title', req.params.name);
    addMeta(dom, 'og:url', hostUrl + req.originalUrl);
    addMeta(dom, 'og:type', 'website');
    addMeta(dom, 'og:image', `${hostUrl}/api/hrac/cover/${req.params.name}`);
    addMeta(dom, 'og:description', `${game.name} hráč celku iNvolute`);
  }

  res.send(dom.serialize());
}

module.exports = { novinka, hrac };
