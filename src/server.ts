/* eslint-disable no-console */
import express, { Application } from 'express';
import { createServer, Server as HttpServer } from 'http';

import { appServer } from './config/app.config';

require('dotenv').config();
/* eslint @typescript-eslint/no-var-requires: "off" */

const app: Application = express();

process
  .on('unhandledRejection', (reason: Error) => {
    console.error('Unhandled Promise Rejection:', reason.stack || reason);
  })
  .on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception thrown:', err.stack || err);
    process.exit(1);
  });

const server: HttpServer = createServer(app);

// Call app config file with other configuration
appServer(app, server);
