import axios from "axios";

import {
  GET_PROJECT,
  UPDATE_PROJECT,
  CLEAR_PROJECT,
  GET_PROJECTS,
  GET_ERRORS,
  CLEAR_ERRORS,
  ADD_INSTRUMENT_TO_PROJECT,
  PROJECT_LOADING,
  DELETE_INSTRUMENT
} from "./types";

// create project
export const createProject = (projectData, history) => dispatch => {
  dispatch(setProjectLoading());
  axios
    .post("/api/projects", projectData)
    .then(res => {
      history.push(`/project/project-view/${res.data.id}`);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// // Add post with file
// export const addPostWithFile = postData => dispatch => {
//   dispatch({
//     type: ADD_POST,
//     payload: postData
//   });
// };

// Update project
export const updateProject = (projectId, projectData, history) => dispatch => {
  dispatch(setProjectLoading());
  axios
    .patch(`/api/projects/${projectId}`, projectData)
    .then(res => {
      if (window.location.href.indexOf("project-view") < 0) {
        history.push(`/project/project-view/${res.data.id}`);
      } else {
        dispatch({
          type: UPDATE_PROJECT,
          payload: res.data
        });
      }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response
      });
    });
};

// Get porojects
export const getProjects = () => dispatch => {
  dispatch(setProjectLoading());
  axios
    .get("/api/projects")
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECTS,
        payload: null
      })
    );
};

// Get user porojects
export const getUserProjects = () => dispatch => {
  dispatch(setProjectLoading());
  axios
    .get("/api/projects/user")
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECTS,
        payload: null
      })
    );
};

// // Get project
export const getProject = projectId => dispatch => {
  dispatch(setProjectLoading());
  axios
    .get(`/api/projects/${projectId}`)
    .then(res =>
      dispatch({
        type: GET_PROJECT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECT,
        payload: null
      })
    );
};

//clear project
export const clearProject = () => {
  return { type: CLEAR_PROJECT };
};

// Delete project
export const deleteProject = projectId => dispatch => {
  dispatch(setProjectLoading());
  axios
    .delete(`/api/projects/${projectId}`)
    .then(res => {
      dispatch({
        type: GET_PROJECTS,
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

// //Add and remove like
// export const addAndRemoveLike = (postId, likeData) => dispatch => {
//   axios
//     .post(`/api/posts/like/${postId}`, likeData)
//     .then()
//     .catch(err => {
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       });
//     });
// };

// //Add and remove dislike
// export const addAndRemoveDislike = (postId, dislikeData) => dispatch => {
//   axios
//     .post(`/api/posts/dislike/${postId}`, dislikeData)
//     .then()
//     .catch(err => {
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       });
//     });
// };

// // Add comment
// export const addComment = (postId, commentData) => dispatch => {
//   axios
//     .post(`/api/posts/comment/${postId}`, commentData)
//     .then(res =>
//       dispatch({
//         type: GET_POST,
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

// // Delete comment
// export const deleteComment = commentId => dispatch => {
//   axios
//     .delete(`/api/posts/comment/${commentId}`)
//     .then(res =>
//       dispatch({
//         type: GET_POST,
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

// Add instrument
export const addInstrument = (projectId, instrumentData) => dispatch => {
  axios
    .post(`/api/projects/instrument/${projectId}`, instrumentData)
    .then(res =>
      dispatch({
        type: ADD_INSTRUMENT_TO_PROJECT,
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

// Update instrument
export const updateInstrument = (
  instrumentId,
  newData,
  history
) => dispatch => {
  axios
    .patch(`/api/projects/instrument/${instrumentId}`, newData)
    .then(res => {
      if (
        window.location.href.indexOf("project-view") < 0 &&
        window.location.href.indexOf("work-zone") < 0
      ) {
        history.push(`/project/project-view/${res.data.id}`);
      } else {
        dispatch({
          type: GET_PROJECT,
          payload: res.data
        });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
};

// Delete instrument
export const deleteInstrument = instrumentId => dispatch => {
  axios
    .delete(`/api/projects/instrument/${instrumentId}`)
    .then(res =>
      dispatch({
        type: DELETE_INSTRUMENT,
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

//Project loading state
export const setProjectLoading = () => {
  return {
    type: PROJECT_LOADING
  };
};

//Clear errors
export const clearErrors = errToClear => {
  return {
    type: CLEAR_ERRORS,
    payload: errToClear
  };
};
