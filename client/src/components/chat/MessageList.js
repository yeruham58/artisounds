import React, { Component } from "react";
import ReactDOM from "react-dom";

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

    return (
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
    );
  }
}

export default MessageList;
