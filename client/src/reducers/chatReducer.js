import { CONNECT_CHAT, DISCONNECT_CHAT } from "../actions/types";

const initialState = {
  currentUser: null,
  userRooms: null,
  chatDisconnected: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CONNECT_CHAT:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        userRooms: action.payload.currentUser.rooms,
        chatDisconnected: false
      };
    case DISCONNECT_CHAT:
      return {
        ...state,
        chatDisconnected: true
      };
    default:
      return state;
  }
}
