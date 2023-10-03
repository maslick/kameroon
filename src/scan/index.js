import React, { useRef } from "react";
import Measure from "react-measure";
import { useUserMedia } from "../hooks/use-user-media";
import { useCardRatio } from "../hooks/use-card-ratio";
import { useOffsets } from "../hooks/use-offsets";
import useState from 'react-usestateref';
import {Video, Canvas, Wrapper, Container} from "./styles";
import {useQr} from "../hooks/use-qr";
import {beep, monochromize} from "../helper";


// Crosshair config
const xHairSquare = {
  svg: "M288,298 L288,326 C288,335.388841 280.388841,343 271,343 L243.328859,343 L243.328,319 L249,319 C257.284271,319 264,312.284271 264,304 L264,298 L288,298 Z M56,298 L56,304 C56,312.284271 62.7157288,319 71,319 L76.671,319 L76.6711409,343 L49,343 C39.6111593,343 32,335.388841 32,326 L32,298 L56,298 Z M271,87 C280.388841,87 288,94.6111593 288,104 L288,133 L264,133 L264,126 C264,117.715729 257.284271,111 249,111 L243.328,111 L243.328859,87 L271,87 Z M32,104 C32,94.6111593 39.6111593,87 49,87 L76.6711409,87 L76.671,111 L71,111 C62.7157288,111 56,117.715729 56,126 L56,133 L32,133 L32,104 Z",
  width: 256,
  height: 256,
  x0: 32,
  y0: 87
}

const xHairRect = {
  svg: "M309,266 L309,294 C309,303.388841 301.388841,311 292,311 L257,311 L257,286.832 L274,286.832168 C282.284271,286.832168 289,280.116439 289,271.832168 L289,266 L309,266 Z M31,266 L31,271.832168 C31,280.116439 37.7157288,286.832168 46,286.832168 L63,286.832 L63,311 L28,311 C18.6111593,311 11,303.388841 11,294 L11,266 L31,266 Z M63,119 L63,143.167 L46,143.167832 C37.7157288,143.167832 31,149.883561 31,158.167832 L31,169 L11,169 L11,136 C11,126.611159 18.6111593,119 28,119 L63,119 Z M292,119 C301.388841,119 309,126.611159 309,136 L309,169 L289,169 L289,158.167832 C289,149.883561 282.284271,143.167832 274,143.167832 L257,143.167 L257,119 L292,119 Z",
  width: 298,
  height: 192,
  x0: 11,
  y0: 119
}

// Camera config
export const CAPTURE_OPTIONS = {
  audio: false,
  video: {facingMode: "environment"}
};


export function Scan({ onCapture, onClear, crosshair, beepOn = true, scanRate = 250, bw = true }) {
  const canvasRef = useRef();
  const videoRef = useRef();
  let timestamp = useRef(0);
  let [zbarWorker, zxingWorker] = useQr(handleCapture);

  const VIDEO_DIMENSIONS = {
    width: 320,
    height: 430
  };

  const [container, setContainer] = useState({ width: VIDEO_DIMENSIONS.width, height: VIDEO_DIMENSIONS.height });
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
      if (crosshair.enabled) drawCrosshair(canvasRef.current, crosshair.style);
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
      if (crosshair.enabled === true) {
        if (crosshair.style === 'square')
          imageData = context.getImageData(xHairSquare.x0, xHairSquare.y0, xHairSquare.width, xHairSquare.height);
        else
          imageData = context.getImageData(xHairRect.x0, xHairRect.y0, xHairRect.width, xHairRect.height);
      } else
        imageData = context.getImageData(0, 0, container.width, container.height);

      const dimensions = {width: imageData.width, height: imageData.height};
      const bufferZbar = imageData.data.buffer.slice(0);
      const bufferZXing = imageData.data.buffer.slice(0);

      zbarWorker.postMessage(dimensions);
      zxingWorker.postMessage(dimensions);
      zbarWorker.postMessage(imageData, [bufferZbar]);
      zxingWorker.postMessage(imageData, [bufferZXing]);
    }
  }

  function handleCapture(code) {
    if (!videoRef.current) return;
    if (beepOn) beep();
    videoRef.current.pause();
    setIsVideoPlaying(false);
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

export function drawCrosshair(ref, style) {
  const context = ref.getContext("2d", {willReadFrequently: true});
  context.fillStyle = "rgba(255,255,255,0.4)";
  if (style === 'square') {
    const shape = new Path2D(xHairSquare.svg);
    context.fill(shape);
  } else {
    const shape = new Path2D(xHairRect.svg);
    context.fill(shape);
  }
}