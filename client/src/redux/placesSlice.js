import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  places: [],
  status: 'idle',
  error: false,
  currentPlace: '',
};

// GET api/places           @res        Data of every place
export const fetchPlaces = createAsyncThunk('places/fetchPlaces', async () => {
  const res = await axios.get('/api/places');
  return res.data;
});

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    throwError(state) {
      state.error = true;
    },
    clearError(state) {
      state.error = false;
    },
  },
  extraReducers: {
    // GET api/places
    [fetchPlaces.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchPlaces.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.places = action.payload;
    },
    [fetchPlaces.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = true;
      state.places = [];
    },
  },
});

export const { throwError, clearError } = placesSlice.actions;

export default placesSlice.reducer;

// SELECTORS

export const selectPlaces = (state) => state.places.places;

export const selectSortedPlaces = (state) => {
  const places = [...state.places.places];
  return places.sort((a, b) =>
    Date.parse(a.createdAt) > Date.parse(b.createdAt) ? -1 : 1
  );
};

export const selectStatus = (state) => state.places.status;

export const selectError = (state) => state.places.error;
