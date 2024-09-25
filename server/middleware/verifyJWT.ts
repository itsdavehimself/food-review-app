import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserRequest extends Request {
	UserInfo?: {
		email: string;
		sub: string;
		username: string;
		displayName: string;
		favorites: string[];
	};
}

const verifyJWT = (req: UserRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	if (!authHeader?.startsWith('Bearer ')) {
		console.log('Authorization header is missing or malformed.');
		return res.status(401).json({ message: 'Unauthorized' });
	}

	if (!accessTokenSecret) {
		throw new Error('ACCESS_TOKEN_SECRET is not defined.');
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, accessTokenSecret, (err, decoded) => {
		if (err) {
			console.error('JWT verification failed:', err);
			return res.status(403).json({ message: 'Forbidden' });
		}

		if (decoded && typeof decoded !== 'string' && (decoded as any).UserInfo) {
			const userInfo = (decoded as any).UserInfo;
			req.UserInfo = {
				email: userInfo.email,
				sub: userInfo.sub,
				username: userInfo.username,
				displayName: userInfo.displayName,
				favorites: userInfo.favorites || [],
			};
		}

		next();
	});
};

export default verifyJWT;
