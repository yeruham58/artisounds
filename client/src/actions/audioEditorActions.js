// import axios from "axios";

import {
  SET_BUFFERS_LIST,
  SET_RECORDS_DIC,
  SET_AUDIO_BUFFER,
  SET_IS_PLAYING,
  SET_IS_RECORDING,
  SET_AUDIO_START_TIME
} from "./types";

export const setBuffersList = buffersList => dispatch => {
  dispatch({ type: SET_BUFFERS_LIST, payload: buffersList });
};
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
