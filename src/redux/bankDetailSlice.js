// redux/bankDetailSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allBankDetails: [], // ✅ use consistent naming
};

const bankDetailSlice = createSlice({
  name: "bankDetail",
  initialState,
  reducers: {
    setAllBankDetails: (state, action) => {
      state.allBankDetails = action.payload;
    },
  },
});

export const { setAllBankDetails } = bankDetailSlice.actions;
export default bankDetailSlice.reducer;
