import * as Joi from 'joi';

export const addCategoryReq = {
    body: Joi.object({
        name: Joi.string().trim().max(100).required(),
    }),
};

export const updateCategoryReq = {
    body: Joi.object({
        name: Joi.string().trim().max(100).optional(),
    }),
};