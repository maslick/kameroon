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
