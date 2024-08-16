import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Place } from '../../interfaces/Place.interfaces';

export interface PlaceState {
	places: Place[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PlaceState = {
	places: [],
	status: 'idle',
};

const placesSlice = createSlice({
	name: 'places',
	initialState,
	reducers: {
		fetchPlacesStart(state) {
			state.status = 'loading';
		},
		fetchPlacesSuccess(state, action: PayloadAction<Place[]>) {
			state.places = [...state.places, ...action.payload];
			state.status = 'succeeded';
		},
		fetchPlacesFailure(state) {
			state.status = 'failed';
		},
	},
});

export const { fetchPlacesStart, fetchPlacesSuccess, fetchPlacesFailure } =
	placesSlice.actions;

export default placesSlice.reducer;
