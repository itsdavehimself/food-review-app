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

const toggleBookmark = async (req: UserRequest, res: Response) => {
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

		const isBookmark = user.bookmarks.some(
			(fav) => fav.toString() === restaurant._id.toString()
		);

		if (isBookmark) {
			user.bookmarks = user.bookmarks.filter(
				(fav) => fav.toString() !== restaurant._id.toString()
			);
		} else {
			user.bookmarks.push(restaurant._id);
		}

		await user.save();

		const updatedUser = await User.findById(userId).populate([
			{ path: 'bookmarks' },
		]);

		return res.status(200).json({
			updatedUser: updatedUser,
			message: 'Bookmark updated successfully',
		});
	} catch (error) {
		console.error('Error in toggleBookmark:', error);
		return res.status(500).json({ message: 'Internal server error', error });
	}
};

export { toggleBookmark };
