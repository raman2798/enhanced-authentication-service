import { Router } from 'express';
import { mainConfiguration } from '../config';
import { roleController } from '../controllers';
import { authenticationMiddleware, validate } from '../middlewares';
import { roleValidation } from '../validations';

const router: Router = Router();

const {
  ROLES: {
    SUPER_ADMIN: { type: SUPER_ADMIN_TYPE },
  },
} = mainConfiguration;

const { hasRequiredRoles } = authenticationMiddleware;

const { create, update, getRoleById } = roleValidation;

const { createRole, updateById, readAllRoles, readById } = roleController;

router.post('/', hasRequiredRoles([SUPER_ADMIN_TYPE]), validate(create), createRole);

router.put('/:roleId', hasRequiredRoles([SUPER_ADMIN_TYPE]), validate(update), updateById);

router.get('/', hasRequiredRoles([SUPER_ADMIN_TYPE]), readAllRoles);

router.get('/:roleId', hasRequiredRoles([SUPER_ADMIN_TYPE]), validate(getRoleById), readById);

export default router;
