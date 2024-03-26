import Joi, { Schema } from 'joi';
import dotenv from 'dotenv';
import { get, isEqual, map } from 'lodash';
import path from 'path';
import { IConfiguration, IValidate } from './interfaces';

// Load environment variables from .env file
const envFilePath = path.join(__dirname, '../../.env');

dotenv.config({ path: envFilePath });

// Define the schema for the environment variables
const envVarsSchema: Schema = Joi.object({
  APP_VERSION: Joi.string().required().description('Application Version'),
  ENCRYPT_AND_DECRYPT_ALOGRITHM: Joi.string().required().description('Encrypt and decrypt algorithm'),
  ENCRYPT_AND_DECRYPT_DIGEST_ALGORITHM: Joi.string().description('Encrypt and decrypt digest algorithm'),
  ENCRYPT_AND_DECRYPT_HEX_TYPE: Joi.string().description('Encrypt and decrypt hex type'),
  ENCRYPT_AND_DECRYPT_ITERATIONS: Joi.string().description('Encrypt and decrypt iterations'),
  ENCRYPT_AND_DECRYPT_IV: Joi.string().description('Encrypt and decrypt iv key'),
  ENCRYPT_AND_DECRYPT_IV_KEY_LENGTH: Joi.string().description('Encrypt and decrypt iv key length'),
  ENCRYPT_AND_DECRYPT_KEY_LENGTH: Joi.string().description('Encrypt and decrypt key length'),
  ENCRYPT_AND_DECRYPT_SALT: Joi.string().required().description('Encrypt and decrypt salt'),
  ENCRYPT_AND_DECRYPT_SECRET: Joi.string().required().description('Encrypt and decrypt secret key'),
  ENCRYPT_AND_DECRYPT_STRING_TYPE: Joi.string().description('Encrypt and decrypt string type'),
  FILE_ALLOWED_EXTENSIONS: Joi.string().required().description('File allowed extensions'),
  JWT_EXPIRE_NUMBER: Joi.number().description('number after which token expire'),
  JWT_EXPIRE_TYPE: Joi.string().description('type of time after which token expire'),
  JWT_SECRET_KEY: Joi.string().required().description('JWT secret key'),
  LOG_FILE_DAY: Joi.string().description('Log file day'),
  LOG_FILE_ENABLE: Joi.string().description('Log file enable'),
  LOG_FILE_NAME: Joi.string().description('Log file name'),
  LOG_FILE_SIZE: Joi.string().description('Log file size'),
  LOG_FILE_ZIP_ARCHIVE: Joi.string().description('Log file zip archive'),
  MONGODB_URL: Joi.string().required().description('Mongo DB url'),
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required().description('Application environment'),
  PORT: Joi.number().default(4000),
}).unknown();

// Validate and extract environment variables
const { value: envVars, error } = envVarsSchema.validate(process.env, {
  errors: { label: 'key' },
}) as IValidate;

// Throw an error if validation fails
if (error) {
  const errorMessage: string = map(get(error, 'details'), 'message').join(', ');

  throw new Error(`Config validation error: ${errorMessage}`);
}

// Build the configuration object
const appConfiguration: IConfiguration = {
  appVersion: get(envVars, 'APP_VERSION'),
  encryptAndDecrypt: {
    algorithm: get(envVars, 'ENCRYPT_AND_DECRYPT_ALOGRITHM'),
    digestAlgorithm: get(envVars, 'ENCRYPT_AND_DECRYPT_DIGEST_ALGORITHM', 'sha256'),
    hexType: get(envVars, 'ENCRYPT_AND_DECRYPT_HEX_TYPE', 'hex'),
    iterations: Number(get(envVars, 'ENCRYPT_AND_DECRYPT_ITERATIONS', '100000')),
    ivKey: get(envVars, 'ENCRYPT_AND_DECRYPT_IV', '0102030405060708090a0b0c0d0e0f10'),
    ivKeyLength: Number(get(envVars, 'ENCRYPT_AND_DECRYPT_IV_KEY_LENGTH', '16')),
    keyLength: Number(get(envVars, 'ENCRYPT_AND_DECRYPT_KEY_LENGTH', '32')),
    salt: get(envVars, 'ENCRYPT_AND_DECRYPT_SALT'),
    secret: get(envVars, 'ENCRYPT_AND_DECRYPT_SECRET'),
    stringType: get(envVars, 'ENCRYPT_AND_DECRYPT_STRING_TYPE', 'utf8'),
  },
  env: get(envVars, 'NODE_ENV'),
  file: {
    allowedExtensions: JSON.parse(get(envVars, 'FILE_ALLOWED_EXTENSIONS')) as string[],
  },
  jwt: {
    expireNumber: Number(get(envVars, 'JWT_EXPIRE_NUMBER', '1')),
    expireType: get(envVars, 'JWT_EXPIRE_TYPE', 'h'),
    secretKey: get(envVars, 'JWT_SECRET_KEY'),
  },
  log: {
    day: get(envVars, 'LOG_FILE_DAY', '14d'),
    isEnable: isEqual(get(envVars, 'LOG_FILE_ENABLE', 'false'), 'true'),
    name: get(envVars, 'LOG_FILE_NAME', 'enhanced.authentication.service'),
    size: get(envVars, 'LOG_FILE_SIZE', '20m'),
    zippedArchive: isEqual(get(envVars, 'LOG_FILE_ZIP_ARCHIVE', 'false'), 'true'),
  },
  mongoDB: {
    options: {
      autoIndex: true,
    },
    url: get(envVars, 'MONGODB_URL'),
  },
  port: get(envVars, 'PORT'),
};

export default appConfiguration;
