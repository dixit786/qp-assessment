import * as Joi from 'joi';

export const addUserReq = {
  body: Joi.object({
    name: Joi.string().trim().max(100).required(),
    email: Joi.string().trim().email().required(),
    isActive: Joi.boolean().optional(),
    role: Joi.string().hex().length(24).required(),
    password: Joi.string().trim().max(10).required(),
    createdBy: Joi.string().hex().length(24).optional().allow(null, ''),
    updatedBy: Joi.string().hex().length(24).optional().allow(null, ''),
  }),
};

export const updateUserReq = {
  body: Joi.object({
    name: Joi.string().trim().max(100).optional(),
    email: Joi.string().trim().email().optional(),
    role: Joi.string().hex().length(24).required(),
    isActive: Joi.boolean().optional(),
    password: Joi.string().trim().max(10).optional(),
    createdBy: Joi.string().hex().length(24).optional().allow(null, ''),
    updatedBy: Joi.string().hex().length(24).optional().allow(null, ''),
    cart: Joi.array().items(
      Joi.object().keys({
        grocery: Joi.string().hex().length(24).required(),
        quantity: Joi.number().required(), 
      })
    ).optional()
  }),
};

export const updateCartReq = {
  body: Joi.object({
    _id: Joi.string().hex().length(24).optional(),
    grocery: Joi.string().hex().length(24).optional(),
    quantity: Joi.number().required(), 
  })
};

export const getUserByIdReq = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
