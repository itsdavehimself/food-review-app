import styles from './Explore.module.scss';
import { useState, useEffect } from 'react';
import { Place } from '../../interfaces/Place.interfaces';

const Explore: React.FC = () => {
	const [latitude, setLatitude] = useState<number | undefined>();
	const [longitude, setLongitude] = useState<number | undefined>();
	const [places, setPlaces] = useState<Place[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	function success(pos: GeolocationPosition) {
		const crd = pos.coords;
		setLatitude(crd.latitude);
		setLongitude(crd.longitude);
	}

	function error(err: GeolocationPositionError) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	navigator.geolocation.getCurrentPosition(success, error);

	async function searchNearby() {
		const apiKey = 'AIzaSyDSF4KK43ZEU0Zsq7je2GVhg6iekuyMs68';
		const textQuery = 'restaurants';

		const url = 'https://places.googleapis.com/v1/places:searchText';
		const headers = {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': apiKey,
			'X-Goog-FieldMask':
				'places.displayName,places.formattedAddress,places.priceLevel,places.photos',
		};

		const body = JSON.stringify({
			textQuery: textQuery,
			locationBias: {
				circle: {
					center: {
						latitude: latitude,
						longitude: longitude,
					},
					radius: 5000.0,
				},
			},
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
			const placesWithPhoto = await Promise.all(
				data.places.map(async (place: Place) => {
					if (place.photos && place.photos.length > 0) {
						const firstPhoto = place.photos[0];
						const photoUrl = await getPhoto(firstPhoto.name);
						return { ...place, photoUrl };
					}
					return place;
				})
			);
			setPlaces(placesWithPhoto);
			setIsLoading(false);
		} catch (error) {
			console.error('Error fetching nearby places:', error);
		}
	}

	async function getPhoto(photoName: string) {
		const apiKey = 'AIzaSyDSF4KK43ZEU0Zsq7je2GVhg6iekuyMs68';
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

	useEffect(() => {
		if (latitude !== undefined && longitude !== undefined) {
			searchNearby();
		}
	}, [latitude, longitude]);

	return (
		<>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div>
					{places &&
						places.map((place, index) => (
							<div>
								<div key={index}>{place.displayName.text}</div>
							</div>
						))}
				</div>
			)}
		</>
	);
};

export default Explore;
