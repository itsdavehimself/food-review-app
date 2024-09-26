import express from 'express';
import verifyJWT from '../middleware/verifyJWT';
import { getUserSavedData } from '../controllers/userSavedDataController';

const userSavedDataRouter = express.Router();

// Get user saved data route
userSavedDataRouter.get('/getUserSavedData', verifyJWT, getUserSavedData);

export default userSavedDataRouter;
