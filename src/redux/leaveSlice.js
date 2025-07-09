import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    allLeave : [],
}

const leaveSlice = createSlice ({
    name:"leave",
    initialState,
    reducers:{
        setAllLeave:(state,action) =>{
            state.allLeave = action.payload;
        },
    },
})

export const {
    setAllLeave
} = leaveSlice.actions

export default leaveSlice.reducer;