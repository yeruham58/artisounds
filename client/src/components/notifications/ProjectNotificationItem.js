import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { splitNameAndId } from "../../config/chatConfig";
import { updateInstrument } from "../../actions/projectActions";
import {
  deleteNotificationsByInstrumentId,
  updateNotification,
  sendNotification
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
    setTimeout(
      () =>
        this.props.updateNotification(this.props.notification.id, {
          sender_id: this.props.auth.user.id,
          unread: true,
          sent_to_id: this.props.notification.sender_id,
          notification_type: "join"
        }),
      100
    );
  }

  render() {
    const { notification } = this.props;
    const { user } = this.props.auth;
    console.log("notification");
    console.log(notification);
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

    const senderLink = notification.sender_id ? (
      <Link to={`/profile/${notification.sender_id}`}>
        <strong style={{ color: "black" }}>{senderName} </strong>
      </Link>
    ) : null;
    const sendToName = notification.send_to_detailes.name;
    const sendToLink = (
      <Link to={`/profile/${notification.sent_to_id}`}>
        <strong style={{ color: "black" }}>{sendToName} </strong>
      </Link>
    );

    const message = (
      <div className="mt-3 ml-3">
        <strong>Message:</strong>
        <br />
        {notification.message_text}
      </div>
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

    const projectInstrument = notification.project.instruments.find(
      instrument => instrument.id === notification.project_instrument_id
    );

    const instrumentName = projectInstrument ? (
      <strong>{projectInstrument.instrument_detailes.art_practic_name}</strong>
    ) : null;

    const stillInProject =
      notification.project.instruments &&
      notification.project.instruments.find(
        instrument =>
          (instrument.user_id !== user.id &&
            instrument.user_id === notification.sender_id) ||
          (instrument.user_id !== user.id &&
            instrument.user_id === notification.sent_to_id)
      );

    let msgContant;
    if (notification.project_owner_id === this.props.auth.user.id) {
      if (notification.notification_type === "join req") {
        if (notification.sender_id === user.id) {
          //you asked somebody to join you
          msgContant = (
            <div>
              <div className="ml-3">
                You have sent an invitation to {sendToLink}, to play{" "}
                {instrumentName} in your project {projectLink}
              </div>
              {notification.message_text && message}
            </div>
          );
        } else {
          // sombody asked to join your project
          msgContant = (
            <div>
              <div className="ml-3">
                {senderLink}
                want to play {instrumentName} in your {projectLink} project
              </div>
              {notification.message_text && message}
              <span>{acceptButton}</span>
              <span>{sendMessageButton}</span>
            </div>
          );
        }
      }
      if (notification.notification_type === "join") {
        if (notification.sender_id === user.id) {
          //you accept somebody to your project
          msgContant = (
            <div className="ml-3">
              You have accepted {sendToLink} to play {instrumentName} in{" "}
              {projectLink} project!
            </div>
          );
        } else {
          // sombody accept your invitation to your project
          msgContant = (
            <div className="ml-3">
              {senderLink} has accepted your invitations to play{" "}
              {instrumentName} in {projectLink} project!
            </div>
          );
        }
      }
      if (notification.notification_type === "leave") {
        if (notification.sender_id === user.id) {
          //you deleted some instrument with his player
          msgContant = (
            <div className="ml-3">
              You have deleted {stillInProject ? "one of" : null}
              {sendToLink} {stillInProject ? "posotions" : "position"} in{" "}
              {projectLink} project
            </div>
          );
        } else {
          // sombody left this instrument in your project
          msgContant = (
            <div className="ml-3">
              {senderLink} left the {instrumentName} position in {projectLink}{" "}
              project
            </div>
          );
        }
      }
    } else {
      if (notification.notification_type === "join req") {
        if (notification.sender_id === user.id) {
          // you asked somebody to join his project
          msgContant = (
            <div>
              <div className="ml-3">
                You asked {sendToLink}
                to play {instrumentName} in {projectLink} project
              </div>
              {notification.message_text && message}
            </div>
          );
        } else {
          // sombody asked to join his project
          msgContant = (
            <div>
              <div className="ml-3">
                {senderLink}
                asked you to play {instrumentName} in {projectLink} project
              </div>
              {notification.message_text && message}
              <span>{acceptButton}</span>
              <span>{sendMessageButton}</span>
            </div>
          );
        }
      }
      if (notification.notification_type === "join") {
        if (notification.sender_id === user.id) {
          //you have accepted somebody's invitation to his project
          msgContant = (
            <div className="ml-3">
              You have accepted {sendToLink} invitation to play {instrumentName}{" "}
              in {projectLink} project!
            </div>
          );
        } else {
          // sombody accept your join req and added you to his project
          msgContant = (
            <div className="ml-3">
              {senderLink} has accepted your req to play {instrumentName} in{" "}
              {projectLink} project!
            </div>
          );
        }
      }
      if (notification.notification_type === "leave") {
        if (notification.sender_id === user.id) {
          //you left some instrument
          msgContant = (
            <div className="ml-3">
              You have left{" "}
              {stillInProject ? "one of your positions" : "your position"} in{" "}
              {projectLink} project
            </div>
          );
        } else {
          // sombody deleted your role in his project
          msgContant = (
            <div className="ml-3">
              {senderLink} has deleted{" "}
              {stillInProject ? "one of your positions" : "your position"} in{" "}
              {projectLink} project
            </div>
          );
        }
      }
    }

    if (!msgContant) return null;
    const unread =
      notification.unread &&
      notification.sent_to_id === this.props.auth.user.id;

    console.log("unread");
    console.log(unread);
    return (
      <div
        className="card card-body mb-3"
        style={unread ? { background: "#F5F5F5" } : null}
      >
        <div
          className="row"
          onClick={() => {
            if (unread) {
              this.props.updateNotification(notification.id, {
                unread: false
              });
            }
          }}
        >
          <div className="col-md-10 col-8">{msgContant}</div>
          {unread ? (
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
  sendNotification: PropTypes.func.isRequired,
  updateInstrument: PropTypes.func.isRequired,
  deleteNotificationsByInstrumentId: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    updateInstrument,
    deleteNotificationsByInstrumentId,
    updateNotification,
    sendNotification
  }
)(withRouter(ProjectNotificationItem));
