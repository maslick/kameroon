import React, {Fragment, useState} from "react";
import { Scan } from "./scan";
import {Root, Footer, GlobalStyle, Result} from "./styles";
import {initializeAudio} from "./helper";
import {Button} from "./scan/styles";
import {useHistory} from 'react-router-dom';
import {useSelector} from "react-redux";
import {useQueryState} from "./useQueryState";
import {encryptMessage, encodeEncryptedMessageAsBase64} from "@maslick/kameroon";

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState();
  const [redirect_url] = useQueryState("redirect_url");
  const [publicKey] = useQueryState("public_key");

  const beep = useSelector(state => state.prefs.beep);
  const crossHair = useSelector(state => state.prefs.crossHair);
  const crossHairStyle = useSelector(state => state.prefs.crossHairStyle);
  const bw = useSelector(state => state.prefs.bw);

  const onCapture = async (code) => {
    if (redirect_url && publicKey) {
      const encryptedMessage = await encryptMessage(decodeURIComponent(publicKey), code.rawcode);
      const encryptedMessageBase64 = encodeEncryptedMessageAsBase64(encryptedMessage);
      const base64urlEncodedMessage = encodeURIComponent(encryptedMessageBase64);
      setTimeout(()=> {
        window.location.replace(`${redirect_url}?code=${base64urlEncodedMessage}`);
      }, 300);
    } else
      setResult(code);
  };

  const onClear = () => setIsCameraOpen(false);
  const {push} = useHistory();

  const handleStartScanBtn = () => {
    initializeAudio();
    setIsCameraOpen(true);
    setResult(undefined);
  };

  const handleStopScanBtn = () => {
    setIsCameraOpen(false);
    setResult(undefined);
  };

  const renderHelp = () => {
    if (!isCameraOpen && !result)
      return (
        <div style={{paddingTop: 180}}>
          <h3>Welcome to <a href="https://kameroon.web.app">Kameroon</a>!</h3>
          <p>Click SCAN to start the QR code scanner :)</p>
        </div>
      );
  };

  const renderCamera = () => {
    if (isCameraOpen) return (
      <Scan
        onCapture={onCapture}
        onClear={onClear}
        beepOn={beep}
        bw={bw}
        scanRate={200}
        crosshair={{enabled: crossHair, style: crossHairStyle}}
      />
    );
  };

  const renderResult = () => {
    if (result) return (
      <Result>
        <p>{result['rawcode']}</p>
        <p><b>{result['alg']}: {result['milliseconds']} ms</b></p>
      </Result>
    );
  };

  const renderSettingsButton = () => {
    if (!isCameraOpen || result) return (
        <Button style={{backgroundColor: "green"}} onClick={async () => push("/config")}>CONFIG</Button>
    );
  };

  return (
    <Fragment>
      <Root>
        <div style={{minHeight: 430, margin: 20}}>
          {renderHelp()}
          {renderResult()}
          {renderCamera()}
        </div>

        <Footer>
          <div>
            {!isCameraOpen ?
              <Button onClick={handleStartScanBtn}>SCAN</Button> :
              <Button onClick={handleStopScanBtn} style={{backgroundColor: "red"}}>STOP</Button>
            }
          </div>
          <div style={{flexBasis: "100%", height: 0}}></div>
          {renderSettingsButton()}
        </Footer>
      </Root>
      <GlobalStyle/>
    </Fragment>
  );
}
