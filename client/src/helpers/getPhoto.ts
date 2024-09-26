async function getPhoto(photoName: string) {
	const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
	const url = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=500&key=${apiKey}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		return response.url;
	} catch (error) {
		console.error('Error fetching photo:', error);
	}
}

export default getPhoto;
