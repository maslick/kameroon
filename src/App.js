import React, { Fragment, useState } from "react";
import { Scan } from "./scan";
import {Root, Footer, GlobalStyle, Result} from "./styles";
import {initializeAudio} from "./helper";
import {Button} from "./scan/styles";

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState();

  const onCapture = (code) => setResult(code);
  const onClear = () => setIsCameraOpen(false);

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
          <h3>Welcome to Cameroon!</h3>
          <p>Click SCAN to start the QR code scanner :)</p>
        </div>
      );
  };

  const renderCamera = () => {
    if (isCameraOpen) return (
      <Scan onCapture={onCapture} onClear={onClear} beepOn={true} bw={true} crosshair={true}/>
    );
  };

  const renderResult = () => {
    if (result) return (
      <Result>
        <p>{result['rawcode']}</p>
        <p><b>{result['milliseconds']} ms</b></p>
      </Result>
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
          {!isCameraOpen ?
            <Button onClick={handleStartScanBtn}>SCAN</Button> :
            <Button onClick={handleStopScanBtn}>STOP</Button>
          }
        </Footer>
      </Root>
      <GlobalStyle/>
    </Fragment>
  );
}
