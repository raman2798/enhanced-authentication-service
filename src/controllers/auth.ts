import { NextFunction, Request, Response } from 'express';
import { get, map } from 'lodash';
import { authService } from '../services';
import { tokenUtils, transformErrorUtils, transformResponseUtils } from '../utils';
import { IUser } from '../interfaces/users';
import { IRoles, IUserDetailForToken } from '../interfaces/auth';

const { generateToken } = tokenUtils;

const { loginUser } = authService;

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = get(req, 'body') as IUser;

    const user = await loginUser(email, password);

    const RoleIds = get(user, 'RoleIds', []) as IRoles[];

    const roles: string[] = map(RoleIds, 'type');

    const userDetailForToken: IUserDetailForToken = {
      id: get(user, 'id'),
      email,
      roles,
      name: `${get(user, 'name.first')} ${get(user, 'name.last')}`,
    };

    const token = generateToken(userDetailForToken);

    res.json(
      transformResponseUtils({
        result: {
          token,
          user: userDetailForToken,
        },
      }),
    );
  } catch (error) {
    next(transformErrorUtils(error));
  }
};

export { authenticateUser };
