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

const generateTokens = (username: string, sub: string, email: string) => {
	const { accessTokenSecret, refreshTokenSecret } = getSecrets();

	const accessToken = jwt.sign(
		{
			UserInfo: { username, sub, email },
		},
		accessTokenSecret,
		{ expiresIn: '10s' }
	);

	const refreshToken = jwt.sign({ username }, refreshTokenSecret, {
		expiresIn: '7d',
	});

	return { accessToken, refreshToken };
};

const setCookie = (res: Response, refreshToken: string) => {
	res.cookie('jwt', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'none',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

//Login User
const loginUser = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		const user = await User.findOne({ email });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res
				.status(401)
				.json({ message: 'Email or password is incorrect' });
		}

		const { accessToken, refreshToken } = generateTokens(
			user.username,
			user._id,
			user.email
		);
		setCookie(res, refreshToken);

		return res.status(200).json({ accessToken });
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

//Sign Up User
const signUpUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			throw Error('All fields are required.');
		}

		if (await User.findOne({ email })) {
			throw Error('Email already in use.');
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const user = await User.create({
			email,
			password: hash,
		});

		const { accessToken, refreshToken } = generateTokens(
			user.username,
			user._id,
			user.email
		);
		setCookie(res, refreshToken);

		res.status(200).json({ accessToken });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

const refresh = (req: Request, res: Response): void => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		res.status(401).json({ message: 'Unauthorized' });
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
					},
				},
				accessTokenSecret,
				{ expiresIn: '10s' }
			);

			res.json({ accessToken });
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

export { loginUser, signUpUser, refresh, logoutUser };
