/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextFunction, Request, Response } from 'express';
import { FORBIDDEN, UNAUTHORIZED } from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { get, isEmpty, some } from 'lodash';
import { loggerConfiguration } from '../config';
import { encryptAndDecryptUtils, roleUtils, tokenUtils } from '../utils';
import { IUserDetailForToken } from '../interfaces/auth';

const { decryptedData } = encryptAndDecryptUtils;

const { hasRole } = roleUtils;

const { verifyToken } = tokenUtils;

const removeHeader = (req: Request) => {
  delete req.headers['x-forwarded-for'];
};

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    removeHeader(req);

    const token = req.get('x-auth-token');

    if (!token) {
      throw { statusCode: UNAUTHORIZED, message: 'User access token header is missing' };
    }

    const tokenData: JwtPayload = verifyToken(token);

    req.user = JSON.parse(decryptedData(get(tokenData, 'sub', '{}'))) as IUserDetailForToken;

    next();
  } catch (err: any) {
    err.statusCode = UNAUTHORIZED;

    next(err);
  }
};

const hasRequiredRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = get(req, 'user', {}) as IUserDetailForToken;

      const userRoles = get(user, 'roles', []);

      if (isEmpty(user) || isEmpty(userRoles)) {
        loggerConfiguration.info('Roles not found!');

        throw { statusCode: FORBIDDEN, message: 'Forbidden: No privileges' };
      }

      const allowed = some(roles, (allowedType) => hasRole(user, allowedType));

      if (allowed) {
        next();
      } else {
        throw { statusCode: FORBIDDEN, message: 'Forbidden: Insufficient privileges' };
      }
    } catch (err) {
      next(err);
    }
  };
};

export { authenticateUser, hasRequiredRoles };
