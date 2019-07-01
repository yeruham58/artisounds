import { ADD_FILE, FILE_UPLOADING } from "../actions/types";

const initialState = {
  loading: false,
  fileUrl: null,
  uploadRes: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FILE_UPLOADING:
      return {
        ...state,
        loading: true
      };

    case ADD_FILE:
      return {
        ...state,
        uploadRes: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
