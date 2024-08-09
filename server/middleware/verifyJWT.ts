import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface UserRequest extends Request {
	user: {
		username: string;
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

	jwt.verify(
		token,
		accessTokenSecret,
		(err: any, decoded: JwtPayload | string | undefined) => {
			if (err) return res.status(403).json({ message: 'Forbidden' });

			req.user = (decoded as JwtPayload).username;
			next();
		}
	);
};

export default verifyJWT;
