import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './containers/authentication/SignUp/SignUp';
import Dashboard from './containers/Home/Home';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { logout } from './app/slices/userSlice';
import handleToken from './helpers/handleToken';
import Login from './components/Login/Login';
import WithoutNav from './containers/WithoutNav/WithoutNav';
import WithNav from './containers/WithNav/WithNav';
import Map from './containers/Map/Map';
import Explore from './containers/Explore/Explore';
import Profile from './containers/Profile/Profile';
import searchNearby from './helpers/searchNearby';
import { setLocation } from './app/slices/locationSlice';
import {
	fetchPlacesFailure,
	fetchPlacesStart,
	fetchPlacesSuccess,
} from './app/slices/placesSlice';

function App() {
	const dispatch = useAppDispatch();
	const token = Cookies.get('accessToken');
	const user = useAppSelector((state) => state.user);
	const location = useAppSelector((state) => state.location);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const checkToken = async (): Promise<void> => {
			try {
				await handleToken(token, dispatch);
			} catch (error) {
				dispatch(logout());
			} finally {
				setIsLoading(false);
			}
		};

		checkToken();
	}, [dispatch, token]);

	useEffect(() => {
		function success(pos: GeolocationPosition) {
			const crd = pos.coords;
			dispatch(
				setLocation({ latitude: crd.latitude, longitude: crd.longitude })
			);
		}

		function error(err: GeolocationPositionError) {
			console.warn(`ERROR(${err.code}): ${err.message}`);
		}

		navigator.geolocation.getCurrentPosition(success, error);
	}, []);

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
			<BrowserRouter>
				<Routes>
					<Route>
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
					</Route>
					<Route element={<WithNav />}>
						<Route
							path="/"
							element={user.username ? <Dashboard /> : <Navigate to="/login" />}
						/>
						<Route
							path="/map"
							element={user.username ? <Map /> : <Navigate to="/login" />}
						/>
						<Route
							path="/explore"
							element={user.username ? <Explore /> : <Navigate to="/login" />}
						/>
						<Route
							path="/:username"
							element={user.username ? <Profile /> : <Navigate to="/login" />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
