const rateLimit = require('express-rate-limit');

// In-memory store for rate limiting (use Redis or a shared store in production)
const memoryStore = new Map();

/**
 * Clean expired entries from memory store
 */
function cleanMemoryStore() {
  const now = Date.now();
  for (const [key, { expiry }] of memoryStore.entries()) {
    if (expiry < now) {
      memoryStore.delete(key);
    }
  }
}

/**
 * Create a rate limiter middleware
 * @param {Object} options - Rate limiter options
 * @returns {Function} Express middleware
 */
function createRateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later.',
    standardHeaders = true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders = false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests = false, // Skip failed requests (status code >= 400)
    skipSuccessfulRequests = false, // Skip successful requests
  } = options;

  // Clean memory store every 5 minutes
  setInterval(cleanMemoryStore, 5 * 60 * 1000);

  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders,
    legacyHeaders,
    skipFailedRequests,
    skipSuccessfulRequests,
    store: {
      increment: async (key) => {
        const now = Date.now();
        const windowStart = now - (now % options.windowMs);
        const windowEnd = windowStart + options.windowMs;
        
        let record = memoryStore.get(key) || { count: 0, expiry: windowEnd };
        
        if (record.expiry < now) {
          record = { count: 0, expiry: windowEnd };
        }
        
        record.count += 1;
        memoryStore.set(key, record);
        
        return record.count;
      },
      decrement: async (key) => {
        const record = memoryStore.get(key);
        if (record) {
          record.count -= 1;
          if (record.count <= 0) {
            memoryStore.delete(key);
          } else {
            memoryStore.set(key, record);
          }
        }
      },
      resetKey: async (key) => {
        memoryStore.delete(key);
      },
      reset: async () => {
        memoryStore.clear();
      },
    },
  });
}

// Specific rate limiters for different endpoints
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login requests per window
  message: 'Too many login attempts from this IP, please try again after 15 minutes.'
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});

const uploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 uploads per window
  message: 'Too many uploads from this IP, please try again after 15 minutes.'
});

module.exports = {
  authLimiter,
  apiLimiter,
  uploadLimiter,
  createRateLimiter
};