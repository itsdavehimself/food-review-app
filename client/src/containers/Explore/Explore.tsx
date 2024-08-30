import styles from './Explore.module.scss';
import Searchbar from '../../components/Searchbar/Searchbar';
import RestaurantSearchCard from '../../components/RestaurantSearchCard/RestaurantSearchCard';
import { useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Place } from '../../interfaces/Place.interfaces';

const Explore: React.FC = () => {
	const places = useAppSelector((state) => state.places.places);
	const isLoading = useAppSelector((state) => state.places.status);
	const navigate = useNavigate();

	const handleClick = (place: Place) => {
		navigate(`/restaurant/${place.id}`);
	};

	return (
		<>
			<Searchbar />
			<div className={styles['search-results']}>
				<h2>Popular Spots Near You</h2>
				{isLoading === 'succeeded' ? (
					<>
						{places &&
							places.map((place) => (
								<RestaurantSearchCard
									key={place.id}
									name={place.displayName.text}
									address={place.formattedAddress}
									onClick={() => handleClick(place)}
								/>
							))}
					</>
				) : (
					<div>Loading...</div>
				)}
			</div>
		</>
	);
};

export default Explore;
