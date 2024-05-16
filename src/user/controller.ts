import { NextFunction, Request, RequestHandler, Response } from 'express';

import  {UserModelFromOtherDB}  from './user';
// import RoleModel from '../role/role';

// import leaveType from '../leave/leaveType/leaveType';
// import leaveBalance from '../leave/leaveBalance/leaveBalance';

import { messageKeys } from '../utils/enums';
import { HttpStatusCode } from '../utils/httpStatusCode';
import { ERROR_MESSAGES, LEAVE_TYPE } from '../constants';
import { apiError, handleSuccess } from '../utils/handler';
// import { IUser } from '../utils/interfaces/user.interface';
import { addSearchFilterWithAnd, lookup } from '../utils/general';
import grocery from '../grocery/grocery';

const { NOT_FOUND } = HttpStatusCode;
const { created, dataFetched, updated,deleted, userNotFound } = messageKeys;

export const onGetAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    if (req?.params?.userId) {
      const result = await UserModelFromOtherDB.findById(req?.params?.userId).populate('role', "roleName").lean();
      if (!result) throw apiError(NOT_FOUND, userNotFound);
      return handleSuccess(res, dataFetched, result, undefined, false);
    }else{
    const filter: any = {};
    const query: any = req?.query;

    let limit = 10 +1;
    let skip = 0;
    let isNext = false;

    if (query?.search) await addSearchFilterWithAnd(filter, ['name'], query.search);

    // await addSearchFilterWithAnd(filter, ['hrxRole'], query.hrxRole);

    if (query.limit) {
      limit = Number(query.limit) + 1;
    }

    if (query.skip) {
      skip = Number(query.skip);
    }
    let sort = 'created';
    let sortType = -1
    if(query.sort && query.sortType) {
        sort = query.sort
        sortType = query.sortType == 'asc' ? 1 : -1;
      }

    const pipeLine: any[] = [
      {
        $match: {
          ...filter
        }
      },
      ...lookup(
        'roles',
        'role',
        '_id',
        ['roleName'],
        null,
        false,
        'role',
      ),
      {
        $limit: skip +limit,
      },
      {
        $skip: skip,
      },
      {
        $sort:{[sort]:sortType}
      },
    ]

    console.log(JSON.stringify(pipeLine))

    const result = await UserModelFromOtherDB.aggregate(pipeLine);
    console.log('result',result);
    
    
    if (result.length === limit) {
      isNext = true;
      result.pop();
    } else {
      isNext = false;
    }

    // console.log('assss', JSON.stringify(aggregationPipeline));

    // const { data = [], isNext }: any = await User.getUsers(aggregationPipeline, req.query);
    return handleSuccess(res, dataFetched, result, undefined, isNext);
  }
  } catch (error: any) {
    console.log(error)
    next(error);
  }
};

export const onUpdateUserById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const payload: any = { ...req.body };

    const result = await UserModelFromOtherDB.findByIdAndUpdate(req.params.id, payload,{new:true}).lean();
    return handleSuccess(res, updated, result);
  } catch (error: any) {
    next(error);
  }
};

const updatePayload: any = (payload: any, mongoKey: string) => {
  let obj: any = {}
  for (const key in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, key) && key != "_id") {
      const element = payload[key];
      obj[`${mongoKey}.$.${key}`] = element
    }
  }
  return obj
}

export const onUpdateCart: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    let payload: any = { ...req.body };

    if (payload?._id) {
      const query = {
        _id: req?.params?.userId, 
        "cart._id": payload?._id
      }

      payload = {
        ...updatePayload(payload, "cart")
      }

      const result = await UserModelFromOtherDB.findOneAndUpdate(query, payload,{new:true}).lean()

      return handleSuccess(res, updated, result);
    }

    
    payload = {
      "$push": { 
        "cart" : payload
      }
    }
    console.log(JSON.stringify(payload))
    
    const result = await UserModelFromOtherDB.findOneAndUpdate({ _id: req.params.userId }, payload, {new:true}).lean();
    return handleSuccess(res, updated, result);
  } catch (error: any) {
    next(error);
  }
};

export const onRemoveCart: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {

    const updateData = {
      "$pull": { 
        "cart" : {
          "_id": req?.params?.cartId
        }
      }
    }
    
    const result = await UserModelFromOtherDB.findOneAndUpdate({ _id: req.params.userId }, updateData , {new:true}).lean();
    return handleSuccess(res, deleted, result);
  } catch (error: any) {
    next(error);
  }
};
export const onAddUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const payload: any = { ...req.body };
    const result = await UserModelFromOtherDB.create(payload);
    return handleSuccess(res, created, result);
  } catch (error: any) {
    console.log(error)
    next(error);
  }
};
