const dispatch = useAppDispatch();
const state = useAppSelector((state) => state.auth);

useEffect(() => {
	handleLogin('davidsmolen@gmail.com', 'password123');
}, [dispatch]);

const handleLogin = async (email: string, password: string): Promise<void> => {
	try {
		const loginResponse = await fetch(`http://localhost:3000/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const loginData = await loginResponse.json();

		if (!loginResponse.ok) {
			console.log('error');
		}

		console.log(loginData);
		const accessToken = loginData.accessToken;
		Cookies.set('accessToken', accessToken);

		if (accessToken) {
			const decodedToken = jwtDecode(accessToken);

			console.log('Decoded JWT:', decodedToken);
		} else {
			console.log('No token found');
		}
	} catch (error: any) {
		console.error('An error occured during login:', error);
	}
};

const [latitude, setLatitude] = useState<number | undefined>();
const [longitude, setLongitude] = useState<number | undefined>();
const [places, setPlaces] = useState([]);

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
		const placesWithPhotos = await Promise.all(
			data.places.map(async (place) => {
				if (place.photos && place.photos.length > 0) {
					const photoUrls = await Promise.all(
						place.photos.map(async (photo) => await getPhoto(photo.name))
					);
					return { ...place, photoUrls };
				}
				return place;
			})
		);
		setPlaces(placesWithPhotos);
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
