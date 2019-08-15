import axios from "axios";

import { SEND_NOTIFICATION, GET_NOTIFICATIONS, GET_ERRORS } from "./types";

// Send notification
export const sendNotification = notificationData => dispatch => {
  axios
    .post(`/api/projectNotifications`, notificationData)
    .then(res =>
      dispatch({
        type: SEND_NOTIFICATION,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Get notifications
export const getNotificationsByUserId = () => dispatch => {
  // dispatch(setPostLoading());
  axios
    .get(`/api/projectNotifications`)
    .then(res =>
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: null
      })
    );
};

// Delete notifications

//Delete by instrument id
export const deleteNotificationsByInstrumentId = instrumentId => dispatch => {
  axios
    .delete(`/api/projectNotifications/instrumentId/${instrumentId}`)
    .then(res =>
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response
      });
    });
};

//Delete by project id
export const deleteNotificationsByProjectId = projectId => dispatch => {
  axios
    .delete(`/api/projectNotifications/projectId/${projectId}`)
    .then(res => {
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response
      });
    });
};

//Delete by notification id
export const deleteNotificationsById = notificationId => dispatch => {
  axios
    .delete(`/api/projectNotifications/${notificationId}`)
    .then(res => {
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response
      });
    });
};
