import 'dotenv/config';
import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import moment from 'moment';
import InitServer from './bin/www';
import InitDatabase from './config/boot/boot.database';
import InitSwagger from './config/boot/boot.swagger';
import InitSystem from './config/boot/boot.seed';
import * as models from './config/boot/boot.models';
import ConfigApiRoutes from './config/boot/boot.routes';
import { initializerLogger } from './config/boot/boot.logger';
import ConfigErrorHandler from './core/exceptions/handler.error';
import socketConnection from './core/websocket/connection.weboskcet';

moment.locale('pt-br');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(compression());

const server = InitServer(app);

socketConnection(server);
initializerLogger(app);
InitDatabase();
InitSwagger(app);
InitSystem();

ConfigApiRoutes(app);
ConfigErrorHandler(app);

export { app, models, server };
