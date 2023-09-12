import React, {Fragment} from "react";
import {Footer} from "../styles";
import {useDispatch, useSelector} from "react-redux";
import {SET_BEEP, SET_BW, SET_CROSSHAIR, SET_CROSSHAIR_STYLE} from "../reducers/prefs";
import {useHistory} from "react-router-dom";
import Toggle from 'react-toggle';
import Select from 'react-select';
import "react-toggle/style.css";

export default function Config() {
  const dispatch = useDispatch();
  const beepOn = useSelector(state => state.prefs.beep);
  const crossHairOn = useSelector(state => state.prefs.crossHair);
  const crossHairStyle = useSelector(state => state.prefs.crossHairStyle);
  const bwOn = useSelector(state => state.prefs.bw);
  const {go} = useHistory();

  const handleSetBeep = async () => {
    dispatch(SET_BEEP(!beepOn));
  };

  const handleSetCrosshair = async () => {
    dispatch(SET_CROSSHAIR(!crossHairOn));
  };

  const handleSetCrosshairStyle = async (newVal) => {
    dispatch(SET_CROSSHAIR_STYLE(newVal.value));
  };

  const handleSetBw = async () => {
    dispatch(SET_BW(!bwOn));
  };

  return (
    <Fragment>
      <Fragment>
        <div style={{textAlign: "center", paddingTop: 180, marginBottom: 70}}>
          <h3>Config</h3>
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
            id='bw-status'
            defaultChecked={bwOn}
            onChange={handleSetBw}/>
          <label htmlFor='bw-status' className="toggle-label">Black and white</label>
          <div style={{flexBasis: "100%", height: 20}}></div>
          <Toggle
            id='crosshair-status'
            defaultChecked={crossHairOn}
            onChange={handleSetCrosshair}/>
          <label htmlFor='crosshair-status' className="toggle-label">Crosshair frame</label>
          <div style={{flexBasis: "100%", height: 20}}></div>
          {crossHairOn ?
            <Select
              styles={{
                control: ({borderColor, boxShadow, ...provided}, {theme}) => ({
                  ...provided,
                  borderColor: theme.colors.neutral20,
                  '&:hover': {
                    borderColor: theme.colors.neutral30
                  }
                })
              }}
              isSearchable={false}
              defaultValue={{
                value: crossHairStyle,
                label: crossHairStyle.charAt(0).toUpperCase() + crossHairStyle.slice(1)
              }}
              name="color"
              options={[{value: "rectangular", label: "Rectangular"}, {value: "square", label: "Square"}]}
              onChange={handleSetCrosshairStyle}
            />
            : null
          }
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