import { Router } from 'express';
import { mainConfiguration } from '../config';
import { uploadController } from '../controllers';
import { authenticationMiddleware, fileUploadMiddleware, validate } from '../middlewares';
import { uploadValidation } from '../validations';

const router: Router = Router();

const {
  ROLES: {
    SUPER_ADMIN: { type: SUPER_ADMIN_TYPE },
    USER: { type: USER_TYPE },
  },
} = mainConfiguration;

const { hasRequiredRoles } = authenticationMiddleware;

const { handleFileUpload } = fileUploadMiddleware;

const { create, deleteUpload } = uploadValidation;

const { createUpload, deleteById, readAllUploads } = uploadController;

router.post('/', hasRequiredRoles([SUPER_ADMIN_TYPE]), handleFileUpload(), validate(create), createUpload);

router.delete('/:uploadId', hasRequiredRoles([SUPER_ADMIN_TYPE]), validate(deleteUpload), deleteById);

router.get('/', hasRequiredRoles([SUPER_ADMIN_TYPE, USER_TYPE]), readAllUploads);

export default router;
