import React, { useRef } from "react";
import Measure from "react-measure";
import { useUserMedia } from "../hooks/use-user-media";
import { useCardRatio } from "../hooks/use-card-ratio";
import { useOffsets } from "../hooks/use-offsets";
import useState from 'react-usestateref';
import {Video, Canvas, Wrapper, Container, Flash} from "./styles";
import {useQr} from "../hooks/use-qr";
import {beep, monochromize} from "../helper";


// Crosshair config
const crossHairSvg = "M77.125 148.02567c0-3.5774 2.73862-6.27567 6.37076-6.27567H119V117H84.0192C66.50812 117 52 130.77595 52 148.02567V183h25.125v-34.97433zM237.37338 117H202v24.75h35.18494c3.63161 0 6.69006 2.69775 6.69006 6.27567V183H269v-34.97433C269 130.77595 254.88446 117 237.37338 117zM243.875 285.4587c0 3.5774-2.73863 6.27567-6.37076 6.27567H202V317h35.50424C255.01532 317 269 302.70842 269 285.4587V251h-25.125v34.4587zM83.49576 291.73438c-3.63213 0-6.37076-2.69776-6.37076-6.27568V251H52v34.4587C52 302.70842 66.50812 317 84.0192 317H119v-25.26563H83.49576z";
const crossHairWidth = 217, crossHairHeight = 200, x0 = 53, y0 = 117;

// Camera config
export const CAPTURE_OPTIONS = {
  audio: false,
  video: {facingMode: "environment"}
};


export function Scan({ onCapture, onClear, beepOn = true, scanRate = 250, bw = true, crosshair = true }) {
  const canvasRef = useRef();
  const videoRef = useRef();
  let timestamp = useRef(0);
  let qrworker = useQr(handleCapture);

  const VIDEO_DIMENSIONS = {
    width: 320,
    height: 430
  };

  const [container, setContainer] = useState({ width: VIDEO_DIMENSIONS.width, height: VIDEO_DIMENSIONS.height });
  const [isFlashing, setIsFlashing] = useState(false);
  let [isVideoPlaying, setIsVideoPlaying, videoPlaying] = useState(false);

  const mediaStream = useUserMedia(CAPTURE_OPTIONS);
  const [aspectRatio, calculateRatio] = useCardRatio();
  const offsets = useOffsets(
    videoRef.current && videoRef.current.videoWidth,
    videoRef.current && videoRef.current.videoHeight,
    container.width,
    container.height
  );

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleResize(contentRect) {
    setContainer({
      width: VIDEO_DIMENSIONS.width,
      height: VIDEO_DIMENSIONS.height
    });
  }

  function tick(time) {
    if (videoRef.current && videoRef.current.readyState === 4) {
      // Draw video element data onto Canvas
      const context = canvasRef.current.getContext("2d", {willReadFrequently: true});
      context.drawImage(
        videoRef.current,
        (videoRef.current.videoWidth - container.width)/2,
        (videoRef.current.videoHeight - container.height)/2,
        container.width,
        container.height,
        0,
        0,
        container.width,
        container.height
      );

      if (bw) monochromize(canvasRef.current, container);
      if (crosshair) drawCrosshair(canvasRef.current);
      requestAnimationFrame(tick);
      if (videoPlaying.current) recogniseQRcode(time);
    }
    else if (isVideoPlaying) requestAnimationFrame(tick);
  }

  function handleCanPlay() {
    calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
    videoRef.current.play();
    setIsVideoPlaying(true);
    requestAnimationFrame(tick);
  }

  function recogniseQRcode(time) {
    if (time - timestamp.current > scanRate) {
      timestamp.current = time;
      const context = canvasRef.current.getContext("2d", {willReadFrequently: true});
      let imageData;
      if (crosshair === true)
        imageData = context.getImageData(x0, y0, crossHairWidth, crossHairHeight);
      else
        imageData = context.getImageData(0, 0, container.width, container.height);
      qrworker.postMessage({width: imageData.width, height: imageData.height});
      qrworker.postMessage(imageData, [imageData.data.buffer]);
    }
  }

  function handleCapture(code) {
    if (beepOn) beep();
    videoRef.current.pause();
    setIsVideoPlaying(false);
    setIsFlashing(true);
    onCapture(code);
    onClear();
  }

  if (!mediaStream) {
    return null;
  }

  return (
    <Measure bounds onResize={handleResize}>
      {({measureRef}) => (
        <Wrapper>
          <Container
            ref={measureRef}
            maxHeight={videoRef.current && videoRef.current.videoHeight}
            maxWidth={videoRef.current && videoRef.current.videoWidth}
            style={{
              height: `${container.height}px`,
              borderRadius: 6,
              boxShadow: "inset 0 0 0 1px #e6e6e6"
            }}
          >
            <Video
              ref={videoRef}
              hidden={!isVideoPlaying}
              onCanPlay={handleCanPlay}
              autoPlay
              playsInline
              muted
              style={{
                top: `-${offsets.y}px`,
                left: `-${offsets.x}px`
              }}
            />

            <Canvas
              ref={canvasRef}
              width={container.width}
              height={container.height}
            />
          </Container>
        </Wrapper>
      )}
    </Measure>
  );
}

export function drawCrosshair(ref) {
  const context = ref.getContext("2d", {willReadFrequently: true});
  context.fillStyle = "rgba(255,255,255,0.4)";
  const shape = new Path2D(crossHairSvg);
  context.fill(shape);
}