import React, { useRef } from "react";
import Measure from "react-measure";
import { useUserMedia } from "../hooks/use-user-media";
import { useCardRatio } from "../hooks/use-card-ratio";
import { useOffsets } from "../hooks/use-offsets";
import useState from 'react-usestateref'
import {Video, Canvas, Wrapper, Container, Flash} from "./styles";
import {useQr} from "../hooks/use-qr";
import {beep, CAPTURE_OPTIONS, drawCrosshair, monochromize} from "../helper";


export function Camera({ onCapture, onClear }) {
  const canvasRef = useRef();
  const videoRef = useRef();
  let timestamp = useRef(0);
  let qrworker = useQr(handleCapture);

  const [container, setContainer] = useState({ width: 320, height: 430 });
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
      width: 320,
      height: 430
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

      monochromize(canvasRef.current, container);
      drawCrosshair(canvasRef.current);
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
    if (time - timestamp.current > CAPTURE_OPTIONS.scanRate) {
      timestamp.current = time;
      const context = canvasRef.current.getContext("2d", {willReadFrequently: true});
      const imageData = context.getImageData(0, 0, container.width, container.height);
      qrworker.postMessage({width: imageData.width, height: imageData.height});
      qrworker.postMessage(imageData, [imageData.data.buffer]);
    }
  }

  function handleCapture(code) {
    beep();
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

            <Flash
              flash={isFlashing}
              onAnimationEnd={() => setIsFlashing(false)}
            />

          </Container>
        </Wrapper>
      )}
    </Measure>
  );
}
