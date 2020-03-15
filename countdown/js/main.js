let d_el = document.getElementById('d');
let h_el = document.getElementById('h');
let m_el = document.getElementById('m');
let s_el = document.getElementById('s');
let date_el = document.getElementById('date');

function startTime() {
  const now = new Date();
  const finish = new Date(2020, 4, 1, 12);

  var split = (finish.getTime() - now.getTime()) / 1000;

  const d = Math.floor(split / (24 * 3600));
  split = split % (24 * 3600);
  const h = Math.floor(split / 3600);
  split = split % 3600;
  const m = Math.floor(split / 60);
  split = split % 60;
  const s = Math.floor(split);

  d_el.innerHTML = format(d);
  h_el.innerHTML = format(h);
  m_el.innerHTML = format(m);
  s_el.innerHTML = format(s);

  setTimeout(startTime, 1000);
}
function format(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}
