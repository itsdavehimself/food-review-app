import { removeCountryAndZip } from '../../helpers/removeCountryAndZip';
import styles from './Restaurant.module.scss';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import getPlaceDetails from '../../helpers/getPlaceDetails';
import { Place } from '../../interfaces/Place.interfaces';

const Restaurant: React.FC = () => {
	const location = useLocation();
	const places = useAppSelector((state) => state.places.places);
	const id = location.pathname.split('/').pop();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [place, setPlace] = useState<Place | null>(null);

	useEffect(() => {
		if (!id) {
			setIsLoading(false);
			return;
		}

		const placeExistsInState = places.find((place) => place.id === id);

		if (placeExistsInState) {
			setPlace(placeExistsInState);
			setIsLoading(false);
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

	return (
		<>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<>
					<div className={styles['restaurant-container']}>
						<h2>{place?.displayName.text}</h2>
						<p>{place && removeCountryAndZip(place.formattedAddress)}</p>
					</div>
				</>
			)}
		</>
	);
};

export default Restaurant;
