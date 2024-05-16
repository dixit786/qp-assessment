import express from 'express';

import joiMiddleware from '../middlewares/joi.validator.middleware';

import {
  addRoleReq,
  updateRoleReq,
} from '../utils/validationSchemas/role.schema';
import { isAuthenticated } from '../config/passport.config';
import { onAddRole, onGetAllRoles, onUpdateRoleById } from './controller';

const roleRouter = express.Router();

roleRouter
  .post('/add', isAuthenticated, joiMiddleware(addRoleReq), onAddRole )
  .get('/',isAuthenticated, onGetAllRoles)
  // .put('/:id', isAuthenticated,joiMiddleware(updateRoleReq), onUpdateRoleById);

export default roleRouter;
