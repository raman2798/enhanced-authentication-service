import { UNAUTHORIZED } from 'http-status';
import { getUserByEmail } from './users';
import { IUser } from '../interfaces/users';

// Login with email and password
const loginUser = async (email: string, password: string): Promise<IUser> => {
  const user = await getUserByEmail(email);

  const isPasswordMatch = await user.isPasswordMatch(password);

  if (!isPasswordMatch) {
    throw {
      statusCode: UNAUTHORIZED,
      message: 'Incorrect password',
    };
  }

  return user.populate([
    {
      path: 'RoleIds',
    },
  ]);
};

export { loginUser };
