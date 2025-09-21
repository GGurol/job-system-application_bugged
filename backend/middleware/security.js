const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false
  });
};

const securityMiddleware = (app) => {
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use('/api/auth', createRateLimiter(15 * 60 * 1000, 5, 'Too many auth attempts'));
  app.use('/api/jobs/apply', createRateLimiter(60 * 1000, 10, 'Too many applications per minute'));
  app.use('/api/', createRateLimiter(15 * 60 * 1000, 100, 'Too many requests'));
};

module.exports = { securityMiddleware, createRateLimiter };
