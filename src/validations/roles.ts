import Joi from 'joi';
import { customObjectId } from './custom';
import { merge } from 'lodash';

const baseSchema = {
  title: Joi.string().trim(),
  type: Joi.string().trim(),
  description: Joi.string().trim(),
};

const create = {
  body: Joi.object().keys(
    merge({}, baseSchema, {
      title: baseSchema.title.required(),
      type: baseSchema.type.required(),
      description: baseSchema.description.required(),
    }),
  ),
};

const update = {
  params: Joi.object().keys({
    roleId: customObjectId.required(),
  }),
  body: Joi.object().keys(baseSchema),
};

const getRoleById = {
  params: Joi.object().keys({
    roleId: customObjectId.required(),
  }),
};

export { create, update, getRoleById };
