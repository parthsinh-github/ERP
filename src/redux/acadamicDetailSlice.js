// redux/academicDetailSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allAcademicDetails: [],
  searchedQuery: "",
};

const academicDetailSlice = createSlice({
  name: "academicDetail",
  initialState,
  reducers: {
    setAllAcademicDetails: (state, action) => {
      state.allAcademicDetails = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
  },
});

export const { setAllAcademicDetails, setSearchedQuery } = academicDetailSlice.actions;
export default academicDetailSlice.reducer;
