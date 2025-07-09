import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    allExam : [],
}

const examSlice = createSlice ({
    name:"exam",
    initialState,
    reducers:{
        setAllExam:(state,action) =>{
            state.allExam = action.payload;
        },
    },
})

export const {
    setAllExam
} = examSlice.actions

export default examSlice.reducer;