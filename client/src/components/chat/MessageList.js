import React, { Component } from "react";
import ReactDOM from "react-dom";

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
            height: window.innerHeight - 200,
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
          height: window.innerHeight - 180,
          overflowY: "scroll"
        }}
        className="messagelist pb-2"
      >
        {this.props.messages.map((message, index) => {
          return (
            <div key={index} className=" mt-2 mb-2 ml-3">
              <div>
                <strong className="message-username">
                  {message.sender.name}
                </strong>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default MessageList;
