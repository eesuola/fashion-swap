const winston = require("winston");
const path = require("path");
const config = require("../config/config");

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = winston.createLogger({
  levels: logLevels,
  level: config.logLevel || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf((info) => {
      return (
        `${info.timestamp} ${info.logMetadata} [${info.level.toUpperCase()}]: ${info.message}` +
        (info.stack ? `\n${info.stack}` : "")
      );
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "logs", "combined.log"),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "logs", "error.log"),
      level: "error",
    }),
  ],
});

module.exports = logger;
