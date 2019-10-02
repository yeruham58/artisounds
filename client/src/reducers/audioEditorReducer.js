import {
  SET_IS_PLAYING,
  SET_IS_RECORDING,
  SET_AUDIO_START_TIME,
  SET_BUFFERS_LIST,
  SET_RECORDS_DIC,
  SET_AUDIO_BUFFER
} from "../actions/types";

const initialState = {
  isPlaing: false,
  isRecording: false,
  audioStartTime: 0,
  audioBuffer: null,
  buffersList: [],
  recordsDic: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.payload
      };
    case SET_IS_RECORDING:
      return {
        ...state,
        isRecording: action.payload
      };
    case SET_AUDIO_START_TIME:
      return {
        ...state,
        audioStartTime: action.payload
      };
    case SET_BUFFERS_LIST:
      return {
        ...state,
        buffersList: action.payload
      };
    case SET_RECORDS_DIC:
      return {
        ...state,
        recordsDic: action.payload
      };
    case SET_AUDIO_BUFFER:
      return {
        ...state,
        audioBuffer: action.payload
      };
    default:
      return state;
  }
}
