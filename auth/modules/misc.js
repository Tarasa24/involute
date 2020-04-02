function log(req, msg) {
  const now = new Date().toLocaleString('cs-CZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  console.log(
    `[${now}] ${req.header('X-Real-IP') ||
      '<missing X-Real-IP header>'}: ${msg}`
  );
}

module.exports = { log };
