import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import { tokenUrl, instanceLocator } from "../config/chatConfig";
import { CONNECT_CHAT, DISCONNECT_CHAT } from "./types";

//Connect user to chat
export const connectUserToChat = data => dispatch => {
  const chatManager = new ChatManager({
    instanceLocator,
    userId: data.userId,
    tokenProvider: new TokenProvider({
      url: tokenUrl
    })
  });

  chatManager
    .connect()
    .then(currentUser => {
      dispatch({
        type: CONNECT_CHAT,
        payload: { currentUser }
      });
    })
    .catch(err => console.log("error on connecting: ", err));
};

// Update about disconnect chat
export const updateDisconnectChat = () => dispatch => {
  dispatch({
    type: DISCONNECT_CHAT
  });
};
