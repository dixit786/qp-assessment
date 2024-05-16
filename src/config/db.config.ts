/* eslint-disable no-console */

import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../config.env') });

mongoose.connection.on('connected', () => {
  console.log('DB connected..');
});
mongoose.connection.on('reconnected', () => {
  console.log('DB reconnected..');
});
mongoose.connection.on('error', (error) => {
  console.log('DB connection error..', error);
  mongoose.disconnect();
});
mongoose.connection.on('disconnected', () => {
  console.log('DB disconnected..');
});

const connectDb = () => {
  console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);
  // MONGO: debugging option
  // mongoose.set("debug", true);
  return mongoose.connect(process.env.DATABASE_URL!);
};

export { connectDb };
