import mongoose, { Schema } from 'mongoose';

const reviewSchema = new mongoose.Schema(
	{
		restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
		summary: { type: String, required: true },
		highlights: { type: [String], required: true },
		lowlights: { type: [String], required: true },
		rating: { type: Number, required: true },
		reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
