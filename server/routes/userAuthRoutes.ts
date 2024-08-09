import express from 'express';
import {
	loginUser,
	logoutUser,
	refresh,
	signUpUser,
} from '../controllers/userAuthControllers';

const userAuthRouter = express.Router();

// Login Route
userAuthRouter.post('/login', loginUser);

// Sign Up Route
userAuthRouter.post('/signup', signUpUser);

// Refresh
userAuthRouter.get('/refresh', refresh);

// Logout Route
userAuthRouter.post('/logout', logoutUser);

export default userAuthRouter;
