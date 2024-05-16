import express from 'express';

import { onAddUser, onGetAllUsers, onRemoveCart, onUpdateCart, onUpdateUserById } from './controller';
import joiMiddleware from '../middlewares/joi.validator.middleware';

import {
  addUserReq,
  updateUserReq,
  updateCartReq,
  getUserByIdReq,
} from '../utils/validationSchemas/user.schema';
import { isAuthenticated } from '../config/passport.config';

const userRouter = express.Router();

userRouter
  .post('/add', joiMiddleware(addUserReq), onAddUser )
  .get('/:userId?',isAuthenticated, joiMiddleware(getUserByIdReq), onGetAllUsers)
  .put('/:id', isAuthenticated,joiMiddleware(updateUserReq), onUpdateUserById)
  .put('/update-cart/:userId', isAuthenticated, joiMiddleware(updateCartReq),onUpdateCart )
  .delete('/delete-cart/:userId/:cartId', isAuthenticated, onRemoveCart)

export default userRouter;
