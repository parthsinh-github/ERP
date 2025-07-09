import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allAnnouncement: [],
    searchedQuery: "",
    // Removed `announcement` since it wasn't used — add it back if needed
};

const announcementSlice = createSlice({
    name: "announcement",
    initialState,
    reducers: {
        setAllAnnouncement: (state, action) => {
            state.allAnnouncement = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
    },
});

export const {
    setAllAnnouncement,
    setSearchedQuery,
} = announcementSlice.actions;

export default announcementSlice.reducer;
