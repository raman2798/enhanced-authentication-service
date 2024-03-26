import { UNAUTHORIZED } from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import { appConfiguration, loggerConfiguration } from '../config';
import { encryptedData } from './encryptAndDecrypt';
import { getExpireType } from './common';

const {
  jwt: { expireNumber, expireType, secretKey },
} = appConfiguration;

// Function to generate a JWT token
const generateToken = (tokenData: object): string => {
  loggerConfiguration.info('Received a request to generate a token');

  const number = expireNumber;

  const key = expireType;

  const type = getExpireType(key);

  const expires = moment().add(number, type);

  const payload: JwtPayload = {
    sub: encryptedData(JSON.stringify(tokenData)),
    iat: moment().unix(),
    exp: expires.unix(),
  };

  return jwt.sign(payload, secretKey);
};

// Function to verify a JWT token and return the token payload (or throw an error if it is not valid)
const verifyToken = (token: string): JwtPayload => {
  try {
    loggerConfiguration.info('Received a request to verify a token');

    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (error) {
    loggerConfiguration.error('Token verification failed', error);

    throw { statusCode: UNAUTHORIZED, message: 'Invalid Token' };
  }
};

export { generateToken, verifyToken };
