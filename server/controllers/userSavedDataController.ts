import { Request, Response } from 'express';
import User from '../models/userModel';

interface UserRequest extends Request {
	UserInfo?: {
		email: string;
		sub: string;
		username: string;
		displayName: string;
		favorites: string[];
	};
}

const getUserSavedData = async (req: UserRequest, res: Response) => {
	try {
		const userId = req.UserInfo?.sub;

		const user = await User.findById(userId).populate([
			{ path: 'favorites' },
			{ path: 'bookmarks' },
		]);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res
			.status(200)
			.json({ favorites: user.favorites, bookmarks: user.bookmarks });
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export { getUserSavedData };
