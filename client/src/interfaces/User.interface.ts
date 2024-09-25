import Favorite from './Favorites.interface';

interface User {
	username: string;
	sub: string;
	email: string;
	displayName: string;
	favorites: Favorite[];
}

export default User;
