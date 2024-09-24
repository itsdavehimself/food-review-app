import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import placesSlice from './slices/placesSlice';
import locationSlice from './slices/locationSlice';
import searchSlice from './slices/searchSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		places: placesSlice,
		location: locationSlice,
		search: searchSlice,
	},
});

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>;
