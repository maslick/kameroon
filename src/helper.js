export function initializeAudio() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  if (window.AudioContext) {
    window.audioContext = new window.AudioContext();
  }

  const fixAudioContext = function (e) {
    if (window.audioContext) {
      // Create empty buffer
      const buffer = window.audioContext.createBuffer(1, 1, 22050);
      const source = window.audioContext.createBufferSource();
      source.buffer = buffer;
      // Connect to output (speakers)
      source.connect(window.audioContext.destination);
      // Play sound
      if (source.start) {
        source.start(0);
      } else if (source.play) {
        source.play(0);
      } else if (source.noteOn) {
        source.noteOn(0);
      }
    }
    // Remove events
    document.removeEventListener('touchstart', fixAudioContext);
    document.removeEventListener('touchend', fixAudioContext);
  };
  // iOS 6-8
  document.addEventListener('touchstart', fixAudioContext);
  // iOS 9
  document.addEventListener('touchend', fixAudioContext);
}


export function monochromize(ref, container) {
  const context = ref.getContext("2d", {willReadFrequently: true});
  let imgd = context.getImageData(0, 0, container.width, container.height);
  let pix = imgd.data;
  for (let i = 0; i < pix.length; i += 4) {
    let gray = pix[i] * 0.3 + pix[i + 1] * 0.59 + pix[i + 2] * 0.11;
    pix[i] = gray;
    pix[i + 1] = gray;
    pix[i + 2] = gray;
  }
  context.putImageData(imgd, 0, 0);
}

export function drawCrosshair(ref) {
  const crossHairSvg = "M77.125 148.02567c0-3.5774 2.73862-6.27567 6.37076-6.27567H119V117H84.0192C66.50812 117 52 130.77595 52 148.02567V183h25.125v-34.97433zM237.37338 117H202v24.75h35.18494c3.63161 0 6.69006 2.69775 6.69006 6.27567V183H269v-34.97433C269 130.77595 254.88446 117 237.37338 117zM243.875 285.4587c0 3.5774-2.73863 6.27567-6.37076 6.27567H202V317h35.50424C255.01532 317 269 302.70842 269 285.4587V251h-25.125v34.4587zM83.49576 291.73438c-3.63213 0-6.37076-2.69776-6.37076-6.27568V251H52v34.4587C52 302.70842 66.50812 317 84.0192 317H119v-25.26563H83.49576z";
  const context = ref.getContext("2d", {willReadFrequently: true});
  context.fillStyle = "rgba(255,255,255,0.4)";
  const shape = new Path2D(crossHairSvg);
  context.fill(shape);
}

export function beep(freq = 750, duration = 150, vol = 5) {
  try {
    const context = window.audioContext;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    oscillator.frequency.value = freq;
    oscillator.type = "square";
    gain.connect(context.destination);
    gain.gain.value = vol * 0.01;
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration * 0.001);
  } catch (e) {
    console.warn("Sorry, Web Audio API is not supported by your browser");
    console.warn(e.toString());
  }
}

export const CAPTURE_OPTIONS = {
  audio: false,
  video: {facingMode: "environment"},
  scanRate: 250
};