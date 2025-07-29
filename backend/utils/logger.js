// import winston from 'winston';

// const { combine, timestamp, json, colorize, align, printf } = winston.format;

// // Define different formats for console and file logs
// const consoleFormat = combine(
//   colorize({ all: true }),
//   timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
//   align(),
//   printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
// );

// const fileFormat = combine(
//   timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
//   json()
// );

// const logger = winston.createLogger({
//   level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
//   format: fileFormat, // Default format for files
//   transports: [
//     new winston.transports.File({
//       filename: 'logs/error.log',
//       level: 'error',
//     }),
//     new winston.transports.File({ filename: 'logs/combined.log' }),
//   ],
//   exceptionHandlers: [
//     new winston.transports.File({ filename: 'logs/exceptions.log' }),
//   ],
//   rejectionHandlers: [
//     new winston.transports.File({ filename: 'logs/rejections.log' }),
//   ],
// });

// // In development, also log to the console with a simpler format
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(
//     new winston.transports.Console({
//       format: consoleFormat,
//     })
//   );
// }

// // Create a stream object with a 'write' function that will be used by morgan
// // Morgan will use this stream to proxy its HTTP request logs to Winston
// const morganStream = {
//   write: (message) => {
//     // Use the 'http' log level so the output is picked up by Winston
//     logger.http(message.trim());
//   },
// };

// export { logger, morganStream };

import winston from 'winston';
import fs from 'fs';

const { combine, timestamp, json, colorize, align, printf } = winston.format;
const logDir = 'logs';

// Create the log directory if it does not exist
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define different formats
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  json()
);

// --- START: Updated Transports Logic ---
const transports = [
  // Always log to the console. Render will capture this.
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? json() : consoleFormat,
  }),
];

// Only log to files if NOT in production (i.e., when you are running locally)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat,
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log', 
      format: fileFormat 
    })
  );
}
// --- END: Updated Transports Logic ---

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports, // Use the dynamically created transports array
  exceptionHandlers: [
    // In production, log exceptions to console. Locally, log to file.
    process.env.NODE_ENV === 'production'
      ? new winston.transports.Console()
      : new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    process.env.NODE_ENV === 'production'
      ? new winston.transports.Console()
      : new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export { logger, morganStream };