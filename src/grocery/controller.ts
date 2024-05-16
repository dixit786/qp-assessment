import { NextFunction, Request, RequestHandler, Response } from 'express';

// import RoleModel from '../role/role';

// import leaveType from '../leave/leaveType/leaveType';
// import leaveBalance from '../leave/leaveBalance/leaveBalance';

import { messageKeys } from '../utils/enums';
import { HttpStatusCode } from '../utils/httpStatusCode';
import { apiError, handleSuccess } from '../utils/handler';
// import { IUser } from '../utils/interfaces/user.interface';
import { addSearchFilterWithAnd, lookup, unwind } from '../utils/general';
import grocery from './grocery';

const { NOT_FOUND } = HttpStatusCode;
const { created, dataFetched, updated, groceryNotFound } = messageKeys;

export const onGetAllGrocery: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {

    if (req?.params?.groceryId) {
      const result = await grocery.findById(req?.params?.groceryId).populate('category', "name").lean();
      if (!result) throw apiError(NOT_FOUND, groceryNotFound);
      return handleSuccess(res, dataFetched, result, undefined, false);
    }

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
        'categories',
        'category',
        '_id',
        ['name'],
        null,
        false,
        'category',
      ),
      unwind(
        'category',
        true
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

    const result = await grocery.aggregate(pipeLine);
    
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

export const onUpdateGroceryById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const payload: any = { ...req.body };

    const result = await grocery.findByIdAndUpdate(req.params.id, payload,{new:true}).lean();
    return handleSuccess(res, updated, result);
  } catch (error: any) {
    next(error);
  }
};

export const onAddGrocery: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const payload: any = { ...req.body };

    let result = await grocery.create(payload);
    return handleSuccess(res, created, result);
  } catch (error: any) {
    next(error);
  }
};
