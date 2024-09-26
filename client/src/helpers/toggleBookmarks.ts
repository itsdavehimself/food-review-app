import Cookies from 'js-cookie';
import { updateBookmarks } from '../app/slices/userSlice';
import { Place } from '../interfaces/Place.interfaces';

const toggleBookmark = async (e: any, place: Place, dispatch: any) => {
	e.stopPropagation();

	try {
		const accessToken = Cookies.get('accessToken');

		if (!accessToken) {
			throw new Error('No access token found. User is not authenticated.');
		}

		const response = await fetch(
			'http://localhost:3000/api/bookmarks/toggleBookmark',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ place }),
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to toggle bookmark: ${response.statusText}`);
		}

		const data = await response.json();
		dispatch(updateBookmarks(data.updatedUser.bookmarks));

		return data;
	} catch (error) {
		console.error('Error toggling bookmark:', error);
	}
};

export { toggleBookmark };
