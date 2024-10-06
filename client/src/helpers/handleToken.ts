import refreshAccessToken from './refreshAccessToken';
import { jwtDecode } from 'jwt-decode';
import { UserInfoPayload } from '../components/Login/Login';
import { login, logout } from '../app/slices/userSlice';

const serverUrl = import.meta.env.VITE_SERVER_URL;

let refreshTimeout: NodeJS.Timeout | null = null;

const scheduleTokenRefresh = (decodedToken: UserInfoPayload, dispatch: any) => {
	const currentTime = Date.now() / 1000;

	if (!decodedToken.exp) {
		throw new Error('No token expiration time set');
	}

	const timeUntilExpiration = decodedToken.exp - currentTime;
	const timeUntilRefresh = (timeUntilExpiration - 5 * 60) * 1000;

	if (timeUntilRefresh > 0) {
		refreshTimeout = setTimeout(async () => {
			const newToken = await refreshAccessToken();
			if (newToken) {
				await handleToken(newToken, dispatch);
			} else {
				console.error('Failed to refresh token');
				dispatch(logout());
			}
		}, timeUntilRefresh);
	} else {
		dispatch(logout());
	}
};

const handleToken = async (token: string | undefined, dispatch: any) => {
	try {
		if (!token) {
			throw new Error('No token provided');
		}

		const decodedToken = jwtDecode<UserInfoPayload>(token);

		const currentTime = Date.now() / 1000;
		if (decodedToken.exp && decodedToken.exp < currentTime) {
			const newToken = await refreshAccessToken();
			if (newToken) {
				await handleToken(newToken, dispatch);
				return;
			} else {
				throw new Error('Failed to refresh token');
			}
		}

		scheduleTokenRefresh(decodedToken, dispatch);

		// Fetch user data after verifying token
		const response = await fetch(
			`${serverUrl}/api/savedData/getUserSavedData`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch user data: ${response.statusText}`);
		}

		const data = await response.json();

		dispatch(
			login({
				...decodedToken.UserInfo,
				favorites: data.favorites || [],
				bookmarks: data.bookmarks || [],
				reviews: [],
				preferences: data.preferences || { value: 5, ambiance: 5, service: 5 },
				userPreferencesSet: data.userPreferencesSet || false,
			})
		);
	} catch (error: any) {
		console.error('Error in handleToken:', error.message);

		if (refreshTimeout) {
			clearTimeout(refreshTimeout);
		}

		dispatch(logout());
	}
};

export default handleToken;
