const crypto = require('crypto');
const config = require('./config');

function createCsrfToken() {
  return crypto
    .createHmac('sha256', config.CSRF_SECRET)
    .update(`${Date.now()}-${Math.random()}`)
    .digest('hex');
}

function verifyCsrfToken(token, expected) {
  if (!token || !expected) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch (error) {
    return false;
  }
}

module.exports = {
  createCsrfToken,
  verifyCsrfToken
};
