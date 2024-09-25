import Cookies from 'js-cookie';
import { updateFavorites } from '../app/slices/userSlice';

const toggleFavorite = async (e: any, restaurantId: string, dispatch: any) => {
	e.stopPropagation();

	try {
		const accessToken = Cookies.get('accessToken');

		if (!accessToken) {
			throw new Error('No access token found. User is not authenticated.');
		}

		const response = await fetch(
			'http://localhost:3000/api/favorites/toggleFavorite',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ restaurantId }),
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to toggle favorite: ${response.statusText}`);
		}

		const data = await response.json();
		dispatch(updateFavorites(data.updatedUser.favorites));

		return data;
	} catch (error) {
		console.error('Error toggling favorite:', error);
	}
};

export { toggleFavorite };
