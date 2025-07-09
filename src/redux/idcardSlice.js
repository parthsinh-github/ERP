import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allIdCard: [],
};

const idcardSlice = createSlice({
  name: "idcard",
  initialState,
  reducers: {
    setAllIdCard: (state, action) => {
      state.allIdCard = action.payload;
    },
  },
});

export const { setAllIdCard } = idcardSlice.actions;

export default idcardSlice.reducer;
