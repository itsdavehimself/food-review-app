import refreshAccessToken from './refreshAccessToken';
import { useAppDispatch } from '../app/hooks';
import { jwtDecode } from 'jwt-decode';
import { UserInfoPayload } from '../components/Login/Login';
import { login, logout } from '../app/slices/userSlice';

const dispatch = useAppDispatch();

const handleToken = async (token: string | undefined) => {
	try {
		if (!token) throw new Error('No token provided');

		const decodedToken = jwtDecode<UserInfoPayload>(token);
		dispatch(login(decodedToken.UserInfo));
	} catch (error: any) {
		console.error('Failed to decode or refresh token', error);
		const newToken = await refreshAccessToken();

		if (newToken) {
			const newDecodedToken = jwtDecode<UserInfoPayload>(newToken);
			dispatch(login(newDecodedToken.UserInfo));
		} else {
			dispatch(logout());
		}
	}
};

export default handleToken;
