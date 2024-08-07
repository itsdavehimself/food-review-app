import mongoose from 'mongoose';

interface UserDocument {
	_id: string;
	email: string;
	password: string;
	displayName: string;
	username: string;
}

export default UserDocument;
