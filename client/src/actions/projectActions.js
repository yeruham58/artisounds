import axios from "axios";

import { CREATE_PROJECT, GET_ERRORS, CLEAR_ERRORS } from "./types";

// create project
export const createProject = projectData => dispatch => {
  axios
    .post("/api/projects", projectData)
    .then(res =>
      dispatch({
        type: CREATE_PROJECT,
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

// // Add post with file
// export const addPostWithFile = postData => dispatch => {
//   dispatch({
//     type: ADD_POST,
//     payload: postData
//   });
// };

// // Get posts
// export const getPosts = () => dispatch => {
//   dispatch(setPostLoading());
//   axios
//     .get("/api/posts")
//     .then(res =>
//       dispatch({
//         type: GET_POSTS,
//         payload: res.data
//       })
//     )
//     .catch(err =>
//       dispatch({
//         type: GET_POSTS,
//         payload: null
//       })
//     );
// };

// // Get post
// export const getPost = postId => dispatch => {
//   dispatch(setPostLoading());
//   axios
//     .get(`/api/posts/${postId}`)
//     .then(res =>
//       dispatch({
//         type: GET_POST,
//         payload: res.data
//       })
//     )
//     .catch(err =>
//       dispatch({
//         type: GET_POST,
//         payload: null
//       })
//     );
// };

// // Delete post
// export const deletePost = postId => dispatch => {
//   axios
//     .delete(`/api/posts/${postId}`)
//     .then(res =>
//       dispatch({
//         type: DELETE_POST,
//         payload: postId
//       })
//     )
//     .catch(err => {
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       });
//     });
// };

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

// //Post loading state
// export const setPostLoading = () => {
//   return {
//     type: POST_LOADING
//   };
// };

//Clear errors
export const clearErrors = errToClear => {
  return {
    type: CLEAR_ERRORS,
    payload: errToClear
  };
};
