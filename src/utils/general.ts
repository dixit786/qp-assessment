/* eslint @typescript-eslint/no-var-requires: "off" */
const mongoObject = require('mongoose').Types.ObjectId;

export const searchParse = (search: string) => {
  ['[', ']', '{', '}', '(', ')'].forEach((sym) => {
    if (search?.includes(sym)) {
      search = search.replace(sym, '.');
    }
  });
  return search;
};

export const addSearchFilterWithOr = async (filter: any, searchKeys: string[], search: string) => {
  if (search !== '') {
    const regexObj = { $regex: new RegExp(`.*${searchParse(search)}.*`, 'i') };
    filter.$or = [];
    searchKeys.forEach((key) => {
      filter.$or.push({ [key]: regexObj });
    });
  }
  return filter;
};

export const addSearchFilterWithAnd = async (filter: any, searchKeys: string[], search: string) => {
  if (search) {
    const regexObj = { $regex: new RegExp(`.*${searchParse(search)}.*`, 'i') };
    filter.$and = filter?.$and || [];
    searchKeys.forEach((key) => {
      filter.$and.push({ [key]: regexObj });
    });
  }
  return filter;
};

export const addIdFilter = async (filter: any, searchKeys: [string], query: any) => {
  searchKeys.forEach((key) => {
    if (query[key]) {
      if (typeof query[key] === 'string') {
        filter[key] = new mongoObject(query[key]);
      }
      if (typeof query[key] === 'object') {
        const ca: any = [];
        query[key].forEach((c: any) => {
          ca.push(mongoObject(c));
        });
        filter[key] = { $in: ca };
      }
    }
  });
  return filter;
};

export const execWithCommonAggregate = async (thisKeyword: any, pipeLine: any, query: any) => {
  query.limit ? (query.limit = Number(query.limit) + 1) : (query.limit = 11);
  commonQueryForAggregate(pipeLine, query);
  const data = await thisKeyword.aggregate(pipeLine);
  let isNext = false;

  if (data.length === query.limit) {
    isNext = true;
    data.pop();
  }
  return { data, isNext };
};

export const commonQueryForAggregate = (pipeline: any, query: any) => {
  const sort = query.sort;
  if (sort) {
    const sortType = query.sortType === 'asc' ? 1 : -1;
    if (query.insensitive) {
      pipeline.push({
        $sort: {
          insensitive: sortType, // adding this for case insensitive search
        },
      });
    } else {
      pipeline.push({
        $sort: {
          [sort]: sortType,
        },
      });
    }
  }
  if (query.skip) {
    pipeline.push({ $skip: parseInt(query.skip, 10) });
  }
  if (query.limit) {
    pipeline.push({ $limit: parseInt(query.limit, 10) });
  } else {
    pipeline.push({ $limit: 10 });
  }
  return pipeline;
};

// export const addField = (fieldName, arrayField, defaultObject) => {};

export const lookup = (
  collection: any,
  localField: any,
  foreignField: any,
  projectKeys: any,
  key: any,
  isArray: any,
  as: any,
  isCustom: any = false,
) => {
  const refkey = key || localField;
  const projectObj: any = {};
  const matchBy = isArray ? '$in' : '$eq';
  const asField = as || localField;

  projectKeys.forEach((e: any) => {
    projectObj[e] = 1;
  });
  const p = [];
  if (isArray) {
    p.push({ $match: { [`${localField}`]: { $exists: true } } }); // added for not existing array VALUE
  }
  if (isCustom) {
    p.push({
      $lookup: {
        from: collection,
        let: { [`${refkey}`]: `$${localField}` },
        pipeline: [
          {
            $match: {
              $expr: { [`${matchBy}`]: [{ $toString: `$${foreignField}` }, `$$${refkey}`] },
            },
          },
          { $project: projectObj },
        ],
        as: `${asField}`,
      },
    });
  } else {
    p.push({
      $lookup: {
        from: collection,
        let: { [`${refkey}`]: `$${localField}` },
        pipeline: [
          {
            $match: {
              $expr: { [`${matchBy}`]: [`$${foreignField}`, `$$${refkey}`] },
            },
          },
          { $project: projectObj },
        ],
        as: `${asField}`,
      },
    });
  }
  return p;
};

export const unwind = (key: any, preserveValue: any) => ({
  $unwind: { path: `$${key}`, preserveNullAndEmptyArrays: !!preserveValue },
});
