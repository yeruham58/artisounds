import {
  PROJECT_LOADING,
  CREATE_PROJECT,
  GET_PROJECTS,
  GET_PROJECT,
  ADD_INSTRUMENT_TO_PROJECT,
  UPDATE_INSTRUMENT,
  DELETE_INSTRUMENT
} from "../actions/types";

const initialState = {
  project: null,
  projects: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROJECT_LOADING:
      return {
        ...state,
        loading: true
      };
    case CREATE_PROJECT:
      return {
        ...state,
        project: action.payload
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        loading: false
      };
    case GET_PROJECT:
      return {
        ...state,
        project: action.payload,
        loading: false
      };
    case ADD_INSTRUMENT_TO_PROJECT:
      return {
        ...state,
        project: action.payload
      };
    case UPDATE_INSTRUMENT:
      return {
        ...state,
        project: action.payload
      };
    case DELETE_INSTRUMENT:
      return {
        ...state,
        project: action.payload
      };
    default:
      return state;
  }
}
