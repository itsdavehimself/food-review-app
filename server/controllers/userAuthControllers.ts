import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

dotenv.config();

const getSecrets = () => {
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
	const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

	if (!accessTokenSecret) {
		throw new Error('ACCESS_TOKEN_SECRET is not defined');
	}
	if (!refreshTokenSecret) {
		throw new Error('REFRESH_TOKEN_SECRET is not defined');
	}

	return { accessTokenSecret, refreshTokenSecret };
};

const generateTokens = (
	email: string,
	username: string,
	displayName: string,
	sub: string
) => {
	const { accessTokenSecret, refreshTokenSecret } = getSecrets();

	const accessToken = jwt.sign(
		{
			UserInfo: { email, username, displayName, sub },
		},
		accessTokenSecret,
		{ expiresIn: '10m' }
	);

	const refreshToken = jwt.sign({ username }, refreshTokenSecret, {
		expiresIn: '30d',
	});

	return { accessToken, refreshToken };
};

const setCookie = (res: Response, refreshToken: string) => {
	res.cookie('jwt', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'none',
		maxAge: 7 * 24 * 60 * 60 * 1000,
		path: '/',
	});
};

//Login User
const loginUser = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { identifier, password } = req.body;

		if (!identifier || !password) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		const query = identifier.includes('@')
			? { email: identifier }
			: { username: identifier };

		// Find the user by email or username
		const user = await User.findOne(query);

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res
				.status(401)
				.json({ message: 'Email or password is incorrect' });
		}

		// Generate tokens (access and refresh)
		const { accessToken, refreshToken } = generateTokens(
			user.email,
			user.username,
			user.displayName,
			user._id
		);

		// Set the refresh token in a cookie
		setCookie(res, refreshToken);

		const userWithPopulatedFavorites = await User.findById(user._id).populate({
			path: 'favorites',
			select: 'googlePlaceId',
		});

		if (!userWithPopulatedFavorites) {
			return res
				.status(404)
				.json({ message: 'User not found after population' });
		}
		return res.status(200).json({
			accessToken,
			favorites: userWithPopulatedFavorites.favorites,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

//Check Email Only
const checkEmail = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: 'Email is required' });
		}

		const user = await User.findOne({ email });

		if (user) {
			return res.status(409).json({ message: 'unavailable' });
		}

		return res.status(200).json({ message: 'available' });
	} catch (error: any) {
		console.error('Error checking email:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

//Sign Up User
const signUpUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password, username, displayName } = req.body;

		if (!email || !password || !username || !displayName) {
			throw Error('All fields are required.');
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const user = await User.create({
			email,
			displayName,
			username,
			password: hash,
		});

		const { accessToken, refreshToken } = generateTokens(
			user.email,
			user.username,
			user.displayName,
			user._id
		);
		setCookie(res, refreshToken);

		res.status(200).json({ accessToken });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

const refresh = (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const { accessTokenSecret, refreshTokenSecret } = getSecrets();

	jwt.verify(
		cookies.jwt,
		refreshTokenSecret,
		async (err: any, decoded: JwtPayload | string | undefined) => {
			if (err || !decoded || typeof decoded === 'string') {
				return res.status(403).json({ message: 'Forbidden' });
			}

			const user = await User.findOne({
				username: (decoded as JwtPayload).username,
			});
			if (!user) return res.status(401).json({ message: 'Unauthorized' });

			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: user.username,
						sub: user._id,
						email: user.email,
						displayName: user.displayName,
					},
				},
				accessTokenSecret,
				{ expiresIn: '10m' }
			);

			return res.json({ accessToken });
		}
	);
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
	const cookies = req.cookies;
	if (!cookies?.jwt) {
		res.sendStatus(204);
	}

	res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
	res.json({ message: 'Cookie cleared' });
};

export { loginUser, checkEmail, signUpUser, refresh, logoutUser };
