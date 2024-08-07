import express from 'express';
import { loginUser, signUpUser } from '../controllers/userAuthControllers';

const userAuthRouter = express.Router();

// Login Route
userAuthRouter.post('/login', loginUser);

// Sign Up Route
userAuthRouter.post('/signup', signUpUser);

export default userAuthRouter;
