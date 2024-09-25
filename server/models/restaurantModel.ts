import mongoose, { Schema } from 'mongoose';
import RestaurantDocument from '../documents/restaurantDocument';

const restaurantSchema = new mongoose.Schema({
	googlePlaceId: { type: String, required: true, unique: true },
	reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
	createdAt: { type: Date, default: Date.now },
});

const Restaurant = mongoose.model<RestaurantDocument>(
	'Restaurant',
	restaurantSchema
);

export default Restaurant;
