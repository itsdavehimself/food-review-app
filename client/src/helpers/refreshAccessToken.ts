import Cookies from 'js-cookie';

const refreshAccessToken = async () => {
	try {
		const response = await fetch('http://localhost:3000/api/auth/refresh', {
			method: 'GET',
			credentials: 'include',
		});
		const data = await response.json();
		if (response.ok) {
			Cookies.set('accessToken', data.accessToken);
			return data.accessToken;
		} else {
			return null;
		}
	} catch (error) {
		Cookies.remove('accessToken');
		return null;
	}
};

export default refreshAccessToken;
