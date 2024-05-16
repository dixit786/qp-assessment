/* eslint-disable no-console */

import logger from 'morgan';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import cors, { CorsOptionsDelegate } from 'cors';

import i18n from './i18n.config';
import { connectDb } from './db.config';
  
import indexRouter from '../routing';
import { errorHandler } from '../middlewares/error.middleware';
import { ERROR_MESSAGES } from '../constants';

const PORT: string | number = process.env.PORT || 8080;

const whitelistDomain: string[] = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://192.168.1.18:8080',
];

const corsOptions: CorsOptionsDelegate = (req: any, callback) => {
  const allowedDomain = whitelistDomain.indexOf(req?.header('origin')) !== -1;
  let corsOptions;

  if (allowedDomain) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false, credentials: false };
  }

  callback(null, corsOptions);
};

export const appServer = (app: Application, server: any) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || '027bead0c4506439ce06d3f00b2d498f13632742afb',
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({
        mongoUrl: `${process.env.DATABASE_URL}`,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native',
      }),
      cookie: {
        maxAge: process.env.COOKIE_TIMEOUT ? Number(process.env.COOKIE_TIMEOUT) : 604800000,
        // secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  app.use(cors(corsOptions));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(cookieParser());
  app.use(express.json({ limit: '50mb', type: 'application/json' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  app.use(logger('dev'));

  // i18n initialization
  app.use(i18n.init);

  connectDb()
    .then(async () => {
      console.log('Database connected');

      // START: Socket configuration and events
      // END: Socket configuration and events

      const URL_PREFIX = '/api';
      app.use(`${URL_PREFIX}`, indexRouter);
      app.use('*', (req, res) => {
        return res.status(404).json({
          success: false,
          message: ERROR_MESSAGES.ENDPOINT_NOT_FOUND,
        });
      });

      app.use(errorHandler);

      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.log('[Error in database]:', err?.message || err);
    });
};
