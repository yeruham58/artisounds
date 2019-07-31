import { CREATE_PROJECT } from "../actions/types";

const initialState = {
  project: null,
  projects: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_PROJECT:
      return {
        ...state,
        project: action.payload
      };
    default:
      return state;
  }
}
