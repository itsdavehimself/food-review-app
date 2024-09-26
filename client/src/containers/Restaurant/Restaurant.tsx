import { removeCountryAndZip } from '../../helpers/removeCountryAndZip';
import styles from './Restaurant.module.scss';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import getPlaceDetails from '../../helpers/getPlaceDetails';
import { Place } from '../../interfaces/Place.interfaces';
import getPhoto from '../../helpers/getPhoto';

const Restaurant: React.FC = () => {
	const location = useLocation();
	const places = useAppSelector((state) => state.places.places);
	const id = location.pathname.split('/').pop();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [place, setPlace] = useState<Place | null>(null);
	const [photoUrl, setPhotoUrl] = useState<string | undefined>('');

	useEffect(() => {
		if (!id) {
			setIsLoading(false);
			return;
		}

		const placeExistsInState = places.find((place) => place.id === id);

		if (placeExistsInState) {
			setPlace(placeExistsInState);
		} else {
			const fetchRestaurantData = async () => {
				try {
					const placeData = await getPlaceDetails(id);
					setPlace(placeData);
				} catch (error) {
					console.error('Failed to fetch restaurant data:', error);
				} finally {
					setIsLoading(false);
				}
			};

			fetchRestaurantData();
		}
	}, [id, places]);

	useEffect(() => {
		if (place) {
			const fetchPhoto = async () => {
				try {
					const photoUrl = await getPhoto(place.photos[0].name);
					setPhotoUrl(photoUrl);
					setIsLoading(false);
				} catch (error) {
					console.error('Error fetching photo:', error);
				}
			};

			fetchPhoto();
		}
	}, [place]);

	return (
		<>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<>
					<div className={styles['restaurant-container']}>
						<h2>{place?.displayName.text}</h2>
						<p>{place && removeCountryAndZip(place.formattedAddress)}</p>
						<img src={photoUrl}></img>
					</div>
				</>
			)}
		</>
	);
};

export default Restaurant;
