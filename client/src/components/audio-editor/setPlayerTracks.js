import Crunker from "crunker";

export const initAudioDic = instruments => {
  const recordsDic = {};
  instruments.forEach(instrument => {
    recordsDic[instrument.id] = {};
    recordsDic[instrument.id].duration = null;
    recordsDic[instrument.id].buffer = null;
    recordsDic[instrument.id].isMute = false;
    recordsDic[instrument.id].volume = instrument.volume
      ? instrument.volume
      : 8;
    const audioUrl = instrument.record_url ? instrument.record_url : null;
    let audio = new Crunker();
    if (audioUrl) {
      audio
        .fetchAudio(audioUrl, audioUrl)
        .then(buffers => {
          recordsDic[instrument.id].duration = buffers[0].duration;
          recordsDic[instrument.id].buffer = buffers[0];
          recordsDic[instrument.id].isMute = false;
          recordsDic[instrument.id].volume = instrument.volume
            ? instrument.volume
            : 8;
        })
        .catch(() => {
          // err in Crunker create buffer
          console.log("err in Crunker create buffer");
        });
    }
  });
  return recordsDic;
};

export const initBuffersList = (recordsDic, masterVolume) => {
  const buffersList = [];
  for (var key in recordsDic) {
    if (recordsDic[key].buffer && !recordsDic[key].isMute) {
      const aCtx = new AudioContext();
      const gainNode = aCtx.createGain();
      gainNode.gain.value =
        ((masterVolume / 100) * recordsDic[key].volume) / 10;
      gainNode.connect(aCtx.destination);
      let source = aCtx.createBufferSource();

      source.buffer = recordsDic[key].buffer;
      source.connect(gainNode);

      buffersList.push(source);
    }
  }

  return buffersList;
};

export const getLongestDuration = buffersList => {
  let duration = 0;
  if (buffersList && buffersList[0]) {
    for (let buffer of buffersList) {
      if (buffer.buffer.duration > duration) duration = buffer.buffer.duration;
    }
  }

  return duration;
};
