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

  return (
    <Fragment>
      <Root>
        <div style={{minHeight: 430, margin: 20}}>
          {result && (
            <Result>
              <h2>Result</h2>
              <p>{result['rawcode']}</p>
              <p>{result['milliseconds']} ms</p>
            </Result>
          )}
          {isCameraOpen &&
            <Scan onCapture={onCapture} onClear={onClear} beepOn={true} bw={true} crosshair={true}/>
          }
        </div>

        <Footer>
          {!isCameraOpen ?
            <Button onClick={handleStartScanBtn}>SCAN</Button>:
            <Button onClick={handleStopScanBtn}>STOP</Button>
          }
        </Footer>
      </Root>
      <GlobalStyle/>
    </Fragment>
  );
}
