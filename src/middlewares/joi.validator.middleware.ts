import Joi from 'joi';

import { Request, Response, NextFunction } from 'express';

import { messageKeys } from '../utils/enums';
import { HttpStatusCode } from '../utils/httpStatusCode';
import { CustomResponse } from '../utils/interfaces/global.interface';

const { BAD_REQUEST } = HttpStatusCode;

type RequestSource = 'body' | 'query' | 'params';

interface ValidationOptions {
  [key: string]: Joi.Schema;
}

const joiMiddleware = (options: ValidationOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      Object.entries(options).forEach(([source, schema]) => {
        const requestData = (req as any)[source as RequestSource];
        const { error } = schema.validate(requestData);
        if (error) throw error;
      });
      next();
    } catch (err: any) {
      err.stackTrace = err.details?.map(
        ({ message, context: { key } }: { message: string; context: { key: string } }) => ({
          key,
          message: message.replace(/['"]/g, ''),
        }),
      );

      const error: CustomResponse = {
        success: false,
        statusCode: err?.statusCode || BAD_REQUEST,
        statusMessage: messageKeys.requestValidationFailed,
        data: err?.stackTrace?.length > 0 ? err.stackTrace[0] : {},
      };

      next(error);
    }
  };
};

export default joiMiddleware;
