const summaryRegex = /(?<=Summary:\s)([\s\S]*?)(?=\s*Highlights:)/;
const highlightsRegex = /(?<=Highlights:\s)([\s\S]*?)(?=\s*Lowlights:)/;
const lowlightsRegex = /(?<=Lowlights:\s)([\s\S]*?)(?=\s*Rating:)/;
const ratingRegex = /(?<=Rating:\s)([\d.]+\/[\d.]+)/;

const parseReview = (review: string) => {
	const summaryMatch = review.match(summaryRegex);
	const highlightsMatch = review.match(highlightsRegex);
	const lowlightsMatch = review.match(lowlightsRegex);
	const ratingMatch = review.match(ratingRegex);

	const summary = summaryMatch ? summaryMatch[0].trim() : '';
	const highlights = highlightsMatch
		? highlightsMatch[0]
				.trim()
				.split('\n')
				.map((item) => item.trim())
		: [];
	const lowlights = lowlightsMatch
		? lowlightsMatch[0]
				.trim()
				.split('\n')
				.map((item) => item.trim())
		: [];
	const rating = ratingMatch ? parseFloat(ratingMatch[0]) : null;

	return {
		summary,
		highlights,
		lowlights,
		rating,
	};
};

export default parseReview;
