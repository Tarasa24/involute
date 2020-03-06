let clock = document.getElementById('clock');

function startTime() {
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  clock.innerHTML = `${h} : ${m} : ${s}`;
  setTimeout(startTime, 1000);
}
function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}
