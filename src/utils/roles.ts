import { isEqual, some } from 'lodash';
import { IUserDetailForToken } from '../interfaces/auth';

const hasRole = (user: IUserDetailForToken, type: string): boolean => {
  return some(user.roles, (roleType) => isEqual(roleType, type));
};

export { hasRole };
