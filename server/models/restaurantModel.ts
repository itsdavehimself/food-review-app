import mongoose, { Schema } from 'mongoose';
import RestaurantDocument from '../documents/restaurantDocument';

const restaurantSchema = new mongoose.Schema(
	{
		googlePlaceId: { type: String, required: true, unique: true },
		name: { type: String, required: true, unique: false },
		address: { type: String, required: true, unique: false },
		photoUrl: { type: String, required: true, unique: true },
	},
	{ timestamps: true }
);

const Restaurant = mongoose.model<RestaurantDocument>(
	'Restaurant',
	restaurantSchema
);

export default Restaurant;
