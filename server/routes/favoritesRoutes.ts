import express from 'express';
import { toggleFavorite } from '../controllers/favoritesController';
import verifyJWT from '../middleware/verifyJWT';

const favoritesRouter = express.Router();

// Add to favorites route
favoritesRouter.post('/toggleFavorite', verifyJWT, toggleFavorite);

export default favoritesRouter;
