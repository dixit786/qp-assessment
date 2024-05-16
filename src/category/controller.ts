import { NextFunction, Request, RequestHandler, Response } from 'express';

// import RoleModel from '../role/role';

// import leaveType from '../leave/leaveType/leaveType';
// import leaveBalance from '../leave/leaveBalance/leaveBalance';

import { messageKeys } from '../utils/enums';
import { HttpStatusCode } from '../utils/httpStatusCode';
import { handleSuccess } from '../utils/handler';
// import { IUser } from '../utils/interfaces/user.interface';
import { addSearchFilterWithAnd } from '../utils/general';
import category from './category';

const { NOT_FOUND } = HttpStatusCode;
const { created, dataFetched, updated } = messageKeys;

export const onGetAllCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
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

    const result = await category.aggregate(pipeLine);
    
    if (result.length === limit) {
      isNext = true;
      result.pop();
    } else {
      isNext = false;
    }

    // console.log('assss', JSON.stringify(aggregationPipeline));

    // const { data = [], isNext }: any = await User.getUsers(aggregationPipeline, req.query);
    return handleSuccess(res, dataFetched, result, undefined, isNext);
  } catch (error: any) {
    next(error);
  }
};

export const onUpdateCategoryById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const payload: any = { ...req.body };

    const result = await category.findByIdAndUpdate(req.params.id, payload,{new:true}).lean();
    return handleSuccess(res, updated, result);
  } catch (error: any) {
    next(error);
  }
};

export const onAddCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const payload: any = { ...req.body };

    const result = await category.create(payload);
    return handleSuccess(res, created, result);
  } catch (error: any) {
    next(error);
  }
};
