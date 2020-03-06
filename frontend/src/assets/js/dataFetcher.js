const baseUrl = '/api';

async function getNovinky(skip, length) {
  var result = await fetch(`${baseUrl}/novinky/${skip}/${length}`);
  return result.json();
}

async function getNovinka(id) {
  var result = await fetch(`${baseUrl}/novinka/${id}`);

  if (result.status === 400) return result.status;
  return result.json();
}

async function getNovinkaSousedi(id) {
  var result = await fetch(`${baseUrl}/novinka/${id}/neighbors`);

  if (result.status === 400) return result.status;
  return result.json();
}

async function getPocetNovinek() {
  var result = await fetch(`${baseUrl}/novinky/length`);
  return result.json();
}

async function getPartneri() {
  var result = await fetch(`${baseUrl}/partneri`);
  return result.json();
}

async function getHraci() {
  var result = await fetch(`${baseUrl}/hraci`);
  return result.json();
}

async function getHrac(game, name) {
  var result = await fetch(`${baseUrl}/hrac/${game}/${name}`);

  if (result.status === 400) return result.status;
  else return result.json();
}

export {
  getNovinky,
  getNovinka,
  getNovinkaSousedi,
  getPocetNovinek,
  getPartneri,
  getHraci,
  getHrac,
};
