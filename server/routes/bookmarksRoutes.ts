import express from 'express';
import verifyJWT from '../middleware/verifyJWT';
import { toggleBookmark } from '../controllers/bookmarksController';

const bookmarksRouter = express.Router();

// Add to bookmarks route
bookmarksRouter.post('/toggleBookmark', verifyJWT, toggleBookmark);

export default bookmarksRouter;
