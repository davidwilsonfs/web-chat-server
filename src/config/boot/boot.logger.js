import { createLogger, format, transports } from 'winston';
import debug from 'debug';
import moment from 'moment';
import mkdirp from 'mkdirp';
import appRoot from 'app-root-path';
import prettyjson from 'prettyjson';
import morgan from 'morgan';

const { combine, timestamp, printf } = format;

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}${process.env.LOGS_PATH}${process.env.LOGS_FILENAME}`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB6
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const myFormat = printf(info => {
  if (info.name === 'AppError') {
    return `\n[${info.name}] - [${moment(info.timestamp).format('L')} - ${moment(
      info.timestamp
    ).format('LTS')}]: ${prettyjson.render(info.message)}`;
  }
  if (info.name === undefined) {
    return `\n[ROUTE] - [${moment(info.timestamp).format('L')} - ${moment(info.timestamp).format(
      'LTS'
    )}]: ${info.message}`;
  }

  return `\n[${info.name}] - [${moment(info.timestamp).format('L')} - ${moment(
    info.timestamp
  ).format('LTS')}]: ${prettyjson.render(info.stack)}`;
});

const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [new transports.File(options.file), new transports.Console(options.console)],
  exitOnError: false, // do not exit on handled exceptions
});

/**
 * Utilizado para relizar o debugger de modulos do sistema
 * @param {String} message informação
 * @param {String} module nome do modulo que se quer debugar
 */
const log = (module, message) => {
  debug(`${process.env.PROJECT}: [${module}]`)(
    `[${moment().format('L')} - ${moment().format('LTS')}] ${message}`
  );
};

/**
 * Iniciliza o logger do sistema
 */
const initializerLogger = app => {
  debug.enable(`${process.env.DEBUG}`);
  mkdirp.sync(`${appRoot}${process.env.LOGS_PATH}`);
  // create a stream object with a 'write' function that will be used by `morgan`
  // create a stream object with a 'write' function that will be used by `morgan`

  if (process.env.NODE_ENV !== 'test') {
    logger.stream = {
      write(message) {
        // use the 'info' log level so the output will be picked up by both transports
        // (file and console)
        logger.info(message);
      },
    };

    app.use(morgan('combined', { stream: logger.stream }));
  }
};

export { logger, initializerLogger, log };
