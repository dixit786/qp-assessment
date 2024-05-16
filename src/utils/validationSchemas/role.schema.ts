import * as Joi from 'joi';

export const addRoleReq = {
    body: Joi.object({
      roleName: Joi.string().trim().max(100).required()
    }),
};

export const updateRoleReq = {
    body: Joi.object({
      roleName: Joi.string().trim().max(100).required()
    }),
};