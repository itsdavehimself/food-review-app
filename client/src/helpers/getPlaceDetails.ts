const getPlaceDetails = async (placeId: string) => {
	const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

	if (!apiKey) {
		throw new Error('GOOGLE_API_KEY is not defined');
	}

	const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,formattedAddress,priceLevel,photos&key=${apiKey}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();

		return data;
	} catch (error: any) {
		console.error('Error fetching place by id');
	}
};

export default getPlaceDetails;
