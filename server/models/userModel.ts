import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import UserDocument from '../documents/userDocument';

interface UserModel extends Model<UserDocument> {
	signup(email: string, password: string): Promise<UserDocument>;
	login(email: string, password: string): Promise<UserDocument>;
}

const userSchema = new Schema<UserDocument>({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		trim: true,
	},
	username: {
		type: String,
		trim: true,
	},
});

// Static login method
userSchema.statics.login = async function (email: string, password: string) {
	if (!email || !password) {
		throw Error('All fields are required.');
	}

	const user = await this.findOne({ email });

	if (!user) {
		throw Error('Email or password is incorrect.');
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		throw Error('Email or password is incorrect.');
	}

	return user;
};

// Static signup method
userSchema.statics.signup = async function (email: string, password: string) {
	if (!email || !password) {
		throw Error('All fields are required.');
	}

	const exists = await this.findOne({ email });

	if (exists) {
		throw Error('Email already in use.');
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const user = await this.create({
		email,
		password: hash,
	});

	return user;
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
