import {createSlice} from '@reduxjs/toolkit';


const initialState = {
  beep: true,
  crossHair: true,
  bw: true
};

export const prefSlice = createSlice({
  name: 'prefs',
  initialState,
  reducers: {
    SET_BEEP: (state, action) => {
      state.beep = action.payload;
    },
    SET_CROSSHAIR: (state, action) => {
      state.crossHair = action.payload;
    },
    SET_BW: (state, action) => {
      state.bw = action.payload;
    }
  },
});

export const {SET_BEEP, SET_CROSSHAIR, SET_BW} = prefSlice.actions;

export default prefSlice.reducer;