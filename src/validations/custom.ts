import Joi, { CustomHelpers } from 'joi';

const objectId = (value: string, helpers: CustomHelpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({
      custom: `"{#label}" must be a valid id`,
    });
  }

  return value;
};

const password = (value: string, helpers: CustomHelpers) => {
  if (value.length < 8) {
    return helpers.message({
      custom: 'Password must be at least 8 characters',
    });
  }

  if (!value.match(/\d/g) || !value.match(/[a-z]/g) || !value.match(/[A-Z]/g) || !value.match(/[!"#$%&'()*+.:;<=>?@^_`{|}~-]/g)) {
    return helpers.message({
      custom: 'Password must contain at least one upper and lower letter, one number and one special character',
    });
  }

  return value;
};

const customObjectId = Joi.custom(objectId);

const customPassword = Joi.custom(password);

export { customObjectId, customPassword };
