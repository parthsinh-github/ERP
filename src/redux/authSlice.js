import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user: null,
  token: null,
  loading: false,
  error: null,
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
   setUser:(state, action) => {
            state.user = action.payload;
        },
         loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});
export const {setLoading,setUser,loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;