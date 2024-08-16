import styles from './Explore.module.scss';
import Searchbar from '../../components/Searchbar/Searchbar';
import RestaurantSearchCard from '../../components/RestaurantSearchCard/RestaurantSearchCard';
import { useAppSelector } from '../../app/hooks';

const Explore: React.FC = () => {
	const places = useAppSelector((state) => state.places.places);

	return (
		<>
			<Searchbar />
			<div className={styles['search-results']}>
				<h2>Popular Spots Near You</h2>
				{places &&
					places.map((place) => (
						<RestaurantSearchCard
							key={place.id}
							id={place.id}
							name={place.displayName.text}
							address={place.formattedAddress}
						/>
					))}
			</div>
		</>
	);
};

export default Explore;
