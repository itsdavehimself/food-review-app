import { Request, Response } from 'express';
import mongoose from 'mongoose';
import processWithGemini from '../helpers/processWithGemini';
import getTranscription from '../helpers/getTranscription';
import parseReview from '../helpers/parseReview';
import User from '../models/userModel';
import Review from '../models/reviewModel';
import Restaurant from '../models/restaurantModel';
import fs from 'fs';

interface UserRequest extends Request {
	UserInfo?: {
		email: string;
		sub: string;
		username: string;
		displayName: string;
	};
}

const createReview = async (req: UserRequest, res: Response) => {
	try {
		const audioPath = req.file?.path;
		const userId = req.UserInfo?.sub;
		const restaurantId = req.body.restaurantId;
		const name = req.body.displayName;
		const address = req.body.address;
		const photoUrl = req.body.photoUrl;

		if (!userId) {
			return res.status(400).json({ message: 'User ID not found' });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		let restaurant = await Restaurant.findOne({ googlePlaceId: restaurantId });
		if (!restaurant) {
			restaurant = new Restaurant({
				googlePlaceId: restaurantId,
				name: name,
				address: address,
				photoUrl: photoUrl,
			});
			await restaurant.save();
			console.log('New restaurant created:', restaurant);
		}

		if (!audioPath) {
			return res.status(400).json({ message: 'No audio path found' });
		}

		const transcript = await getTranscription(audioPath);
		const reviewText = await processWithGemini(transcript);
		const { summary, highlights, lowlights, rating } = parseReview(reviewText);

		const review = new Review({
			restaurantId: restaurant._id,
			summary: summary || 'No summary provided',
			highlights: highlights.length ? highlights : ['No highlights provided'],
			lowlights: lowlights.length ? lowlights : ['No lowlights provided'],
			rating: rating || 0.0,
			reviewer: user._id,
		});

		await review.save();

		user.reviews.push(review._id);
		await user.save();

		if (audioPath) {
			fs.unlink(audioPath, (err) => {
				if (err) {
					console.error('Error deleting audio file:', err);
				}
			});
		}

		return res
			.status(200)
			.json({ review, message: 'Review created successfully.' });
	} catch (error) {
		console.error('Error in createReview:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

const getUsersRestaurantReviews = async (req: UserRequest, res: Response) => {
	try {
		const userId = req.UserInfo?.sub;
		const restaurantId = req.query.restaurantId as string;

		if (!userId || !restaurantId) {
			return res
				.status(400)
				.json({ message: 'UserId and RestaurantId are required' });
		}

		let restaurant = await Restaurant.findOne({ googlePlaceId: restaurantId });

		if (!restaurant) {
			return res
				.status(200)
				.json({ message: 'Restaurant not found', reviews: [] });
		}

		const reviews = await Review.find({
			reviewer: new mongoose.Types.ObjectId(userId),
			restaurantId: restaurant._id,
		});

		if (!reviews || reviews.length === 0) {
			return res.status(200).json({
				message: 'No reviews found for this restaurant by the user',
				reviews: [],
			});
		}

		return res.status(200).json({ reviews });
	} catch (error: any) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

const getAllReviewsByUser = async (req: UserRequest, res: Response) => {
	const { userId, googlePlaceIds } = req.body;
	try {
		const restaurants = await Restaurant.find({
			googlePlaceId: { $in: googlePlaceIds },
		}).select('_id googlePlaceId');

		const restaurantIds = restaurants.map((restaurant) => restaurant._id);

		const reviewedRestaurants = await Review.find({
			reviewer: userId,
			restaurantId: { $in: restaurantIds },
		}).select('restaurantId');

		const reviewedRestaurantIds = reviewedRestaurants.map((review) =>
			review.restaurantId?.toString()
		);

		const reviewedGooglePlaceIds = restaurants
			.filter((restaurant) =>
				reviewedRestaurantIds.includes(restaurant._id.toString())
			)
			.map((restaurant) => restaurant.googlePlaceId);

		res.json(reviewedGooglePlaceIds);
	} catch (error) {
		console.error('Error fetching reviewed restaurants:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

export { createReview, getUsersRestaurantReviews, getAllReviewsByUser };
