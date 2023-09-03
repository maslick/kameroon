import {createSlice} from '@reduxjs/toolkit';

const beepOn = localStorage.getItem('beepOn');
const crossHairOn = localStorage.getItem('crossHairOn');
const bwOn = localStorage.getItem('bwOn');


if (beepOn === null || crossHairOn === null || bwOn === null) {
  localStorage.setItem('beepOn', 'true');
  localStorage.setItem('crossHairOn', 'true');
  localStorage.setItem('bwOn', 'true');
}

const initialState = {
  beep: localStorage.getItem('beepOn') === 'true',
  crossHair: localStorage.getItem('crossHairOn')  === 'true',
  bw: localStorage.getItem('bwOn') === 'true',
};

export const prefSlice = createSlice({
  name: 'prefs',
  initialState,
  reducers: {
    SET_BEEP: (state, action) => {
      state.beep = action.payload;
      localStorage.setItem('beepOn', action.payload);
    },
    SET_CROSSHAIR: (state, action) => {
      state.crossHair = action.payload;
      localStorage.setItem('crossHairOn', action.payload);
    },
    SET_BW: (state, action) => {
      state.bw = action.payload;
      localStorage.setItem('bwOn', action.payload);
    }
  },
});

export const {SET_BEEP, SET_CROSSHAIR, SET_BW} = prefSlice.actions;

export default prefSlice.reducer;