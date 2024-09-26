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
		const { place } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		let restaurant = await Restaurant.findOne({ googlePlaceId: place.id });
		if (!restaurant) {
			restaurant = new Restaurant({
				googlePlaceId: place.id,
				name: place.displayName.text,
				address: place.formattedAddress,
				photoUrl: place.photos[0].name,
			});
			await restaurant.save();
			console.log('New restaurant created:', restaurant);
		}

		const isFavorite = user.favorites.some(
			(fav) => fav.toString() === restaurant._id.toString()
		);

		if (isFavorite) {
			user.favorites = user.favorites.filter(
				(fav) => fav.toString() !== restaurant._id.toString()
			);
		} else {
			user.favorites.push(restaurant._id);
		}

		await user.save();

		const updatedUserWithFavorites = await User.findById(userId).populate({
			path: 'favorites',
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
