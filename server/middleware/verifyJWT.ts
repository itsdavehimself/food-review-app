import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

interface UserRequest extends Request {
	UserInfo?: {
		email: string;
		sub: string;
		username: string;
		displayName: string;
	};
}

const verifyJWT = (req: UserRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	if (!accessTokenSecret) {
		throw new Error('ACCESS_TOKEN_SECRET is not defined');
	}

	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, accessTokenSecret, (err, decoded) => {
		if (err) return res.status(403).json({ message: 'Forbidden' });

		if (decoded && typeof decoded !== 'string') {
			req.UserInfo = {
				email: (decoded as JwtPayload).email as string,
				sub: (decoded as JwtPayload).sub as string,
				username: (decoded as JwtPayload).username as string,
				displayName: (decoded as JwtPayload).displayName as string,
			};
		}

		next();
	});
};

export default verifyJWT;
