const logger = require('./logger');

function logRequest(request, metadata = {}) {
  try {
    const method = request.method || 'UNKNOWN';
    const url = request.url || request.nextUrl?.href || 'UNKNOWN';
    const userAgent = request.headers?.get?.('user-agent') || request.headers?.['user-agent'] || 'unknown';
    const ip = request.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() || request.headers?.get?.('x-real-ip') || 'unknown';

    logger.info('Incoming request %s %s', method, url, {
      ip,
      userAgent,
      ...metadata
    });
  } catch (error) {
    logger.warn('Request logger failed: %s', error?.message || error);
  }
}

module.exports = {
  logRequest
};
