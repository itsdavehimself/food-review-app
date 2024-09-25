import { Types } from 'mongoose';

interface RestaurantDocument {
	googlePlaceId: string;
	reviews: Types.ObjectId[];
	createdAt: Date;
}

export default RestaurantDocument;
