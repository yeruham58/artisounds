import React, { Component } from "react";

import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
// import TextFieldGroup from "../common/TextFieldGroup";

class MessageForm extends Component {
  constructor() {
    super();
    this.state = {
      text: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.props.onUserTyping();
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.sendMessage(this.state.text);
    this.setState({
      text: ""
    });
  }

  render() {
    return (
      <form noValidate onSubmit={this.onSubmit}>
        <div className="container">
          <div
            className="row"
            style={{
              backgroundColor: "WhiteSmoke"
            }}
          >
            <div className="col-1">
              <button
                onClick={this.onSubmit}
                type="submit"
                className="btn btn-light"
              >
                <i className="fas fa-arrow-circle-left" />
              </button>
            </div>
            <div className="col-11">
              <TextAreaFieldGroup
                type="text"
                placeholder="Your message "
                name="text"
                value={this.state.text}
                onChange={this.onChange}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default MessageForm;
