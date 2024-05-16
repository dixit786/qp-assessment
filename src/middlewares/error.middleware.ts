/* eslint-disable no-underscore-dangle */
import HttpException from '../utils/httpException';
import { errorKeys, messageKeys } from '../utils/enums';
import { HttpStatusCode } from '../utils/httpStatusCode';
import { NextFunction, Request, Response } from 'express';
import { CustomResponse } from '../utils/interfaces/global.interface';

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { validationError, invalidJson, malformedData } = errorKeys;

/* eslint-disable @typescript-eslint/no-unused-vars */
export const errorHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;

  let statusMessage = err?.message || err?.statusMessage || messageKeys.internalError;

  
  if (err?.message?.includes('E11000') && err?.code === 11000) {
    if (err?.keyValue) {
      statusMessage = `${Object.keys(err?.keyValue)[0]} is already exists`;
      console.log(statusMessage)
    } else {
      let m: any = statusMessage
      ?.substr(statusMessage?.indexOf('{'), statusMessage?.length)
      .match(/{.*?}/);
      m = m[0].match(/[a-zA-Z]+/);
      statusMessage = `Duplicate entry for ${m[0]} value: ${err?.writeErrors[0]?.err?.op[m[0]]}`;
    }
  }

  const data = manageError(err);
  if (res) {
    statusMessage = changeLanguageMessage(res, statusMessage);
  }
  const failResponse: CustomResponse = { success: false, statusCode, statusMessage, data };
  const getEncryptedRes: any = failResponse;

  res.status(statusCode).json(getEncryptedRes);
};

const changeLanguageMessage = (res: any, message: string) => {
  if (message === validationError) {
    return res?.__(messageKeys.validationError);
  } else if (message.includes(invalidJson)) {
    return messageKeys.invalidJsonError;
  } else if (message.includes(malformedData)) {
    return res?.__(messageKeys.invalidRequestBody);
  }
  return res?.__(message);
};

export const manageError = (getError: any) => {
  const { errors, error, data } = getError;
  if (errors) {
    return errors;
  } else if (error) {
    return error;
  } else if (data) {
    return data;
  }
  return {};
};
