import React, {Fragment} from "react";
import {Footer, Root} from "../styles";
import {Button} from "../scan/styles";
import {useDispatch, useSelector} from "react-redux";
import {SET_BEEP, SET_BW, SET_CROSSHAIR} from "../reducers/prefs";

export default function Settings() {
  const dispatch = useDispatch();
  const beepOn = useSelector(state => state.prefs.beep);
  const crossHairOn = useSelector(state => state.prefs.crossHair);
  const bwOn = useSelector(state => state.prefs.bw);

  const handleSetBeep = async () => {
    dispatch(SET_BEEP(!beepOn));
  };

  const handleSetCrosshair = async () => {
    dispatch(SET_CROSSHAIR(!crossHairOn));
  };

  const handleSetBw = async () => {
    dispatch(SET_BW(!bwOn));
  };

  const beepStyle = () => {
    if (beepOn) return {
      background: "green"
    }
  };

  const crossHairStyle = () => {
    if (crossHairOn) return {
      background: "green"
    }
  };

  const bwStyle = () => {
    if (bwOn) return {
      background: "green"
    }
  };

  return (
    <Fragment>
      <Root>
        <div style={{minHeight: 200, margin: 20}}>
          <h2>Settings</h2>
        </div>
      </Root>
      <Footer>
        <Button onClick={handleSetBeep} style={beepStyle()}>Beep</Button>
        <div style={{flexBasis: "100%", height: 0}}></div>
        <Button onClick={handleSetCrosshair} style={crossHairStyle()}>Crosshair</Button>
        <div style={{flexBasis: "100%", height: 0}}></div>
        <Button onClick={handleSetBw} style={bwStyle()}>B/W</Button>
      </Footer>
    </Fragment>
  );
}