const rateLimitStore = new Map();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

function cleanRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.expiry <= now) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanRateLimitStore, CLEANUP_INTERVAL_MS);

function getIpFromRequest(request) {
  return (
    request.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers?.get?.('x-real-ip') ||
    'unknown'
  );
}

function createNextRateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    keyPrefix = 'next-rate-limit'
  } = options;

  return async function rateLimiter(request) {
    const ip = getIpFromRequest(request);
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    let entry = rateLimitStore.get(key);

    if (!entry || entry.expiry <= now) {
      entry = { count: 0, expiry: now + windowMs };
    }

    entry.count += 1;
    rateLimitStore.set(key, entry);

    const allowed = entry.count <= max;
    return {
      allowed,
      total: max,
      remaining: Math.max(max - entry.count, 0),
      resetIn: Math.ceil((entry.expiry - now) / 1000),
      count: entry.count
    };
  };
}

module.exports = {
  createNextRateLimiter
};
