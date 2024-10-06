interface Review {
	_id: string;
	restaurantId: string;
	summary: string;
	highlights: string[];
	lowlights: string[];
	rating: number;
	reviewer: string;
	createdAt: Date;
}

export default Review;
