import mongoose, { Schema, Model, Document } from 'mongoose';
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

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
