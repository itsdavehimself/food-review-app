import styles from './Explore.module.scss';
import Searchbar from '../../components/Searchbar/Searchbar';
import { useAppSelector } from '../../app/hooks';
import SearchResults from '../../components/SearchResults/SearchResults';
import NearbyResults from '../../components/NearbyResults/NearbyResults';

const Explore: React.FC = () => {
	const isLoadingSearch = useAppSelector((state) => state.search.status);
	const searchResults = useAppSelector((state) => state.search.places);

	return (
		<div className={styles['explore']}>
			<Searchbar />
			<div className={styles['results-container']}>
				{searchResults.length > 0 && <SearchResults />}
				{isLoadingSearch !== 'succeeded' && <NearbyResults />}
			</div>
		</div>
	);
};

export default Explore;
