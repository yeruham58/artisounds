import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getProfileById } from "../../actions/profileActions";

import RoomList from "./RoomList";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";

import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import {
  tokenUrl,
  instanceLocator,
  splitNameAndId
} from "../../config/chatConfig";

class ChatPage extends Component {
  constructor() {
    super();
    this.state = {
      roomId: null,
      messages: [],
      joinedRooms: [],
      roomMember: "",
      memberProfileUrl: ""
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.checkIfRoomCreated = this.checkIfRoomCreated.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.addUserToRoom = this.addUserToRoom.bind(this);
  }

  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator,
      userId: this.props.auth.user.id.toString(),
      tokenProvider: new TokenProvider({
        url: tokenUrl
      })
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.getRooms();
        if (this.props.match.params.nameAndId) {
          this.checkIfRoomCreated(this.props.match.params.nameAndId);
        }
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

  subscribeToRoom(roomId, endPoint) {
    if (roomId !== this.state.roomId) {
      this.setState({
        messages: []
      });

      window.history.pushState(null, "", `/chat/${endPoint}`);

      this.currentUser
        .subscribeToRoom({
          messageLimit: 20,
          roomId,
          hooks: {
            onMessage: message => {
              this.setState({
                messages: [...this.state.messages, message]
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
              <MessageList
                roomId={this.state.roomId}
                messages={this.state.messages}
              />
              {this.state.roomId ? (
                <MessageForm sendMessage={this.sendMessage} />
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
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileById }
)(ChatPage);
