import styles from './NearbyResults.module.scss';
import { useAppSelector } from '../../app/hooks';
import RestaurantSearchCard from '../RestaurantSearchCard/RestaurantSearchCard';
import { useNavigate } from 'react-router-dom';
import { Place } from '../../interfaces/Place.interfaces';

const NearbyResults: React.FC = () => {
	const places = useAppSelector((state) => state.places.places);
	const isLoadingNearby = useAppSelector((state) => state.places.status);
	const favorites = useAppSelector((state) => state.user.favorites);

	const navigate = useNavigate();

	const restaurantCardClick = (place: Place) => {
		navigate(`/restaurant/${place.id}`);
	};

	return (
		<div className={styles['nearby-results']}>
			<h2>Popular Spots Near You</h2>
			{isLoadingNearby === 'succeeded' ? (
				<>
					{places &&
						places.map((place) => {
							const isFavorited = favorites.some(
								(favorite) => favorite.googlePlaceId === place.id
							);
							return (
								<RestaurantSearchCard
									key={place.id}
									place={place}
									isFavorited={isFavorited}
									onClick={() => restaurantCardClick(place)}
								/>
							);
						})}
				</>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default NearbyResults;
