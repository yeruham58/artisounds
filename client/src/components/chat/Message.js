import React, { Component } from "react";

class Message extends Component {
  constructor() {
    super();
    this.state = {
      messageWidth: null
    };
  }

  componentDidMount() {
    const textWidth = document.getElementById(this.props.message.id)
      .offsetWidth;
    const nameWidth = document.getElementById(this.props.message.id + "name")
      .offsetWidth;
    const messageWidth =
      textWidth > nameWidth + 20 ? textWidth : nameWidth + 20;

    this.setState({
      messageWidth: messageWidth
    });
  }
  render() {
    const message = this.props.message;
    const senderMessageContainer =
      this.props.user.name === message.sender.name
        ? "mr-3 senderMessageContainer"
        : null;
    const senderMessageBody =
      this.props.user.name === message.sender.name
        ? "mr-3 senderMessageBody"
        : null;
    const senderMessageText =
      this.props.user.name === message.sender.name
        ? "senderMessage-text"
        : null;
    return (
      <div className={`message mt-2 mb-2 ml-3 ${senderMessageContainer}`}>
        <div
          style={{ width: this.state.messageWidth }}
          className={`message-body ${senderMessageBody}`}
        >
          <div>
            <strong
              id={this.props.message.id + "name"}
              className="message-username ml-2"
            >
              {message.sender.name}
            </strong>
          </div>
          <span
            id={message.id}
            className={`${senderMessageText} message-text mb-2`}
          >
            {/* {message.text} */}
            {message.parts[0].payload.content}
          </span>
        </div>
      </div>
    );
  }
}

export default Message;
