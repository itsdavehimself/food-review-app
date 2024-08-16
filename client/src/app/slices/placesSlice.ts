import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Place } from '../../interfaces/Place.interfaces';

export interface PlaceState {
	places: Place[];
}

const initialState: PlaceState = {
	places: [],
};

const placesSlice = createSlice({
	name: 'places',
	initialState,
	reducers: {
		setPlaces(state, action: PayloadAction<Place[]>) {
			state.places = [...state.places, ...action.payload];
		},
	},
});

export const { setPlaces } = placesSlice.actions;

export default placesSlice.reducer;
