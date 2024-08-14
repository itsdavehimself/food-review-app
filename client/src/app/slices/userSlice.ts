import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../interfaces/userInterface';

export interface UserState {
	username: string | null;
	sub: string | null;
	email: string | null;
	displayName: string | null;
}

const initialState: UserState = {
	username: null,
	sub: null,
	email: null,
	displayName: null,
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
		},
		logout(state) {
			state.username = null;
			state.sub = null;
			state.email = null;
			state.displayName = null;
		},
	},
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
