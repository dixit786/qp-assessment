import express from 'express';

import joiMiddleware from '../middlewares/joi.validator.middleware';

import { isAuthenticated } from '../config/passport.config';
import { onAddCategory, onGetAllCategory, onUpdateCategoryById } from './controller';
import { addCategoryReq, updateCategoryReq } from '../utils/validationSchemas/category.schema';

const categoryRouter = express.Router();

categoryRouter
  .post('/add', isAuthenticated, joiMiddleware(addCategoryReq), onAddCategory )
  .get('/',isAuthenticated, onGetAllCategory)
  .put('/:id', isAuthenticated,joiMiddleware(updateCategoryReq), onUpdateCategoryById);

export default categoryRouter;
