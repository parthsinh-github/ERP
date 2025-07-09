import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    allReport : [],
}

const reportSlice = createSlice ({
    name:"report",
    initialState,
    reducers:{
        setAllReport:(state,action) =>{
            state.allReport = action.payload;
        },
    },
})

export const {
    setAllReport
} = reportSlice.actions

export default reportSlice.reducer;