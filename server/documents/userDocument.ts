import { Types } from 'mongoose';

interface UserDocument {
	_id: string;
	email: string;
	password: string;
	displayName: string;
	username: string;
	favorites: Types.ObjectId[];
	bookmarks: Types.ObjectId[];
	reviews: Types.ObjectId[];
	preferences: {
		value: number;
		ambiance: number;
		service: number;
	};
	userPreferencesSet: boolean;
}

export default UserDocument;
