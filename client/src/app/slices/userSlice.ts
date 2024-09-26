import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../interfaces/User.interface';
import Favorite from '../../interfaces/Favorites.interface';
import Bookmark from '../../interfaces/Bookmarks.interface';

export interface UserState {
	username: string | null;
	sub: string | null;
	email: string | null;
	displayName: string | null;
	favorites: Favorite[];
	bookmarks: Bookmark[];
}

const initialState: UserState = {
	username: null,
	sub: null,
	email: null,
	displayName: null,
	favorites: [],
	bookmarks: [],
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login(state, action: PayloadAction<User>) {
			state.username = action.payload.username;
			state.sub = action.payload.sub;
			state.email = action.payload.email;
			state.displayName = action.payload.displayName;
			state.favorites = action.payload.favorites ?? [];
			state.bookmarks = action.payload.bookmarks ?? [];
		},
		logout(state) {
			state.username = null;
			state.sub = null;
			state.email = null;
			state.displayName = null;
			state.favorites = [];
			state.bookmarks = [];
		},
		updateFavorites(state, action: PayloadAction<Favorite[]>) {
			state.favorites = action.payload;
		},
		updateBookmarks(state, action: PayloadAction<Bookmark[]>) {
			state.bookmarks = action.payload;
		},
	},
});

export const { login, logout, updateFavorites, updateBookmarks } =
	userSlice.actions;

export default userSlice.reducer;
