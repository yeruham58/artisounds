import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getProfileById } from "../../actions/profileActions";

import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import ChatBar from "./ChatBar";

import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import {
  tokenUrl,
  instanceLocator,
  splitNameAndId
} from "../../config/chatConfig";

class TestChat extends Component {
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
    const chatManager = new ChatManager({
      instanceLocator,
      userId: "20",
      tokenProvider: new TokenProvider({
        url: tokenUrl
      })
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.subscribeToRoom("6a98328d-6be0-4c11-9ce4-71058575ddd9", null);
      })
      .catch(err => console.log("error on connecting: ", err));
  }

  componentWillUnmount() {
    this.currentUser.disconnect();
  }

  componentWillReceiveProps(newProp) {
    if (
      newProp.profile &&
      newProp.profile.profile &&
      newProp.profile.profile.avatar !== this.props.auth.user.avatar
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
        this.addUserToRoom(roomMember.split(splitNameAndId)[1], room.id);
        this.subscribeToRoom(room.id, roomMember);
      })
      .catch(err => console.log("error with createRoom: ", err));
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

  setCursor(roomId, position) {
    this.currentUser
      .setReadCursor({
        roomId,
        position
      })
      .then(() => {
        console.log("Success!");
      })
      .catch(err => {
        console.log(`Error setting cursor: ${err}`);
      });
  }

  onUserTyping() {
    this.currentUser
      .isTypingIn({ roomId: this.state.roomId })
      .then(() => {
        console.log("Success!");
      })
      .catch(err => {
        console.log(`Error sending typing indicator: ${err}`);
      });
  }

  subscribeToRoom(roomId, endPoint) {
    if (roomId !== this.state.roomId) {
      this.currentUser
        .subscribeToRoomMultipart({
          messageLimit: 20,
          roomId,
          hooks: {
            onMessage: message => {
              this.setState({
                messages: [...this.state.messages, message]
              });
              this.setCursor(roomId, message.id);
            },
            onUserStartedTyping: user => {
              this.setState({
                info: "Typing..."
              });
            },
            onUserStoppedTyping: user => {
              this.setState({
                info: "online"
              });
            },
            onPresenceChanged: (state, user) => {
              const info = state.current === "online" ? state.current : "";
              this.setState({
                info
              });
            }
          }
        })
        .then(room => {
          this.setState({
            roomId: room.id
          });
          this.getRooms();
        })
        .catch(err => console.log("error on subscribing to room: ", err));
    }
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
            <div className="col-md-3" />
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

TestChat.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileById }
)(TestChat);
