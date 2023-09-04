import React, {Fragment} from "react";
import {Footer} from "../styles";
import {useDispatch, useSelector} from "react-redux";
import {SET_BEEP, SET_BW, SET_CROSSHAIR} from "../reducers/prefs";
import {useHistory} from "react-router-dom";
import Toggle from 'react-toggle';
import "react-toggle/style.css";

export default function Settings() {
  const dispatch = useDispatch();
  const beepOn = useSelector(state => state.prefs.beep);
  const crossHairOn = useSelector(state => state.prefs.crossHair);
  const bwOn = useSelector(state => state.prefs.bw);
  const {go} = useHistory();

  const handleSetBeep = async () => {
    dispatch(SET_BEEP(!beepOn));
  };

  const handleSetCrosshair = async () => {
    dispatch(SET_CROSSHAIR(!crossHairOn));
  };

  const handleSetBw = async () => {
    dispatch(SET_BW(!bwOn));
  };

  return (
    <Fragment>
      <Fragment>
        <div style={{textAlign: "center", paddingTop: 180, marginBottom: 70}}>
          <h3>Settings</h3>
        </div>
      </Fragment>

      <Footer>
        <div>
          <Toggle
            id='beep-status'
            defaultChecked={beepOn}
            onChange={handleSetBeep}/>
          <label htmlFor='beep-status' className="toggle-label">Beep</label>
          <div style={{flexBasis: "100%", height: 20}}></div>
          <Toggle
            id='crosshair-status'
            defaultChecked={crossHairOn}
            onChange={handleSetCrosshair}/>
          <label htmlFor='crosshair-status' className="toggle-label">Crosshair</label>
          <div style={{flexBasis: "100%", height: 20}}></div>
          <Toggle
            id='bw-status'
            defaultChecked={bwOn}
            onChange={handleSetBw}/>
          <label htmlFor='bw-status' className="toggle-label">Black and white</label>
        </div>

        <div style={{flexBasis: "100%", height: 70}}></div>
        <a href="/" onClick={(e) => {
          e.preventDefault();
          go(-1);
        }}>Back</a>
      </Footer>
    </Fragment>
  );
}