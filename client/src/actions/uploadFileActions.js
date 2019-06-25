import axios from "axios";

import { GET_ERRORS, CLEAR_ERRORS, ADD_FILE, FILE_UPLOADING } from "./types";

//Upload img
export const singleFileUpload = data => dispatch => {
  dispatch(setFileUploading());
  axios
    .post("/api/upload/profile-img-upload", data, {
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
          let file = response.data;
          dispatch({
            type: ADD_FILE,
            payload: file.location
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

//Post loading state
export const setFileUploading = () => {
  return {
    type: FILE_UPLOADING
  };
};

//Clear errors
export const clearErrors = errToClear => {
  return {
    type: CLEAR_ERRORS,
    payload: errToClear
  };
};
