const backendUrl =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8081';

const authUrl =
  process.env.NODE_ENV === 'production' ? '/api/auth' : 'http://localhost:300';

const dashboardUrl =
  process.env.NODE_ENV == 'production'
    ? '/dashboard'
    : 'http://localhost:8180/dashboard';

const staticUrl =
  process.env.NODE_ENV === 'production' ? '/static' : 'http://localhost:5000';

module.exports = { backendUrl, authUrl, dashboardUrl, staticUrl };
