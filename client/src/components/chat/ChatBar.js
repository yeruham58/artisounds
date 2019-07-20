import React, { Component } from "react";
import { Link } from "react-router-dom";

import OnlineIcon from "../../img/greenOnline.png";

export default class ChatBar extends Component {
  render() {
    const { room, memberName, memberId } = this.props;
    return (
      <div className="container">
        <div className="chatBar mb-2 row">
          <Link to={`/profile/${memberId}`} className="col-1">
            <img
              className="rounded-circle mr-1 mt-2 mb-2 ml-2"
              src={
                room.customData.imgUrls.find(
                  nemeAndUrl => Object.keys(nemeAndUrl).indexOf(memberName) > -1
                )[memberName]
              }
              alt=""
              style={{
                width: "40px",
                height: "40px"
              }}
            />
          </Link>
          <div className="ml-3 mr-6 mt-3 col-4">
            <strong>{memberName}</strong>
          </div>
          <div className="col-3" />
          <div className="ml-3 mr-6 mt-3 col-3">
            {this.props.info === "online" ? (
              <img
                style={{ height: "8px", width: "8px" }}
                src={OnlineIcon}
                alt=""
              />
            ) : null}
            <span className="ml-2">{this.props.info}</span>
          </div>
        </div>
      </div>
    );
  }
}
