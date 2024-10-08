import LocationSearch from '../LocationSearch/LocationSearch';
import styles from './Searchbar.module.scss';
import { useEffect, useState } from 'react';
import searchRestaurant from '../../helpers/searchRestaurant';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	clearSearch,
	fetchRestaurantsFailure,
	fetchRestaurantsStart,
	fetchRestaurantsSuccess,
	setSearch,
} from '../../app/slices/searchSlice';

const Searchbar: React.FC = () => {
	const [restaurant, setRestaurant] = useState<string>('');
	const [location, setLocation] = useState<string>('');
	const [locationMatch, setLocationMatch] = useState<boolean>(false);
	const [clearLocationInput, setClearLocationInput] = useState<boolean>(false);
	const isLoadingSearch = useAppSelector((state) => state.search.status);
	const restaurantSearchState = useAppSelector(
		(state) => state.search.restaurant
	);
	const locationSearchState = useAppSelector((state) => state.search.location);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (restaurantSearchState !== '') {
			setRestaurant(restaurantSearchState);
		}

		if (locationSearchState !== '') {
			setLocation(locationSearchState);
		}
	}, []);

	const searchRestaurants = async (search: string) => {
		dispatch(fetchRestaurantsStart());

		try {
			const results = await searchRestaurant(search);
			dispatch(fetchRestaurantsSuccess(results.places));
		} catch (error) {
			dispatch(fetchRestaurantsFailure());
		}
	};

	const clickSearch = async (e: any, search: string) => {
		e.preventDefault();
		dispatch(setSearch({ restaurant, location }));
		searchRestaurants(search);
	};

	const clickClear = (e: any) => {
		e.preventDefault();
		dispatch(clearSearch());
		setLocation('');
		setRestaurant('');
		setClearLocationInput(true);
	};

	return (
		<form className={styles.searchbar}>
			<input
				placeholder="Search restaurant"
				value={restaurant}
				onChange={(e) => setRestaurant(e.target.value)}
			></input>
			<LocationSearch
				setLocation={setLocation}
				setLocationMatch={setLocationMatch}
				clearLocationInput={clearLocationInput}
				setClearLocationInput={setClearLocationInput}
			/>
			<button
				onClick={(e) => clickSearch(e, `${restaurant} in ${location}`)}
				disabled={!locationMatch}
			>
				Search
			</button>
			{isLoadingSearch !== 'idle' && (
				<button onClick={(e) => clickClear(e)}>Nearby spots</button>
			)}
		</form>
	);
};

export default Searchbar;
