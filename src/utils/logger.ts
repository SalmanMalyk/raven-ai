import path from 'path';
import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

// create logs folder in root under src
const dir = path.join('src', 'logs');

const transports: winston.transport[] = [
  new winston.transports.File({ filename: path.join(dir, 'error.log'), level: 'error' }),
  new winston.transports.File({ filename: path.join(dir, 'app.log') }),
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.Console());
}

const Logger = winston.createLogger({
  levels,
  format,
  transports,
});

export default Logger;
