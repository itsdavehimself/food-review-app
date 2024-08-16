import refreshAccessToken from './refreshAccessToken';
import { jwtDecode } from 'jwt-decode';
import { UserInfoPayload } from '../components/Login/Login';
import { login, logout } from '../app/slices/userSlice';

const handleToken = async (token: string | undefined, dispatch: any) => {
	try {
		if (!token) throw new Error('No token provided');

		const decodedToken = jwtDecode<UserInfoPayload>(token);
		dispatch(login(decodedToken.UserInfo));
	} catch (error: any) {
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
