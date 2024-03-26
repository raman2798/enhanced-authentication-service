import Joi from 'joi';
import { merge, values } from 'lodash';
import { customObjectId } from './custom';
import { Gender } from '../enums/users';

const baseSchema = {
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.string().trim(),
  gender: Joi.string().valid(...values(Gender)),
  RoleIds: Joi.array().items(customObjectId),
  isPending: Joi.boolean(),
  isActive: Joi.boolean(),
  id: Joi.string().trim(),
  createdAt: Joi.string().trim(),
  createdBy: Joi.string().trim(),
  updatedAt: Joi.string().trim(),
  updatedBy: Joi.string().trim(),
};

const create = {
  body: Joi.object().keys(
    merge({}, baseSchema, {
      firstName: baseSchema.firstName.required(),
      lastName: baseSchema.lastName.required(),
      gender: baseSchema.gender.required(),
      RoleIds: baseSchema.RoleIds.required(),
    }),
  ),
};

const update = {
  params: Joi.object().keys({
    userId: customObjectId.required(),
  }),
  body: Joi.object().keys(baseSchema),
};

const getUserById = {
  params: Joi.object().keys({
    userId: customObjectId.required(),
  }),
};

export { create, update, getUserById };
