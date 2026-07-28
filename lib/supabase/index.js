/* eslint-disable @typescript-eslint/no-require-imports */
const client = require('./client.js');
const database = require('./database.js');
const server = require('./server.js');
const middleware = require('./middleware.js');
const auth = require('./auth.js');
const admin = require('./admin.js');

module.exports = {
  ...client,
  ...database,
  ...server,
  ...middleware,
  ...auth,
  ...admin,
};

module.exports.default = module.exports;
