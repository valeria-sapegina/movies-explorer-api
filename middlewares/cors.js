module.exports = (req, res, next) => {
  const allowedCors = [
    'http://diploma.movies.nomoredomains.work',
    'https://diploma.movies.nomoredomains.work',
    'http://api.diploma.movies.nomoredomains.work',
    'https://api.diploma.movies.nomoredomains.work',
  ];

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
