import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { splitNameAndId } from "../../config/chatConfig";
import { updateInstrument } from "../../actions/projectActions";
import { deleteNotificationsByInstrumentId } from "../../actions/notificationActions";

class ProjectNotificationItem extends Component {
  constructor(props) {
    super(props);

    this.onAccept = this.onAccept.bind(this);
  }

  onAccept() {
    this.props.updateInstrument(
      this.props.notification.project_instrument_id,
      {
        user_id: this.props.notification.sender_id
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
      <Link to={`/profile/${notification.send_to_id}`}>
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
            You have sent to {sendToLink}
            an invitation, to join your project {projectLink}
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
              want to join your {projectLink} project
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
            to join his {projectLink} project
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
              asked you to join his {projectLink} project
            </div>
            <span>{acceptButton}</span>
            <span>{sendMessageButton}</span>
          </div>
        );
      }
    }

    console.log(notification);
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div>{msgContant}</div>
        </div>
      </div>
    );
  }
}

ProjectNotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  updateInstrument: PropTypes.func.isRequired,
  deleteNotificationsByInstrumentId: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { updateInstrument, deleteNotificationsByInstrumentId }
)(withRouter(ProjectNotificationItem));
