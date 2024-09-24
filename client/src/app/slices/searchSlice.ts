import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Place } from '../../interfaces/Place.interfaces';

export interface SearchState {
	restaurant: string;
	location: string;
	places: Place[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: SearchState = {
	restaurant: '',
	location: '',
	places: [],
	status: 'idle',
};

const searchSlice = createSlice({
	name: 'search',
	initialState,
	reducers: {
		fetchRestaurantsStart(state) {
			state.status = 'loading';
		},
		setSearch(
			state,
			action: PayloadAction<{ restaurant: string; location: string }>
		) {
			state.restaurant = action.payload.restaurant;
			state.location = action.payload.location;
		},
		fetchRestaurantsSuccess(state, action: PayloadAction<Place[]>) {
			state.places = action.payload;
			state.status = 'succeeded';
		},
		fetchRestaurantsFailure(state) {
			state.status = 'failed';
		},
		clearSearch(state) {
			state.restaurant = '';
			state.location = '';
			state.status = 'idle';
			state.places = [];
		},
	},
});

export const {
	fetchRestaurantsStart,
	fetchRestaurantsSuccess,
	fetchRestaurantsFailure,
	setSearch,
	clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
