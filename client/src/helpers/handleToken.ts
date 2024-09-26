import refreshAccessToken from './refreshAccessToken';
import { jwtDecode } from 'jwt-decode';
import { UserInfoPayload } from '../components/Login/Login';
import { login, logout } from '../app/slices/userSlice';

const handleToken = async (token: string | undefined, dispatch: any) => {
	try {
		if (!token) throw new Error('No token provided');

		// Decode the token to get basic user info
		const decodedToken = jwtDecode<UserInfoPayload>(token);

		// Fetch the user's favorites from the backend (or use the existing API)
		const response = await fetch(
			'http://localhost:3000/api/savedData/getUserSavedData',
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const data = await response.json();

		// Dispatch login with the full user info, including favorites
		dispatch(
			login({
				...decodedToken.UserInfo,
				favorites: data.favorites || [],
				bookmarks: data.bookmarks || [],
			})
		);
	} catch (error: any) {
		const newToken = await refreshAccessToken();

		if (newToken) {
			const newDecodedToken = jwtDecode<UserInfoPayload>(newToken);

			// Fetch the favorites again if token was refreshed
			const response = await fetch('http://localhost:3000/api/user/favorites', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${newToken}`,
				},
			});

			const data = await response.json();

			// Dispatch login with the full user info and favorites
			dispatch(
				login({
					...newDecodedToken.UserInfo,
					favorites: data.favorites || [],
					bookmarks: data.bookmarks || [],
				})
			);
		} else {
			dispatch(logout());
		}
	}
};

export default handleToken;
