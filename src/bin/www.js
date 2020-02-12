import http from 'http';
import chalk from 'chalk';
import ip from 'ip';
// import { LISTEN, EACCES, EADDRINUSE, SERVER } from '../common';

/**
 * Avalia o erro que foi gerado ao tentar levantar o servidor
 * @param {Error} error
 */
function onError(error) {
  // if (error.syscall !== LISTEN) {
  //   throw error;
  // }
  // switch (error.code) {
  //   case EACCES:
  //     console.log(`${process.env.PORT} requires elevated privileges`, SERVER);
  //     process.exit(1);
  //     break;
  //   case EADDRINUSE:
  //     console.log(`${process.env.PORT} is already in use`, SERVER);
  //     process.exit(1);
  //     break;
  //   default:
  //     throw error;
  // }
}

/**
 * Endereço em qual o servidor esta escutando
 */
function onListening() {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`
    Localhost: ${chalk.magenta(`${process.env.API_URL}`)}
    LAN: ${chalk.magenta(`http://${ip.address()}:${process.env.PORT}`)}
    ${chalk.magenta(`Press ${chalk.italic('CTRL-C')} to stop`)}
  `);
  }
}

/**
 * Inicializa o servidor do sistema
 * @param {Express} app aplicação do express
 */
export default app => {
  const server = http.createServer(app);

  server.listen(process.env.PORT);
  server.on('error', onError);
  server.on('listening', onListening);

  return server;
};
