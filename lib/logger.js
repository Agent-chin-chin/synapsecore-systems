const fs = require('fs');
const path = require('path');
const winston = require('winston');
const config = require('./config');

const logDirectory = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define transports
const transports = [
  new winston.transports.File({
    filename: path.join(logDirectory, 'error.log'),
    level: 'error'
  }),
  new winston.transports.File({
    filename: path.join(logDirectory, 'warn.log'),
    level: 'warn'
  }),
  new winston.transports.File({
    filename: path.join(logDirectory, 'combined.log')
  })
];

if (!config.IS_PRODUCTION) {
  transports.push(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, stack }) => {
        if (stack) {
          return `${timestamp} ${level}: ${message}\n${stack}`;
        }
        return `${timestamp} ${level}: ${message}`;
      })
    )
  }));
}

const logger = winston.createLogger({
  level: config.IS_PRODUCTION ? 'info' : 'debug',
  format: logFormat,
  transports
});

module.exports = logger;