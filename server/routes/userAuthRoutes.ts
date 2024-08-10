import express from 'express';
import {
	checkEmail,
	loginUser,
	logoutUser,
	refresh,
	signUpUser,
} from '../controllers/userAuthControllers';

const userAuthRouter = express.Router();

// Login Route
userAuthRouter.post('/login', loginUser);

// Check Email Route
userAuthRouter.post('/email', checkEmail);

// Sign Up Route
userAuthRouter.post('/signup', signUpUser);

// Refresh
userAuthRouter.get('/refresh', refresh);

// Logout Route
userAuthRouter.post('/logout', logoutUser);

export default userAuthRouter;
