import express from 'express';
import { loginUser,registerUser,adminLogin,getUserInfo } from '../controllers/userController.js';
import authUser from '../middleware/auth.js'

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/userinfo', authUser, getUserInfo);

export default userRouter;