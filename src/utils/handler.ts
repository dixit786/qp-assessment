import mongoose from 'mongoose';
import { Response } from 'express';
import HttpException from './httpException';
import { errorKeys, messageKeys } from './enums';
import { HttpStatusCode } from './httpStatusCode';
import { CustomResponse } from './interfaces/global.interface';

const { OK } = HttpStatusCode;

export const handleSuccess = (
  res: Response,
  message?: string,
  data: any = {},
  statusCode = OK,
  isNext?: boolean,
): Response => {
  if (message && res) message = changeLanguageMessage(res, message);

  const successRes: CustomResponse = {
    success: true,
    statusCode,
    statusMessage: message,
    data: data ? removeNulls(data) : {},
  };

  if (isNext === true || isNext === false) successRes.isNext = isNext;

  console.log(successRes)

  return res.status(OK).send(successRes);
};

export const apiError = (statusCode: number, message: string, error: any = {}) => {
  // Throw like this way
  // throw apiError(HttpStatusCode.NOT_FOUND, 'Not found');
  // return res.status(statusCode).send(message);
  return new HttpException(statusCode, message, error);
};

const changeLanguageMessage = (res: Response, message: string) => {
  if (message === errorKeys.validationError) return res.__(messageKeys.validationError);
  return res.__(message);
};

const removeNulls = (object: any) => {
  if (object) {
    Object.entries(object).forEach(([key, value]) => {
      if (value && typeof value === 'object') removeNulls(value);
      checkFromArray(object, key, value);
    });
    return object;
  }
  return {};
};

const checkFromArray = (object: any, key: string, value: any) => {
  if (
    (value && typeof value === 'object' && !Object.keys(value).length) ||
    [null, undefined].includes(value)
  ) {
    if (Array.isArray(object)) object.splice(Number(key), 1);
    else if (!(value instanceof Date) && !(value instanceof Object)) object[key] = '';
  }
};

export const isValidMongoId = (id: any) => {
  if (!mongoose.isValidObjectId(id)) {
    throw apiError(HttpStatusCode.BAD_REQUEST, messageKeys.invalidId);
  }
};

export const parseMobile = (mobile: string) =>
  mobile?.toString().replace(/\s/g, '').replace(/^0+/, '');

export const parseEmail = (email: string) => email?.toString().replace(/\s/g, '').toLowerCase();

