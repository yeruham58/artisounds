import React, { Component } from "react";
import ReactDOM from "react-dom";

// import { splitNameAndId } from "../../config/chatConfig";
import Message from "./Message";

class MessageList extends Component {
  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this);
    this.shouldScrollToBottom =
      node.scrollTop + node.clientHeight + 100 >= node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollToBottom) {
      const node = ReactDOM.findDOMNode(this);
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    // let room;
    // let memberName;
    // let memberId;
    if (!this.props.roomId) {
      return (
        <div
          className="messagelist"
          style={{
            height: window.innerHeight,
            overflowY: "scroll"
          }}
        >
          <div className="join-room">&larr; Select a friend to chat with!</div>
        </div>
      );
    }
    // else {
    //   room = this.props.rooms.find(room => room.id === this.props.roomId);
    //   memberName = room.name
    //     .split(":")
    //     .find(name => name.indexOf(this.props.user.name + splitNameAndId) < 0)
    //     .split(splitNameAndId)[0];
    //   memberId = room.name
    //     .split(":")
    //     .find(name => name.indexOf(this.props.user.name + splitNameAndId) < 0)
    //     .split(splitNameAndId)[1];
    // }

    return (
      // <div>
      //   <ChatBar room={room} memberName={memberName} memberId={memberId} />
      <div
        style={{
          height: window.innerHeight - 250,
          overflowY: "scroll"
        }}
        className="messagelist pb-2"
      >
        {this.props.messages.map((message, index) => {
          return (
            <Message key={index} message={message} user={this.props.user} />
          );
        })}
      </div>
      // </div>
    );
  }
}

export default MessageList;
