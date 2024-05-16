import { NextFunction, Request, Response } from 'express';
import { UserModelFromOtherDB } from '../user/user';

import { messageKeys } from '../utils/enums';
import { HttpStatusCode } from '../utils/httpStatusCode';
import { handleSuccess } from '../utils/handler';
import { addIdFilter } from '../utils/general';

// const { ROLE_NOT_FOUND } = ERROR_MESSAGES;

const { OK, BAD_REQUEST } = HttpStatusCode;
const { otpSentSuccess, loginSuccess, loggedOut, invalidId } = messageKeys;

export const logout = async (req: any, res: Response, next: NextFunction) => {
  try {
    req?.session?.destroy((err: any) => {
      if (err) throw err;
    });
    return handleSuccess(res, loggedOut);
  } catch (error) {
    next(error);
  }
};

export const isLoggedIn = async (req: any, res: Response, next: NextFunction) => {
  try {
    return handleSuccess(res, loginSuccess, req?.user);
  } catch (error) {
    next(error);
  }
};


