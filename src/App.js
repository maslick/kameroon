import React, { Fragment, useState } from "react";
import { Camera } from "./camera";
import {Root, Footer, GlobalStyle, Result} from "./styles";
import {initializeAudio} from "./helper";
import {Button} from "./camera/styles";

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState();

  const onCapture = (code) => {
    setResult(code);
  };
  const onClear = () => {
    setIsCameraOpen(false);
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
            <Camera onCapture={code => onCapture(code)} onClear={onClear}/>
          }
        </div>

        <Footer>
          {!isCameraOpen ?
            <Button onClick={() => {
              initializeAudio();
              setIsCameraOpen(true);
              setResult(undefined);
            }}>SCAN</Button> :
            <Button
              onClick={() => {
                setIsCameraOpen(false);
                setResult(undefined);
              }}
            >
              STOP
            </Button>
          }
        </Footer>
      </Root>
      <GlobalStyle/>
    </Fragment>
  );
}
