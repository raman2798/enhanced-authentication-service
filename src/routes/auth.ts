import { Router } from 'express';
import { authController } from '../controllers';
import { validate } from '../middlewares';
import { authValidation } from '../validations';

const router: Router = Router();

const { login } = authValidation;

const { authenticateUser } = authController;

router.post('/login', validate(login), authenticateUser);

export default router;
