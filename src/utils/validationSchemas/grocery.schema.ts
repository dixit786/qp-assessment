import * as Joi from 'joi';

export const addGroceryReq = {
    body: Joi.object({
        name: Joi.string().trim().max(100).required(),
        price: Joi.number().required(),
        category: Joi.string().hex().length(24).required(),
    }),
};

export const updateGroceryReq = {
    body: Joi.object({
        name: Joi.string().trim().max(100).optional(),
        price: Joi.number().optional(),
        category: Joi.string().hex().length(24).required(),
    }),
};