import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  connectUserToChat,
  updateDisconnectChat
} from "../../actions/chatActions";
import { getProfileById } from "../../actions/profileActions";

import RoomList from "./RoomList";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import ChatBar from "./ChatBar";

import { splitNameAndId } from "../../config/chatConfig";

class ChatPage extends Component {
  constructor() {
    super();
    this.state = {
      roomId: null,
      messages: [],
      joinedRooms: [],
      roomMember: "",
      memberProfileUrl: "",
      info: ""
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.setCursor = this.setCursor.bind(this);
    this.onUserTyping = this.onUserTyping.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.checkIfRoomCreated = this.checkIfRoomCreated.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.addUserToRoom = this.addUserToRoom.bind(this);
  }

  componentDidMount() {
    this.props.connectUserToChat({
      userId: this.props.auth.user.id.toString()
    });
  }

  componentWillUnmount() {
    try {
      this.currentUser.disconnect();
    } catch {
      console.log("chat is not connected");
    }

    this.props.updateDisconnectChat();
  }

  componentWillReceiveProps(newProp) {
    if (newProp.chat && this.state.roomMember === "") {
      this.currentUser = newProp.chat.currentUser;
      if (this.currentUser) {
        this.getRooms();
        if (this.props.match.params.nameAndId) {
          this.checkIfRoomCreated(this.props.match.params.nameAndId);
        }
      }
    }
    if (
      newProp.profile &&
      newProp.profile.profile &&
      // newProp.profile.profile.avatar !== this.props.auth.user.avatar
      newProp.profile.profile.id &&
      newProp.profile.profile.id !== this.props.auth.user.id
    ) {
      this.createRoom(newProp.profile.profile.avatar);
    }
  }

  checkIfRoomCreated(roomMember) {
    const room = this.currentUser.rooms.find(
      room => room.name.indexOf(roomMember) > -1
    );
    if (room) {
      this.subscribeToRoom(room.id, roomMember);
    } else {
      this.setState({ roomMember });
      this.props.getProfileById(roomMember.split(splitNameAndId)[1]);
    }
  }

  createRoom(imgUrl) {
    const roomMember = this.state.roomMember;
    const customData = {
      imgUrls: [
        { [roomMember.split(splitNameAndId)[0]]: imgUrl },
        { [this.props.auth.user.name]: this.props.auth.user.avatar }
      ]
    };
    if (roomMember) {
      this.currentUser
        .createRoom({
          name:
            roomMember +
            ":" +
            this.props.auth.user.name +
            splitNameAndId +
            this.props.auth.user.id,
          customData
        })
        .then(room => {
          this.getRooms();
          this.addUserToRoom(roomMember.split(splitNameAndId)[1], room.id);
          this.subscribeToRoom(room.id, roomMember);
        })
        .catch(err => console.log("error with createRoom: ", err));
    }
  }

  addUserToRoom(userId, roomId) {
    this.currentUser
      .addUserToRoom({
        userId,
        roomId
      })
      .then(() => {
        console.log(`Added ${userId} to room ${roomId}`);
      })
      .catch(err => {
        console.log(`Error adding ${userId} to room ${roomId}: ${err}`);
      });
  }

  getRooms() {
    this.setState({
      joinedRooms: this.currentUser.rooms
    });
  }

  subscribeToRoom(roomId, endPoint) {
    if (roomId !== this.state.roomId) {
      this.setState({
        messages: [],
        roomId
      });

      window.history.pushState(null, "", `/chat/${endPoint}`);

      this.currentUser
        .subscribeToRoomMultipart({
          messageLimit: 100,
          roomId,
          hooks: {
            onMessage: message => {
              if (this.state.roomId.toString() === message.roomId.toString()) {
                this.setState({
                  messages: [...this.state.messages, message]
                });
                const cursor = this.currentUser.readCursor({
                  roomId
                });
                if (
                  (cursor && message.id > cursor.position) ||
                  (message.id && !cursor)
                ) {
                  this.setCursor(roomId, message.id);
                }
              }
            },
            onUserStartedTyping: user => {
              if (
                this.currentUser.rooms
                  .find(room => room.id === this.state.roomId)
                  .userIds.indexOf(user.id.toString()) > -1
              ) {
                this.setState({
                  info: "Typing..."
                });
              }
            },
            onUserStoppedTyping: user => {
              if (
                this.currentUser.rooms
                  .find(room => room.id === this.state.roomId)
                  .userIds.indexOf(user.id.toString()) > -1
              ) {
                this.setState({
                  info: "online"
                });
              }
            },
            onPresenceChanged: (state, user) => {
              if (
                this.currentUser.rooms
                  .find(room => room.id === this.state.roomId)
                  .userIds.indexOf(user.id.toString()) > -1
              ) {
                const info = state.current === "online" ? state.current : "";
                this.setState({
                  info
                });
              }
            }
          }
        })
        .then(room => {
          // const info =
          //   room.userStore.presenceStore[endPoint.split(splitNameAndId)[1]] ===
          //   "online"
          //     ? "online"
          //     : "";
          // this.setState({
          //   info
          // });
          this.getRooms();
        })
        .catch(err => console.log("error on subscribing to room: ", err));
    }
  }

  setCursor(roomId, position) {
    this.currentUser
      .setReadCursor({
        roomId,
        position
      })
      .then(() => {})
      .catch(err => {
        console.log(`Error setting cursor: ${err}`);
      });
  }

  onUserTyping() {
    this.currentUser
      .isTypingIn({ roomId: this.state.roomId })
      .then(() => {})
      .catch(err => {
        console.log(`Error sending typing indicator: ${err}`);
      });
  }

  sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    });
  }

  render() {
    let room;
    let memberName;
    let memberId;

    if (this.state.joinedRooms[0] && this.state.roomId) {
      room = this.state.joinedRooms.find(room => room.id === this.state.roomId);
      memberName = room.name
        .split(":")
        .find(
          name => name.indexOf(this.props.auth.user.name + splitNameAndId) < 0
        )
        .split(splitNameAndId)[0];

      memberId = room.name
        .split(":")
        .find(
          name => name.indexOf(this.props.auth.user.name + splitNameAndId) < 0
        )
        .split(splitNameAndId)[1];
    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              {this.state.joinedRooms[0] ? (
                <RoomList
                  user={this.props.auth.user}
                  roomId={this.state.roomId}
                  subscribeToRoom={this.subscribeToRoom}
                  setUrlToRoom={this.setUrlToRoom}
                  rooms={this.state.joinedRooms}
                />
              ) : null}
            </div>
            <div className="col-md-9 pl-0">
              {room && (
                <ChatBar
                  info={this.state.info}
                  room={room}
                  memberName={memberName}
                  memberId={memberId}
                />
              )}
              <MessageList
                user={this.props.auth.user}
                roomId={this.state.roomId}
                messages={this.state.messages}
                rooms={this.state.joinedRooms}
              />
              {this.state.roomId ? (
                <MessageForm
                  onUserTyping={this.onUserTyping}
                  sendMessage={this.sendMessage}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ChatPage.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  updateDisconnectChat: PropTypes.func.isRequired,
  connectUserToChat: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  chat: state.chat
});

export default connect(
  mapStateToProps,
  { getProfileById, connectUserToChat, updateDisconnectChat }
)(ChatPage);
