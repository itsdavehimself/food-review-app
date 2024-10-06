import express from 'express';
import verifyJWT from '../middleware/verifyJWT';
import {
	createReview,
	getUsersRestaurantReviews,
	getAllReviewsByUser,
} from '../controllers/reviewsController';
import multer from 'multer';

const reviewRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

reviewRouter.post(
	'/createReview',
	verifyJWT,
	upload.single('audioFile'),
	createReview
);

reviewRouter.get(
	'/getUsersRestaurantReviews',
	verifyJWT,
	getUsersRestaurantReviews
);

reviewRouter.post('/getAllReviewsByUser', verifyJWT, getAllReviewsByUser);

export default reviewRouter;
