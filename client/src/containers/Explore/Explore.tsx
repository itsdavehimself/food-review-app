import styles from './Explore.module.scss';
import Searchbar from '../../components/Searchbar/Searchbar';
import RestaurantSearchCard from '../../components/RestaurantSearchCard/RestaurantSearchCard';
import { useAppSelector } from '../../app/hooks';

const Explore: React.FC = () => {
	const places = useAppSelector((state) => state.places.places);
	const isLoading = useAppSelector((state) => state.places.status);

	return (
		<>
			<Searchbar />
			<div className={styles['search-results']}>
				<h2>Popular Spots Near You</h2>
				{isLoading === 'succeeded' ? (
					<>
						{' '}
						{places &&
							places.map((place) => (
								<RestaurantSearchCard
									key={place.id}
									id={place.id}
									name={place.displayName.text}
									address={place.formattedAddress}
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
