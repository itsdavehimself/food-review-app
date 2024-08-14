import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './containers/authentication/SignUp/SignUp';
import Dashboard from './containers/Dashboard/Dashboard';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { login, logout } from './app/slices/userSlice';
import { UserInfoPayload } from './components/SignUp/FinishSignUp/FinishSignUp';
import Login from './components/Login/Login';
import refreshAccessToken from './helpers/refreshAccessToken';
import WithoutNav from './containers/WithoutNav/WithoutNav';
import WithNav from './containers/WithNav/WithNav';
import Map from './containers/Map/Map';
import Explore from './containers/Explore/Explore';
import Profile from './containers/Profile/Profile';

function App() {
	const dispatch = useAppDispatch();
	const token = Cookies.get('accessToken');
	const user = useAppSelector((state) => state.user);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const checkToken = async () => {
			if (token) {
				try {
					const decodedToken = jwtDecode<UserInfoPayload>(token);
					dispatch(login(decodedToken.UserInfo));
				} catch (error) {
					console.error('Failed to decode token', error);
					const newToken = await refreshAccessToken();
					if (newToken) {
						const newDecodedToken = jwtDecode<UserInfoPayload>(newToken);
						dispatch(login(newDecodedToken.UserInfo));
					} else {
						dispatch(logout());
					}
				}
			} else {
				dispatch(logout());
			}
			setIsLoading(false);
		};

		checkToken();
	}, [dispatch, token]);

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
