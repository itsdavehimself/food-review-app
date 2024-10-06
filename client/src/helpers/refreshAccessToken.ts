import Cookies from 'js-cookie';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const refreshAccessToken = async () => {
	try {
		const response = await fetch(`${serverUrl}/api/auth/refresh`, {
			method: 'POST',
			credentials: 'include',
		});

		// Log the raw response text to inspect what is being returned
		const text = await response.text();

		// Try to parse the response as JSON
		try {
			const data = JSON.parse(text);
			if (response.ok) {
				Cookies.set('accessToken', data.accessToken);
				return data.accessToken;
			} else {
				console.error('Failed to refresh token:', data);
				return null;
			}
		} catch (parseError) {
			console.error('Error parsing response as JSON:', parseError);
			return null;
		}
	} catch (error) {
		console.error('Error while refreshing token:', error);
		Cookies.remove('accessToken');
		return null;
	}
};

export default refreshAccessToken;
