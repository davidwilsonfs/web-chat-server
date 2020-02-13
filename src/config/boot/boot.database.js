import mongoose from 'mongoose';
import { log } from './boot.logger';

/**
 * Tenta reestabelecer a conexão do banco de dados
 * @param {String} url url da conexão do banco de dados
 */
const tryReconect = url => {
  setTimeout(
    () => {
      mongoose.connect(url, { useNewUrlParser: true });
    },
    5000 // tenta reconectar a cada 5 segundos
  );
};

/**
 * Abre a conexão com o banco de dados do mongo
 */
export default () => {
  const opts = {
    reconnectTries: 100000,
    reconnectInterval: 500,
    useNewUrlParser: true,
    poolSize: 10,
    bufferMaxEntries: 0,
    socketTimeoutMS: 0,
    keepAlive: true,
  };

  const dbURI = `mongodb://${process.env.MDB_HOST}:${process.env.MDB_PORT}/${process.env.MDB_NAME}`;
  log('DB', `mongodb uri ${dbURI}`);

  mongoose.connect(dbURI, opts);

  /**
   * Evento de erro do mongoose
   */
  mongoose.connection.on('error', e => {
    log('DB', `mongodb error ${e}`);
    tryReconect(dbURI);
  });

  /**
   * Evento ativado quando o banco de dados é conectado
   */
  mongoose.connection.on('connected', () => {
    log('DB', `mongodb is connected: ${dbURI}`);
  });

  /**
   * Evento ativado quando o banco de dados é desconectando
   */
  mongoose.connection.on('disconnecting', () => {
    log('DB', 'mongodb is disconnecting!!!');
  });

  /**
   * Evento ativado quando o banco de dados é desconectado
   */
  mongoose.connection.on('disconnected', () => {
    log('DB', 'mongodb is disconnected!!!');
  });

  /**
   * Evento ativado quando o banco de dados é reconectado
   */
  mongoose.connection.on('reconnected', () => {
    log('DB', `mongodb is reconnected: ${dbURI}`);
  });

  /**
   * Evento ativado quando ocorre timeout na conexão com o banco
   */
  mongoose.connection.on('timeout', e => {
    log('DB', `mongodb timeout ${e}`);
    tryReconect(dbURI);
  });
};
