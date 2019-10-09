// import axios from "axios";

import {
  SET_RECORDS_DIC,
  SET_AUDIO_BUFFER,
  SET_IS_PLAYING,
  SET_IS_RECORDING,
  SET_AUDIO_START_TIME,
  SET_PX_PER_BIT,
  SET_SECONDS_PER_BIT,
  SET_SECONDS_PER_PX
} from "./types";

export const setRecordsDic = recordsDic => dispatch => {
  dispatch({ type: SET_RECORDS_DIC, payload: recordsDic });
};
export const setAudioBuffer = audioBuffer => dispatch => {
  dispatch({ type: SET_AUDIO_BUFFER, payload: audioBuffer });
};
export const setIsPlaying = isPlaying => dispatch => {
  dispatch({ type: SET_IS_PLAYING, payload: isPlaying });
};
export const setIsRecording = isRecording => dispatch => {
  dispatch({ type: SET_IS_RECORDING, payload: isRecording });
};

export const setAudioStartTime = startTime => dispatch => {
  dispatch({ type: SET_AUDIO_START_TIME, payload: startTime });
};
export const setPxPerBit = pxPerBit => dispatch => {
  dispatch({ type: SET_PX_PER_BIT, payload: pxPerBit });
};
export const setSecondsPerBit = secondsPerBit => dispatch => {
  dispatch({ type: SET_SECONDS_PER_BIT, payload: secondsPerBit });
};
export const setSecondsPerPx = secondsPerPx => dispatch => {
  dispatch({ type: SET_SECONDS_PER_PX, payload: secondsPerPx });
};
