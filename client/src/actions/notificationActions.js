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

// // Update instrument
// export const updateInstrument = (instrumentId, newData) => dispatch => {
//   axios
//     .patch(`/api/projects/instrument/${instrumentId}`, newData)
//     .then(res =>
//       dispatch({
//         type: UPDATE_INSTRUMENT,
//         payload: res.data
//       })
//     )
//     .catch(err => {
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       });
//     });
// };

// // Delete instrument
// export const deleteInstrument = instrumentId => dispatch => {
//   axios
//     .delete(`/api/projects/instrument/${instrumentId}`)
//     .then(res =>
//       dispatch({
//         type: DELETE_INSTRUMENT,
//         payload: res.data
//       })
//     )
//     .catch(err => {
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       });
//     });
// };
