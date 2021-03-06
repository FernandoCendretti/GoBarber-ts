import multer from 'multer';
import { Router } from 'express';

import uploadConfig from '@config/upload';
import ensureAutheticated from '../middlewares/ensureAuthenticate';
import UsersController from '../controllers/UsersController';
import UsersAvatarController from '../controllers/UsersAvatarController';

const userRouter = Router();
const upload = multer(uploadConfig);
const userController = new UsersController();
const usesAvatarController = new UsersAvatarController();

userRouter.post('/', userController.create);

userRouter.patch(
    '/avatar',
    ensureAutheticated,
    upload.single('avatar'),
    usesAvatarController.update,
);

export default userRouter;
