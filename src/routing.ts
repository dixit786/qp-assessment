/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import userRouter from './user/routing';
import authRouter from './auth/routing';
import roleRouter from './role/routing';
import groceryRouter from './grocery/routing';
import { checkModuleAccess } from './middlewares/checkModuleAccess';
import categoryRouter from './category/routing';

const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

router.get('/', async (req: any, res: any) => {
  return res.status(200).json({
    success: true,
    data: 'Welcome to Grocery backend!',
  });
});

router
  .use('/auth', authRouter)
  .use('/users', userRouter)
  .use('/role', roleRouter)
  .use('/grocery', groceryRouter)
  .use('/category', checkModuleAccess("Admin"), categoryRouter)

export default router;
