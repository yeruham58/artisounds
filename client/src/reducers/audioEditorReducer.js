import {
  SET_IS_PLAYING,
  SET_IS_RECORDING,
  SET_AUDIO_START_TIME,
  SET_RECORDS_DIC,
  SET_PX_PER_BIT,
  SET_SECONDS_PER_BIT,
  SET_SECONDS_PER_PX,
  SET_CURRENT_RECORD_BOLB,
  ADD_RECORD,
  SAVING_RECORD,
  CLEAR_RECORD,
  SET_MASTER_VOLUME,
  SET_NUM_OF_BITS,
  SET_CURRENT_RECORD_ID,
  SET_BUFFERS_LIST,
  SET_PLAYING_NOW_LIST
} from "../actions/types";

const initialState = {
  currentRecordId: null,
  isPlaing: false,
  isRecording: false,
  audioStartTime: 0,
  allowChangeTime: false,
  buffersList: {},
  playerRecordsDic: {},
  playingNowList: null,
  recordsDic: {},
  pxPerBit: 0,
  secondsPerBit: 0,
  secondsPerPx: 0.0001,
  courrentRecordBolb: null,
  saving: false,
  clearRecord: false,
  masterVolume: 80,
  numOfBits: 50,
  spacing: 60
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
        audioStartTime: action.payload.audioStartTime,
        allowChangeTime: action.payload.allowChangeTime
      };

    case SET_RECORDS_DIC:
      return {
        ...state,
        recordsDic: action.payload
      };
    case SET_BUFFERS_LIST:
      return {
        ...state,
        buffersList: action.payload
      };
    case SET_PX_PER_BIT:
      return {
        ...state,
        pxPerBit: action.payload
      };
    case SET_SECONDS_PER_BIT:
      return {
        ...state,
        secondsPerBit: action.payload
      };
    case SET_SECONDS_PER_PX:
      return {
        ...state,
        secondsPerPx: action.payload
      };
    case SET_CURRENT_RECORD_BOLB:
      return {
        ...state,
        courrentRecordBolb: action.payload
      };
    case ADD_RECORD:
      return {
        ...state,
        saving: false
      };
    case SAVING_RECORD:
      return {
        ...state,
        saving: true
      };
    case CLEAR_RECORD:
      return {
        ...state,
        clearRecord: action.payload
      };
    case SET_MASTER_VOLUME:
      return {
        ...state,
        masterVolume: action.payload
      };
    case SET_NUM_OF_BITS:
      return {
        ...state,
        numOfBits: action.payload
      };
    case SET_CURRENT_RECORD_ID:
      return {
        ...state,
        currentRecordId: action.payload
      };
    case SET_PLAYING_NOW_LIST:
      return {
        ...state,
        playingNowList: action.payload
      };

    default:
      return state;
  }
}
