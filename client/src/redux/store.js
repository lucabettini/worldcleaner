import { configureStore } from '@reduxjs/toolkit';
import placesReducer from './placesSlice';

export default configureStore({
  reducer: {
    places: placesReducer,
  },
});
