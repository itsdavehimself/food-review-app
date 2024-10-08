async function searchRestaurant(searchQuery: string) {
	const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

	if (!apiKey) {
		throw new Error('GOOGLE_API_KEY is not defined');
	}

	const url = 'https://places.googleapis.com/v1/places:searchText';
	const headers = {
		'Content-Type': 'application/json',
		'X-Goog-Api-Key': apiKey,
		'X-Goog-FieldMask':
			'places.id,places.displayName,places.formattedAddress,places.priceLevel,places.photos',
	};

	const body = JSON.stringify({
		textQuery: searchQuery,
		includedType: 'restaurant',
		strictTypeFiltering: true,
	});

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: body,
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		// const placesWithPhoto = await Promise.all(
		// 	data.places.map(async (place: Place) => {
		// 		if (place.photos && place.photos.length > 0) {
		// 			const firstPhoto = place.photos[0];
		// 			const photoUrl = await getPhoto(firstPhoto.name);
		// 			return { ...place, photoUrl };
		// 		}
		// 		return place;
		// 	})
		// );

		return data;
	} catch (error) {
		console.error('Error fetching restaurants:', error);
	}
}

// async function getPhoto(photoName: string) {
// 	const apiKey = 'AIzaSyDSF4KK43ZEU0Zsq7je2GVhg6iekuyMs68';
// 	const url = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=500&key=${apiKey}`;

// 	try {
// 		const response = await fetch(url, {
// 			method: 'GET',
// 		});

// 		if (!response.ok) {
// 			throw new Error('Network response was not ok');
// 		}

// 		return response.url;
// 	} catch (error) {
// 		console.error('Error fetching photo:', error);
// 	}
// }

export default searchRestaurant;
