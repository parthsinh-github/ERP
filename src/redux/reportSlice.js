import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allReport: [],
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAllReports: (state, action) => {
      state.allReport = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAllReports, setError, setLoading } = reportSlice.actions;
export default reportSlice.reducer;
