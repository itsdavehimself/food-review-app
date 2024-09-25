import { Request, Response } from 'express';
import User from '../models/userModel';
import Restaurant from '../models/restaurantModel';

interface UserRequest extends Request {
	UserInfo?: {
		email: string;
		sub: string;
		username: string;
		displayName: string;
		favorites: string[];
	};
}

const toggleFavorite = async (req: UserRequest, res: Response) => {
	try {
		const userId = req.UserInfo?.sub;
		const { restaurantId } = req.body; // The googlePlaceId from the client

		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Check if the restaurant exists in the Restaurant collection
		let restaurant = await Restaurant.findOne({ googlePlaceId: restaurantId });
		if (!restaurant) {
			// If the restaurant doesn't exist, create a new one
			restaurant = new Restaurant({ googlePlaceId: restaurantId });
			await restaurant.save();
			console.log('New restaurant created:', restaurant);
		}

		// Check if the restaurant's ObjectId is already in the user's favorites
		const isFavorite = user.favorites.some(
			(fav) => fav.toString() === restaurant._id.toString()
		);

		if (isFavorite) {
			// Remove from favorites
			user.favorites = user.favorites.filter(
				(fav) => fav.toString() !== restaurant._id.toString()
			);
		} else {
			// Add the restaurant's ObjectId to favorites
			user.favorites.push(restaurant._id);
		}

		// Save the updated user
		await user.save();

		// Populate the favorites with googlePlaceId and return updated user
		const updatedUserWithFavorites = await User.findById(userId).populate({
			path: 'favorites',
			select: 'googlePlaceId',
		});

		return res.status(200).json({
			updatedUser: updatedUserWithFavorites,
			message: 'Favorites updated successfully',
		});
	} catch (error) {
		console.error('Error in toggleFavorite:', error);
		return res.status(500).json({ message: 'Internal server error', error });
	}
};

const getUserFavorites = async (req: UserRequest, res: Response) => {
	try {
		const userId = req.UserInfo?.sub;

		const user = await User.findById(userId).populate({
			path: 'favorites',
			select: 'googlePlaceId',
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.status(200).json({ favorites: user.favorites });
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export { toggleFavorite, getUserFavorites };
