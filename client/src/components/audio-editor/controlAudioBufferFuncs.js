export const mergeBuffers = buffers => {
  const ac = new AudioContext();
  var maxChannels = 0;
  var maxDuration = 0;
  for (var i = 0; i < buffers.length; i++) {
    if (buffers[i].numberOfChannels > maxChannels) {
      maxChannels = buffers[i].numberOfChannels;
    }
    if (buffers[i].duration > maxDuration) {
      maxDuration = buffers[i].duration;
    }
  }
  var out = ac.createBuffer(
    maxChannels,
    ac.sampleRate * maxDuration,
    ac.sampleRate
  );
  for (var j = 0; j < buffers.length; j++) {
    for (
      var srcChannel = 0;
      srcChannel < buffers[j].numberOfChannels;
      srcChannel++
    ) {
      var outt = out.getChannelData(srcChannel);
      var inn = buffers[j].getChannelData(srcChannel);
      for (var i2 = 0; i2 < inn.length; i2++) {
        outt[i2] += inn[i2];
      }
      out.getChannelData(srcChannel).set(outt, 0);
    }
  }
  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  var source = ac.createBufferSource();
  // // set the buffer in the AudioBufferSourceNode
  source.buffer = out;
  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(ac.destination);
  return source;
};

// frameLooper() animates any style of graphics you wish to the audio frequency
// Looping at the default frame rate that the browser provides(approx. 60 FPS)
export const frameLooper = audioBuffer => {
  let fbc_array, bars, bar_x, bar_width, bar_height;

  const context = audioBuffer.context;

  const analyser = context.createAnalyser();
  audioBuffer.connect(analyser);
  analyser.connect(context.destination);
  const canvas = document.getElementById("analyser_render");
  const ctx = canvas.getContext("2d");
  if ("my condition to know that music playing") {
    // Establish all variables that your Analyser will use
    window.requestAnimationFrame(this.frameLooper);
    if (analyser && ctx && canvas) {
      fbc_array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(fbc_array);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      ctx.fillStyle = "#00CCFF"; // Color of the bars
      bars = 100;
      for (var i = 0; i < bars; i++) {
        bar_x = i * 3;
        bar_width = 2;
        bar_height = -(fbc_array[i] / 2);
        //  fillRect( x, y, width, height ) // Explanation of the parameters below
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
      }
    }
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    return;
  }
};
