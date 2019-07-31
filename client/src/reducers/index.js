import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import postReducer from "./postReducer";
import uploadFileReducer from "./uploadFileReducer";
import chatReducer from "./chatReducer";
import projectReducer from "./projectReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  post: postReducer,
  upload: uploadFileReducer,
  chat: chatReducer,
  project: projectReducer
});
