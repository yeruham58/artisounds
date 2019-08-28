import { SEND_NOTIFICATION, GET_NOTIFICATIONS } from "../actions/types";

const initialState = {
  notifications: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SEND_NOTIFICATION:
      return {
        ...state,
        notifications: action.payload.reverse()
      };
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.reverse(),
        loading: false
      };
    default:
      return state;
  }
}
