import express from 'express';
import {
	getUserFavorites,
	toggleFavorite,
} from '../controllers/favoritesController';
import verifyJWT from '../middleware/verifyJWT';

const favoritesRouter = express.Router();

// Add to favorites route
favoritesRouter.post('/toggleFavorite', verifyJWT, toggleFavorite);

// Get user favorites
favoritesRouter.get('/getUserFavorites', verifyJWT, getUserFavorites);

export default favoritesRouter;
