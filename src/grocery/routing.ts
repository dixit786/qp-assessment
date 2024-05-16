import express from 'express';

import joiMiddleware from '../middlewares/joi.validator.middleware';

import { isAuthenticated } from '../config/passport.config';
import { onAddGrocery, onGetAllGrocery, onUpdateGroceryById } from './controller';
import { addGroceryReq, updateGroceryReq } from '../utils/validationSchemas/grocery.schema';
import { checkModuleAccess } from '../middlewares/checkModuleAccess';

const groceryRouter = express.Router();

groceryRouter
  .post('/add', isAuthenticated, joiMiddleware(addGroceryReq), checkModuleAccess("Admin"), onAddGrocery )
  .get('/:groceryId?',isAuthenticated, onGetAllGrocery)
  .put('/:id', isAuthenticated,joiMiddleware(updateGroceryReq),checkModuleAccess("Admin"), onUpdateGroceryById);

export default groceryRouter;
