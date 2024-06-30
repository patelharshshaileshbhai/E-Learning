import express from 'express';
import { Router } from 'express';
import { loginUser, myProfile, registerUser, verifyUser } from '../controller/user.js';
import { isAuth } from '../middlewares/isAuth.js';

const router=express.Router();


router.post('/user/register', registerUser)
router.post('/user/verify', verifyUser)
router.post('/user/login',loginUser)
router.get('/user/me',isAuth,myProfile)
export default router