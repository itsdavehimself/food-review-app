import { Types } from 'mongoose';

interface RestaurantDocument {
	googlePlaceId: string;
	name: string;
	address: string;
	photoUrl: string;
	reviews: Types.ObjectId[];
	createdAt: Date;
}

export default RestaurantDocument;
