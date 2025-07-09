// src/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";


// Define initial state
const initialState = {
  allUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setAllUser: (state, action) => {
            state.allUsers = action.payload;
        },
      
    },
});

export const {
    setAllUser,
} = userSlice.actions;

export default userSlice.reducer;
