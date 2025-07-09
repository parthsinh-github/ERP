import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import announcementSlice from "./announcementSlice";
import leaveSlice from "./leaveSlice";
import idcardSlice from "./idcardSlice";
import examSlice from "./examSlice";
import reportSlice from "./reportSlice";
import userSlice from "./userSlice";
import documentSlice from "./documentSlice"
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web

// Redux Persist Configuration
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

// Combine Reducers
const rootReducer = combineReducers({
    auth: authSlice,
    announcement: announcementSlice,
    leave: leaveSlice,
    idcard: idcardSlice, 
    exam: examSlice, 
    report: reportSlice, 
    user: userSlice,
    document: documentSlice,
    // Add other reducers here as needed
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux Store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    devTools: import.meta.env?.MODE !== 'production', // Adjust for Vite or fallback to process.env
});

// Persistor
export const persistor = persistStore(store);
export default store;
