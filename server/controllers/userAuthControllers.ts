import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel';
import UserDocument from '../documents/userDocument';

dotenv.config();

const jwtSecret: string = process.env.JWT_SECRET || '';

if (jwtSecret === '') {
	console.error(
		'JWT_SECRET environment variable is not set. Ensure it is set before running the application.'
	);
	process.exit(1);
}

const createToken = (_id: string): string => {
	return jwt.sign({ _id }, jwtSecret, { expiresIn: '7d' });
};

//Login User
const loginUser = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
		const user: UserDocument = await User.login(email, password);
		const token = createToken(user._id);

		res.status(200).json({ email, token });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

//Sign Up User
const signUpUser = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;
	try {
		const user: UserDocument = await User.signup(email, password);

		const token = createToken(user._id);

		res.status(200).json({ user, token });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

export { loginUser, signUpUser };
