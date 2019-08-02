import {
  CREATE_PROJECT,
  GET_PROJECTS,
  GET_PROJECT,
  ADD_INSTRUMENT_TO_PROJECT
} from "../actions/types";

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
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload
      };
    case GET_PROJECT:
      return {
        ...state,
        project: action.payload
      };
    case ADD_INSTRUMENT_TO_PROJECT:
      return {
        ...state,
        project: action.payload
      };
    default:
      return state;
  }
}
