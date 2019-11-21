import {
  PROJECT_LOADING,
  GET_PROJECTS,
  GET_PROJECT,
  UPDATE_PROJECT,
  CLEAR_PROJECT,
  DELETE_PROJECT,
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
    case CLEAR_PROJECT:
      return {
        ...state,
        project: null,
        projects: null
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload.reverse(),
        loading: false
      };
    case GET_PROJECT:
      return {
        ...state,
        project: action.payload,
        loading: false
      };
    case UPDATE_PROJECT:
      return {
        ...state,
        project: action.payload,
        loading: false
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: action.payload,
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
