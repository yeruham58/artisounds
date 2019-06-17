import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  CLEAR_ERRORS,
  SET_CURRENT_USER,
  GET_PROFILES
} from "./types";

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/art-types")
    .then(artTypes => {
      axios
        .get("/api/profile")
        .then(res => {
          res.data.allArtTypes = artTypes.data;
          dispatch({ type: GET_PROFILE, payload: res.data });
        })
        .catch(err => {
          dispatch({ type: GET_PROFILE, payload: {} });
        });
    })
    .catch(err => console.log(err));
};

// Get profile by id
export const getProfileById = userId => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/${userId}`)
    .then(res => {
      dispatch({ type: GET_PROFILE, payload: res.data });
    })
    .catch(err => {
      dispatch({ type: GET_PROFILE, payload: null });
    });
};

//Create profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => {
      history.push("dashboard");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get profiles list
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/all")
    .then(profiles => {
      dispatch({ type: GET_PROFILES, payload: profiles.data });
    })
    .catch(err => dispatch({ type: GET_PROFILES, payload: null }));
};

// Delete account & profile
export const deleteAccount = () => dispatch => {
  window.confirm("Are you sure? This can NOT be undone!");
  axios
    .delete("api/profile")
    .then(res =>
      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear current profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

//Clear errors
export const clearErrors = errToClear => {
  return {
    type: CLEAR_ERRORS,
    payload: errToClear
  };
};
