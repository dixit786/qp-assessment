import { Request, Response, NextFunction } from 'express';
import { apiError } from '../utils/handler';
import { messageKeys } from '../utils/enums';
import { HttpStatusCode } from '../utils/httpStatusCode';

const { UNAUTHORIZED, BAD_REQUEST } = HttpStatusCode;
const { internalError, notAllowed } = messageKeys;

// checkModuleAccess(["admin", "manager", "member"], "note-create")
export function checkModuleAccess(role: string): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let reqUser: any = req?.user || {};
        if (reqUser?.role?.roleName === role) return next();
        throw apiError(UNAUTHORIZED, notAllowed);
      } catch (error) {
        console.log("error ==>> ", error)
        next(error)
      }
    }
  }