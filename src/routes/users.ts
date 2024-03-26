import { Router } from 'express';
import { mainConfiguration } from '../config';
import { userController } from '../controllers';
import { authenticationMiddleware, validate } from '../middlewares';
import { userValidation } from '../validations';

const router: Router = Router();

const {
  ROLES: {
    SUPER_ADMIN: { type: SUPER_ADMIN_TYPE },
  },
} = mainConfiguration;

const { hasRequiredRoles } = authenticationMiddleware;

const { create, update, getUserById } = userValidation;

const { createUser, updateById, readAllUsers, readById, userSearch } = userController;

router.post('/', hasRequiredRoles([SUPER_ADMIN_TYPE]), validate(create), createUser);

router.put('/:userId', hasRequiredRoles([SUPER_ADMIN_TYPE]), validate(update), updateById);

router.get('/search', hasRequiredRoles([SUPER_ADMIN_TYPE]), userSearch);

router.get('/', hasRequiredRoles([SUPER_ADMIN_TYPE]), readAllUsers);

router.get('/:userId', hasRequiredRoles([SUPER_ADMIN_TYPE]), validate(getUserById), readById);

export default router;
