import Joi from 'joi';
import { customObjectId } from './custom';

const create = {
  body: Joi.object().keys({
    title: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    ProjectId: customObjectId.required(),
  }),
};

const deleteUpload = {
  params: Joi.object().keys({
    uploadId: customObjectId.required(),
  }),
};

export { create, deleteUpload };
