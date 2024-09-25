import { Types } from 'mongoose';

interface UserDocument {
	_id: string;
	email: string;
	password: string;
	displayName: string;
	username: string;
	favorites: Types.ObjectId[];
}

export default UserDocument;
