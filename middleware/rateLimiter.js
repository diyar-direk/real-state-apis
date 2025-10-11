const rateLimit = require("express-rate-limit");

function createLimiter({
  message = "Too many requests, please try again later.",
  max = 1,
  windowMs = 10 * 60 * 60 * 1000,
} = {}) {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

module.exports = createLimiter;
