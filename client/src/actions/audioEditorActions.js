import axios from "axios";

import {
  SET_RECORDS_DIC,
  SET_IS_PLAYING,
  SET_IS_RECORDING,
  SET_AUDIO_START_TIME,
  SET_PX_PER_BIT,
  SET_SECONDS_PER_BIT,
  SET_SECONDS_PER_PX,
  SET_CURRENT_RECORD_BOLB,
  GET_ERRORS,
  ADD_RECORD,
  SAVING_RECORD,
  CLEAR_RECORD,
  SET_MASTER_VOLUME,
  SET_NUM_OF_BITS,
  SET_CURRENT_RECORD_ID,
  SET_BUFFERS_LIST,
  SET_PLAYING_NOW_LIST,
  CLEAR_EDITOR
} from "./types";

//clear editor
export const clearEditor = () => {
  return { type: CLEAR_EDITOR };
};

export const setCurretRecordId = recordsId => dispatch => {
  dispatch({ type: SET_CURRENT_RECORD_ID, payload: recordsId });
};
export const setRecordsDic = recordsDic => dispatch => {
  dispatch({ type: SET_RECORDS_DIC, payload: recordsDic });
};

export const setBuffersList = buffersList => dispatch => {
  dispatch({ type: SET_BUFFERS_LIST, payload: buffersList });
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
export const setCurrentBolb = currentBolb => dispatch => {
  dispatch({ type: SET_CURRENT_RECORD_BOLB, payload: currentBolb });
};
export const clearRecord = clearRecord => dispatch => {
  dispatch({ type: CLEAR_RECORD, payload: clearRecord });
};
export const setMasterVolume = masterVolume => dispatch => {
  dispatch({ type: SET_MASTER_VOLUME, payload: masterVolume });
};
export const setNumOfBits = numOfBits => dispatch => {
  dispatch({ type: SET_NUM_OF_BITS, payload: numOfBits });
};
export const setPlayingNowList = playingNowList => dispatch => {
  dispatch({ type: SET_PLAYING_NOW_LIST, payload: playingNowList });
};

//Upload record
export const uploadRecord = (data, instrumentId) => dispatch => {
  dispatch({
    type: SAVING_RECORD
  });
  axios
    .post(`/api/records/record-upload/${instrumentId}`, data, {
      headers: {
        accept: "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`
      }
    })
    .then(response => {
      if (200 === response.status) {
        // If file size is larger than expected.
        if (response.data.error) {
          dispatch({
            type: GET_ERRORS,
            payload: { uploadErrors: response.data.error }
          });
        } else {
          // Success
          dispatch({
            type: ADD_RECORD
          });
        }
      }
    })
    .catch(error => {
      dispatch({
        type: GET_ERRORS,
        payload: { uploadErrors: error }
      });
    });
};

//Delete record
export const deleteRecord = (data, instrumentId) => dispatch => {
  dispatch({
    type: SAVING_RECORD
  });
  axios
    .delete(`/api/records/record-upload/${instrumentId}`, {
      headers: {
        data
      }
    })
    .then(response => {
      if (200 === response.status) {
        dispatch({
          type: ADD_RECORD
        });
      }
    })
    .catch(error => {
      dispatch({
        type: GET_ERRORS,
        payload: { deleteErrors: error }
      });
    });
};
