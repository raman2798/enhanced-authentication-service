import Joi from 'joi';
import { customPassword } from './custom';

const baseSchema = {
  email: Joi.string().trim().email().required(),
  password: customPassword.required(),
};

const login = {
  body: Joi.object().keys(baseSchema),
};

export { login };
