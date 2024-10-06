import Bookmark from './Bookmarks.interface';
import Favorite from './Favorites.interface';
import Preferences from './Preferences.interface';
import Review from './Review.interface';

interface User {
	username: string;
	sub: string;
	email: string;
	displayName: string;
	favorites: Favorite[];
	bookmarks: Bookmark[];
	reviews: Review[];
	preferences: Preferences;
	userPreferencesSet: boolean;
}

export default User;
