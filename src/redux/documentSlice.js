// redux/slices/documentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allRequests: [],
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAllRequests: (state, action) => {
      state.allRequests = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setAllRequests, setError } = documentSlice.actions;
export default documentSlice.reducer;
