import { Router } from 'express';
import { authenticationMiddleware } from '../middlewares';
import authRoute from './auth';
import roleRoute from './roles';
import uploadRoute from './uploads';
import userRoute from './users';

const router: Router = Router();

const { authenticateUser } = authenticationMiddleware;

router.use('/auth', authRoute);
router.use('/roles', authenticateUser, roleRoute);
router.use('/uploads', authenticateUser, uploadRoute);
router.use('/users', authenticateUser, userRoute);

export default router;
