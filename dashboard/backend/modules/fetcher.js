const axios = require('axios');

module.exports = async function fetchFromFrontendApi(
  path,
  method = 'get',
  data = undefined
) {
  const url =
    process.env.NODE_ENV === 'production'
      ? 'http://backend:8081'
      : 'http://localhost:8081';

  try {
    const result = await axios({
      method: method,
      url: url + path,
      data: data,
    });
    return result.data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};
