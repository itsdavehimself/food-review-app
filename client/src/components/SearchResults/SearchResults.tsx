import styles from './SearchResults.module.scss';
import { useAppSelector } from '../../app/hooks';
import RestaurantSearchCard from '../RestaurantSearchCard/RestaurantSearchCard';
import { useNavigate } from 'react-router-dom';
import { Place } from '../../interfaces/Place.interfaces';

const SearchResults: React.FC = () => {
	const isLoadingSearch = useAppSelector((state) => state.search.status);
	const searchResults = useAppSelector((state) => state.search.places);
	const favorites = useAppSelector((state) => state.user.favorites);
	const navigate = useNavigate();

	const restaurantCardClick = (place: Place) => {
		navigate(`/restaurant/${place.id}`);
	};

	return (
		<div className={styles['search-results']}>
			<h2>Search Results</h2>
			{isLoadingSearch === 'succeeded' ? (
				<>
					{searchResults &&
						searchResults.map((place) => {
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

export default SearchResults;
