import { NOT_FOUND } from 'http-status';
import { assign, get, isEmpty } from 'lodash';
import { Document } from 'mongoose';
import { RoleModel } from '../models';
import { IOptions } from '../interfaces';
import { IRole } from '../interfaces/roles';
import { IPaginationResult } from '../models/plugins/interfaces';
import { mainConfiguration } from '../config';

const {
  ROLES: {
    SUPER_ADMIN: { type: SUPER_ADMIN_TYPE },
    USER: { type: USER_TYPE },
  },
} = mainConfiguration;

// Create a role
const create = async (createBody: IRole): Promise<IRole> => {
  return await RoleModel.create(createBody);
};

// Get role by roleId
const getRoleById = async (roleId: string): Promise<IRole> => {
  const role = await RoleModel.findById(roleId);

  if (isEmpty(role)) {
    throw { statusCode: NOT_FOUND, message: 'No data found in Role' };
  }

  return role;
};

// Get all roles
const getAllRoles = async (options: IOptions): Promise<IRole[] | IPaginationResult<Document>> => {
  const roles = await RoleModel.paginationAndDownload(options);

  return roles;
};

// Update role by roleId
const updateRoleById = async (roleId: string, updateBody: Partial<IRole>): Promise<IRole> => {
  const role = await getRoleById(roleId);

  assign(role, updateBody);

  await role.save();

  return role;
};

// Get Id of super admin
const getSuperAdminRoleId = async (): Promise<string> => {
  const role = await RoleModel.findOne({ type: SUPER_ADMIN_TYPE });

  if (isEmpty(role)) {
    throw { statusCode: NOT_FOUND, message: 'No User Role Found' };
  }

  return get(role, 'id', '') as string;
};

// Get Id of user
const getUserRoleId = async (): Promise<string> => {
  const role = await RoleModel.findOne({ type: USER_TYPE });

  if (isEmpty(role)) {
    throw { statusCode: NOT_FOUND, message: 'No User Role Found' };
  }

  return get(role, 'id', '') as string;
};

export { create, updateRoleById, getAllRoles, getRoleById, getSuperAdminRoleId, getUserRoleId };
