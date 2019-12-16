import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";

import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import isEmpty from "../../validation/isEmpty";
import { splitNameAndId } from "../../config/chatConfig";

class ProfileItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgHeight: "",
      joinProjectMsg: ""
    };
    this.onImgLoad = this.onImgLoad.bind(this);
    this.sendInvitation = this.sendInvitation.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.imgHeight) {
      this.setState({
        imgHeight: newProps.imgHeight,
        invitationMsg: ""
      });
    }
  }

  onImgLoad() {
    const img = document.getElementById("profile-img");
    if (img && img.offsetWidth) {
      this.componentWillReceiveProps({ imgHeight: img.offsetWidth });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.onImgLoad);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onImgLoad);
  }

  sendInvitation() {
    const notificationInfo = {};
    notificationInfo.project_id = this.props.instrument.project_id;
    notificationInfo.project_owner_id = this.props.logedInUserId;
    notificationInfo.project_instrument_id = this.props.instrument.id;
    notificationInfo.sender_id = this.props.logedInUserId;
    notificationInfo.sent_to_id = this.props.profile.id;
    notificationInfo.message_text = this.state.invitationMsg;
    notificationInfo.unread = true;
    notificationInfo.need_action = true;
    notificationInfo.deleted = false;
    this.props.sendNotification(notificationInfo);
  }

  render() {
    const { profile } = this.props;
    const scoreLine =
      profile.user_score > 0 ? (
        <span>
          Artist score: <strong>{profile.user_score}</strong>
        </span>
      ) : (
        <span className="form-text text-muted">
          This user still don't have a score yet
        </span>
      );

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img
              src={profile.avatar}
              alt=""
              className="rounded-circle"
              id="profile-img"
              height={this.state.imgHeight + "px"}
              onLoad={this.onImgLoad.bind(this)}
            />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h5>{profile.name}</h5>
            <p>{scoreLine}</p>
            <p>
              {isEmpty(profile.location) ? null : (
                <span>{profile.location}</span>
              )}
            </p>
            <Link
              to={`/profile/${profile.id}`}
              className="btn btn-primary mr-2 mb-2"
            >
              View profile
            </Link>
            {this.props.isAuthenticated ? (
              <Link
                to={`/chat/${profile.name + splitNameAndId + profile.id}`}
                className="btn btn-outline-success mb-2 mr-2"
              >
                Send a message
              </Link>
            ) : null}

            {(this.props.instrument && !this.props.notification) ||
            (this.props.instrument &&
              this.props.notification.sent_to_id !== profile.id) ? (
              <div>
                <Popup
                  modal
                  trigger={
                    <button
                      type="button"
                      className="btn btn-outline-primary mr-2 mb-2"
                    >
                      Invite
                    </button>
                  }
                >
                  {close => (
                    <div className="mt-3">
                      <strong>
                        You can add some message with your invitation
                      </strong>
                      <div className="mt-3" />
                      <TextAreaFieldGroup
                        placeholder="Send some message"
                        name="invitationMsg"
                        value={this.state.invitationMsg}
                        onChange={e => {
                          this.setState({ invitationMsg: e.target.value });
                        }}
                        error=""
                        info=""
                      />

                      <button
                        type="button"
                        className="btn btn-outline-primary mt-3 mb-3"
                        onClick={() => {
                          this.sendInvitation();
                          close();
                        }}
                      >
                        {this.state.invitationMsg.length > 0
                          ? "Invite"
                          : "Invite without a message"}
                      </button>
                    </div>
                  )}
                </Popup>
              </div>
            ) : null}
            {this.props.instrument &&
              this.props.notification &&
              this.props.notification.sent_to_id === profile.id && (
                <button
                  className="btn btn-outline-primary  mr-2 mb-2"
                  onClick={() => {
                    this.props.deleteNotificationsById(
                      this.props.notification.id
                    );
                  }}
                >
                  Cancel invitation
                </button>
              )}
          </div>

          <div className="col-md-4 d-none d-md-block">
            <h4>Instruments</h4>
            <ul className="list-group">
              {profile.art_practics.slice(0, 2).map((instrument, index) => (
                <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1" />
                  {instrument.art_practic_details.art_practic_name}
                </li>
              ))}
              {profile.art_practics.length > 2 ? (
                <li key={2} className="list-group-item">
                  More...
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  sendNotification: PropTypes.func.isRequired,
  deleteNotificationsById: PropTypes.func.isRequired,
  instrument: PropTypes.object,
  notification: PropTypes.object,
  logedInUserId: PropTypes.number
};

export default ProfileItem;
