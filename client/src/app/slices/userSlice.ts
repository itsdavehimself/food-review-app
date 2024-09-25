import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../interfaces/User.interface';
import Favorite from '../../interfaces/Favorites.interface';

export interface UserState {
	username: string | null;
	sub: string | null;
	email: string | null;
	displayName: string | null;
	favorites: Favorite[];
}

const initialState: UserState = {
	username: null,
	sub: null,
	email: null,
	displayName: null,
	favorites: [],
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
		},
		logout(state) {
			state.username = null;
			state.sub = null;
			state.email = null;
			state.displayName = null;
			state.favorites = [];
		},
		updateFavorites(state, action: PayloadAction<Favorite[]>) {
			state.favorites = action.payload;
		},
	},
});

export const { login, logout, updateFavorites } = userSlice.actions;

export default userSlice.reducer;
