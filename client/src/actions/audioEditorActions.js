import axios from "axios";

import {
  SET_RECORDS_DIC,
  SET_AUDIO_BUFFER,
  SET_IS_PLAYING,
  SET_IS_RECORDING,
  SET_AUDIO_START_TIME,
  SET_PX_PER_BIT,
  SET_SECONDS_PER_BIT,
  SET_SECONDS_PER_PX,
  SET_CURRENT_RECORD_BOLB,
  GET_ERRORS,
  ADD_RECORD
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
export const setCurrentBolb = currentBolb => dispatch => {
  dispatch({ type: SET_CURRENT_RECORD_BOLB, payload: currentBolb });
};

//Upload record
export const uploadRecord = (data, instrumentId) => dispatch => {
  // dispatch(setFileUploading());
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
          if ("LIMIT_FILE_SIZE" === response.data.error.code) {
            // this.setUploadImgErr("Max size: 2MB");
            dispatch({
              type: GET_ERRORS,
              payload: { uploadErrors: "Max size: 2MB" }
            });
          } else {
            // If not the given file type
            dispatch({
              type: GET_ERRORS,
              payload: { uploadErrors: response.data.error }
            });
          }
        } else {
          // Success
          dispatch({
            type: ADD_RECORD,
            payload: response.data
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
  // dispatch(setFileUploading());
  axios
    .delete(`/api/records/record-upload/${instrumentId}`, {
      headers: {
        data
      }
    })
    .then(response => {
      if (200 === response.status) {
        console.log("deleted");
      }
    })
    .catch(error => {
      dispatch({
        type: GET_ERRORS,
        payload: { deleteErrors: error }
      });
    });
};
