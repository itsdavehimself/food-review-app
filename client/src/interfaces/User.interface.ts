import Bookmark from './Bookmarks.interface';
import Favorite from './Favorites.interface';

interface User {
	username: string;
	sub: string;
	email: string;
	displayName: string;
	favorites: Favorite[];
	bookmarks: Bookmark[];
}

export default User;
