import { configureStore } from '@reduxjs/toolkit';
import prefs from "./reducers/prefs";

export const store = configureStore({
    reducer: {
        prefs
    }
});