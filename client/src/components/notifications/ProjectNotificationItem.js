import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { splitNameAndId } from "../../config/chatConfig";
import { updateInstrument } from "../../actions/projectActions";
import {
  deleteNotificationsByInstrumentId,
  updateNotification
} from "../../actions/notificationActions";

class ProjectNotificationItem extends Component {
  constructor(props) {
    super(props);

    this.onAccept = this.onAccept.bind(this);
  }

  onAccept() {
    this.props.updateInstrument(
      this.props.notification.project_instrument_id,
      {
        user_id:
          this.props.notification.project_owner_id === this.props.auth.user.id
            ? this.props.notification.sender_id
            : this.props.auth.user.id
      },
      this.props.history
    );
    this.props.deleteNotificationsByInstrumentId(
      this.props.notification.project_instrument_id
    );
  }

  render() {
    const { notification } = this.props;
    const projectName = notification.project_id
      ? notification.project.name
      : null;
    const projectLink = (
      <Link to={`/project/project-view/${notification.project_id}`}>
        <strong style={{ color: "black" }}>{projectName} </strong>
      </Link>
    );
    const senderName = notification.sender_id
      ? notification.sender_detailes.name
      : null;

    const senderLink = (
      <Link to={`/profile/${notification.sender_id}`}>
        <strong style={{ color: "black" }}>{senderName} </strong>
      </Link>
    );
    const sendToName = notification.send_to_detailes.name;
    const sendToLink = (
      <Link to={`/profile/${notification.sent_to_id}`}>
        <strong style={{ color: "black" }}>{sendToName} </strong>
      </Link>
    );

    const acceptButton = (
      <button
        type="button"
        className="btn btn-outline-primary mt-2 ml-3"
        value="Accept"
        onClick={this.onAccept}
      >
        Accept
      </button>
    );
    const sendMessageButton = (
      <Link
        to={`/chat/${senderName + splitNameAndId + notification.sender_id}`}
        className="btn btn-outline-success mt-2 ml-3"
      >
        Send a message
      </Link>
    );

    const instrumentName = (
      <strong>
        {
          notification.project.instruments.find(
            instrument => instrument.id === notification.project_instrument_id
          ).instrument_detailes.art_practic_name
        }
      </strong>
    );

    let msgContant;
    if (
      notification.project_owner_id &&
      notification.project_owner_id === this.props.auth.user.id
    ) {
      if (
        notification.sender_id &&
        this.props.auth.user.id === notification.sender_id
      ) {
        msgContant = (
          <div className="ml-3">
            You have sent an invitation to {sendToLink}, to play{" "}
            {instrumentName} in your project {projectLink}
          </div>
        );
      }

      if (
        notification.sender_id &&
        this.props.auth.user.id !== notification.sender_id
      ) {
        msgContant = (
          <div>
            <div className="ml-3">
              {senderLink}
              want to play {instrumentName} in your {projectLink} project
            </div>
            <span>{acceptButton}</span>
            <span>{sendMessageButton}</span>
          </div>
        );
      }
    }
    if (
      notification.project_owner_id &&
      notification.project_owner_id !== this.props.auth.user.id
    ) {
      if (
        notification.sender_id &&
        this.props.auth.user.id === notification.sender_id
      ) {
        msgContant = (
          <div className="ml-3">
            You asked {sendToLink}
            to play {instrumentName} in {projectLink} project
          </div>
        );
      }
      if (
        notification.sender_id &&
        this.props.auth.user.id !== notification.sender_id
      ) {
        msgContant = (
          <div>
            <div className="ml-3">
              {senderLink}
              asked you to play {instrumentName} in {projectLink} project
            </div>
            <span>{acceptButton}</span>
            <span>{sendMessageButton}</span>
          </div>
        );
      }
    }

    return (
      <div
        className="card card-body mb-3"
        style={notification.unread ? { background: "#F5F5F5" } : null}
      >
        <div
          className="row"
          onClick={() => {
            if (notification.unread) {
              this.props.updateNotification(notification.id, { unread: false });
            }
          }}
        >
          <div className="col-md-10 col-8">{msgContant}</div>
          {notification.unread &&
          notification.sender_id !== this.props.auth.user.id ? (
            <div className="col-md-2 col-4 text-center">
              <span className="new-notification">#new</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

ProjectNotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  updateNotification: PropTypes.func.isRequired,
  updateInstrument: PropTypes.func.isRequired,
  deleteNotificationsByInstrumentId: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { updateInstrument, deleteNotificationsByInstrumentId, updateNotification }
)(withRouter(ProjectNotificationItem));
