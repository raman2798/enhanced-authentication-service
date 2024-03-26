import { NextFunction, Request, Response } from 'express';
import { floor, get, isEqual, toNumber } from 'lodash';
import { roleService } from '../services';
import { transformErrorUtils, transformResponseUtils } from '../utils';
import { IOptions } from '../interfaces';
import { IRole } from '../interfaces/roles';

const { create, updateRoleById, getAllRoles, getRoleById } = roleService;

const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createBody = get(req, 'body') as IRole;

    const role = await create(createBody);

    res.json(
      transformResponseUtils({
        result: role,
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      params: { roleId },
    } = req;

    const updateBody = get(req, 'body') as Partial<IRole>;

    const role = await updateRoleById(roleId, updateBody);

    res.json(
      transformResponseUtils({
        result: role,
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const readAllRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      query: { page, limit, isDownload },
    } = req;

    const options: IOptions = {
      page: floor(toNumber(page)),
      limit: floor(toNumber(limit)),
      isDownload: isEqual(isDownload, 'true'),
    };

    const roles = await getAllRoles(options);

    res.json(
      transformResponseUtils({
        result: {
          ...roles,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

const readById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      params: { roleId },
    } = req;

    const role = await getRoleById(roleId);

    res.json(
      transformResponseUtils({
        result: { data: role },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

export { createRole, updateById, readAllRoles, readById };
