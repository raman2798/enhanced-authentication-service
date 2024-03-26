import { NextFunction, Request, Response } from 'express';
import { flatten, floor, get, isEqual, toNumber, uniq } from 'lodash';
import { roleService, userService } from '../services';
import { transformErrorUtils, transformResponseUtils } from '../utils';
import { IOptionsWithPopulate } from '../interfaces';
import { IUser } from '../interfaces/users';
import { Status } from '../enums';

const { getUserRoleId } = roleService;

const { create, updateUserByQuery, getAllUsers, getUserByQuery } = userService;

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRoleId = await getUserRoleId();

    const createBody = {
      name: {
        first: get(req, 'body.firstName'),
        last: get(req, 'body.lastName'),
      },
      email: get(req, 'body.email'),
      gender: get(req, 'body.gender'),
      RoleIds: uniq(flatten([get(req, 'body.RoleIds'), userRoleId])),
      createdBy: get(req, 'user.id'),
      status: Status.ACTIVE,
    } as IUser;

    await create(createBody);

    res.json(
      transformResponseUtils({
        result: {},
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRoleId = await getUserRoleId();

    const {
      params: { userId },
    } = req;

    const updateBody = {
      name: {
        first: get(req, 'body.firstName'),
        last: get(req, 'body.lastName'),
      },
      email: get(req, 'body.email'),
      gender: get(req, 'body.gender'),
      RoleIds: uniq(flatten([get(req, 'body.RoleIds'), userRoleId])),
      updatedBy: get(req, 'user.id'),
    } as Partial<IUser>;

    const query = { _id: userId };

    await updateUserByQuery(query, updateBody);

    res.json(
      transformResponseUtils({
        result: {},
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const readAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      query: { page, limit, isDownload },
    } = req;

    const options: IOptionsWithPopulate = {
      page: floor(toNumber(page)),
      limit: floor(toNumber(limit)),
      isDownload: isEqual(isDownload, 'true'),
      includedFields: ['name', 'id', 'email', 'isPending'],
    };

    const users = await getAllUsers(options);

    res.json(
      transformResponseUtils({
        result: users,
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const readById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      params: { userId },
    } = req;

    const query = { _id: userId };

    const user = await getUserByQuery(query);

    res.json(
      transformResponseUtils({
        result: {
          data: user,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const userSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      query: { page, limit },
    } = req;

    const options: IOptionsWithPopulate = {
      page: floor(toNumber(page)),
      limit: floor(toNumber(limit)),
      includedFields: ['name', 'id', 'email'],
    };

    const searchValue = get(req, 'query.searchValue') as string;

    // Create a regular expression to match the search pattern
    const regex = new RegExp(searchValue, 'i'); // 'i' flag for case-insensitive search

    const query = {
      $or: [{ 'name.first': regex }, { 'name.last': regex }, { email: regex }],
    };

    const users = await getAllUsers(options, query);

    res.json(
      transformResponseUtils({
        result: {
          ...users,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

export { createUser, updateById, readAllUsers, readById, userSearch };
