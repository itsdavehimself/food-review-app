import { Types } from 'mongoose';

interface ReviewDocument {
	restaurantId: Types.ObjectId;
	summary: string;
	highlights: string[];
	lowlights: string[];
	rating: number;
	reviewer: Types.ObjectId;
}

export default ReviewDocument;
