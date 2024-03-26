import { ValidationError } from 'joi';

// Define the IValidate interface for validation results
export interface IValidate {
  value: IEnvVars;
  error: ValidationError;
}

// Define the IEnvVars interface
export interface IEnvVars {
  APP_VERSION: string;
  ENCRYPT_AND_DECRYPT_ALOGRITHM: string;
  ENCRYPT_AND_DECRYPT_DIGEST_ALGORITHM: string;
  ENCRYPT_AND_DECRYPT_HEX_TYPE: BufferEncoding;
  ENCRYPT_AND_DECRYPT_ITERATIONS: string;
  ENCRYPT_AND_DECRYPT_IV: string;
  ENCRYPT_AND_DECRYPT_IV_KEY_LENGTH: string;
  ENCRYPT_AND_DECRYPT_KEY_LENGTH: string;
  ENCRYPT_AND_DECRYPT_SALT: string;
  ENCRYPT_AND_DECRYPT_SECRET: string;
  ENCRYPT_AND_DECRYPT_STRING_TYPE: BufferEncoding;
  FILE_ALLOWED_EXTENSIONS: string;
  JWT_EXPIRE_NUMBER: string;
  JWT_EXPIRE_TYPE: string;
  JWT_SECRET_KEY: string;
  LOG_FILE_DAY?: string;
  LOG_FILE_ENABLE?: string;
  LOG_FILE_NAME?: string;
  LOG_FILE_SIZE?: string;
  LOG_FILE_ZIP_ARCHIVE?: string;
  MONGODB_URL: string;
  NODE_ENV: string;
  PORT: number;
}

// Define the IConfiguration interface
export interface IConfiguration {
  appVersion: string;
  encryptAndDecrypt: {
    algorithm: string;
    digestAlgorithm: string;
    hexType: BufferEncoding;
    iterations: number;
    ivKey: string;
    ivKeyLength: number;
    keyLength: number;
    salt: string;
    secret: string;
    stringType: BufferEncoding;
  };
  env: string;
  file: {
    allowedExtensions: string[];
  };
  jwt: {
    secretKey: string;
    expireNumber: number;
    expireType: string;
  };
  log: {
    day: string;
    isEnable: boolean;
    name: string;
    size: string;
    zippedArchive: boolean;
  };
  mongoDB: {
    options: IMongoDBOptions;
    url: string;
  };
  port: number;
}

export interface IMongoDBOptions {
  autoIndex: boolean;
}
