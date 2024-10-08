import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './containers/authentication/SignUp/SignUp';
import Dashboard from './containers/Home/Home';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { logout } from './app/slices/userSlice';
import handleToken from './helpers/handleToken';
import refreshAccessToken from './helpers/refreshAccessToken';
import Login from './components/Login/Login';
import WithoutNav from './containers/WithoutNav/WithoutNav';
import WithNav from './containers/WithNav/WithNav';
import Explore from './containers/Explore/Explore';
import Profile from './containers/Profile/Profile';
import searchNearby from './helpers/searchNearby';
import { setLocation } from './app/slices/locationSlice';
import {
	fetchPlacesFailure,
	fetchPlacesStart,
	fetchPlacesSuccess,
} from './app/slices/placesSlice';
import Restaurant from './containers/Restaurant/Restaurant';
import { LoadScript } from '@react-google-maps/api';
import Preferences from './containers/Preferences/Preferences';

function App() {
	const mapsApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
	const dispatch = useAppDispatch();
	const [token, setToken] = useState<string | undefined>(
		Cookies.get('accessToken')
	);
	const user = useAppSelector((state) => state.user);
	const location = useAppSelector((state) => state.location);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const initializeApp = useCallback(async (): Promise<void> => {
		try {
			if (token) {
				await handleToken(token, dispatch);
			} else {
				const storedToken = Cookies.get('accessToken');
				if (storedToken) {
					setToken(storedToken);
					await handleToken(storedToken, dispatch);
				}
			}

			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const crd = pos.coords;
					dispatch(
						setLocation({ latitude: crd.latitude, longitude: crd.longitude })
					);
				},
				(err) => {
					console.warn(`ERROR(${err.code}): ${err.message}`);
				}
			);
		} catch (error) {
			dispatch(logout());
		} finally {
			setIsLoading(false);
		}
	}, [token, dispatch]);

	useEffect(() => {
		initializeApp();
	}, [initializeApp]);

	useEffect(() => {
		const checkSession = async () => {
			const refreshedToken = await refreshAccessToken();
			if (refreshedToken) {
				await handleToken(refreshedToken, dispatch);
			} else {
				dispatch(logout());
			}
		};

		checkSession();
	}, [dispatch]);

	useEffect(() => {
		if (location.latitude !== -1 && location.longitude !== -1) {
			const searchPlacesNearby = async () => {
				dispatch(fetchPlacesStart());

				try {
					const nearby = await searchNearby(
						location.latitude,
						location.longitude
					);
					dispatch(fetchPlacesSuccess(nearby.places));
				} catch (error) {
					dispatch(fetchPlacesFailure());
				}
			};

			searchPlacesNearby();
		}
	}, [location.latitude, location.longitude, dispatch]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="App">
			<LoadScript googleMapsApiKey={mapsApiKey} libraries={['places']}>
				<BrowserRouter>
					<Routes>
						<Route element={<WithoutNav />}>
							<Route
								path="/signup"
								element={!user.username ? <SignUp /> : <Navigate to="/" />}
							/>
							<Route
								path="/login"
								element={!user.username ? <Login /> : <Navigate to="/" />}
							/>
						</Route>
						<Route element={<WithNav />}>
							<Route
								path="/"
								element={
									user.username ? (
										user.userPreferencesSet ? (
											<Dashboard />
										) : (
											<Navigate to="/preferences" />
										)
									) : (
										<Navigate to="/login" />
									)
								}
							/>
							<Route
								path="/preferences"
								element={
									user.username ? <Preferences /> : <Navigate to="/login" />
								}
							/>
							<Route
								path="/explore"
								element={
									user.username ? (
										user.userPreferencesSet ? (
											<Explore />
										) : (
											<Navigate to="/preferences" />
										)
									) : (
										<Navigate to="/login" />
									)
								}
							/>
							<Route
								path="/user/:username"
								element={
									user.username ? (
										user.userPreferencesSet ? (
											<Profile />
										) : (
											<Navigate to="/preferences" />
										)
									) : (
										<Navigate to="/login" />
									)
								}
							/>
							<Route
								path="/restaurant/:placeId"
								element={
									user.username ? (
										user.userPreferencesSet ? (
											<Restaurant />
										) : (
											<Navigate to="/preferences" />
										)
									) : (
										<Navigate to="/login" />
									)
								}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoadScript>
		</div>
	);
}

export default App;
