import { configureStore } from '@reduxjs/toolkit';
import prefs from "./prefs";

export const store = configureStore({
    reducer: {
        prefs
    }
});