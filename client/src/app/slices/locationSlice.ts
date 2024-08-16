import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LocationState {
	latitude: number;
	longitude: number;
}

const initialState: LocationState = {
	latitude: -1,
	longitude: -1,
};

const locationSlice = createSlice({
	name: 'location',
	initialState,
	reducers: {
		setLocation(state, action: PayloadAction<LocationState>) {
			state.latitude = action.payload.latitude;
			state.longitude = action.payload.longitude;
		},
	},
});

export const { setLocation } = locationSlice.actions;

export default locationSlice.reducer;
