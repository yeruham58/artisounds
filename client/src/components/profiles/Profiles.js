import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Spinner from "../common/Spinner";
import { getProfiles } from "../../actions/profileActions";
import { getProject, clearProject } from "../../actions/projectActions";
import {
  sendNotification,
  getNotificationsByUserId,
  deleteNotificationsById
} from "../../actions/notificationActions";
import ProfileItem from "./ProfileItem";

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
    if (this.props.match.params.projectId && this.props.auth.isAuthenticated) {
      this.props.getProject(this.props.match.params.projectId);
      this.props.getNotificationsByUserId(this.props.auth.user.id);
    }
  }

  // componentWillUnmount() {
  //   // this.props.clearProject();
  // }
  render() {
    const { profiles, loading } = this.props.profile;
    const { project } = this.props.project;
    const { user } = this.props.auth;
    const { notifications } = this.props.notifications;
    const instrumentId = this.props.match.params.instrumentId;
    const notificationToProfileItem = notifications
      ? notifications.find(
          notification =>
            notification.sender_id === user.id &&
            notification.project_instrument_id.toString() === instrumentId
        )
      : null;
    const showInviteButton =
      project &&
      user &&
      project.user_id === user.id &&
      project.instruments &&
      project.instruments.find(
        instrument => instrument.id.toString() === instrumentId
      );

    const projectInstrument =
      project && instrumentId
        ? project.instruments.find(
            instrument => instrument.id.toString() === instrumentId
          )
        : null;

    let newProfiles;
    if (profiles && projectInstrument) {
      newProfiles = profiles.filter(profile =>
        profile.art_practics.find(
          insrto =>
            insrto.art_practic_details.id === projectInstrument.instrument_id
        )
      );
    }

    let profileItems;
    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      const profilesList = newProfiles ? newProfiles : profiles;
      if (profilesList.length > 0) {
        profileItems = profilesList
          .filter(profile => profile.id !== this.props.auth.user.id)
          .map(profile => (
            <ProfileItem
              key={profile.id}
              profile={profile}
              isAuthenticated={this.props.auth.isAuthenticated}
              instrument={showInviteButton ? showInviteButton : null}
              logedInUserId={user ? user.id : null}
              sendNotification={this.props.sendNotification}
              deleteNotificationsById={this.props.deleteNotificationsById}
              notification={notificationToProfileItem}
            />
          ));
      } else {
        profileItems = <h1>No profiles found...</h1>;
      }
    }
    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {project && (
                <Link
                  to={`/project/project-view/${project.id}`}
                  className="btn btn-light mb-3"
                >
                  Back
                </Link>
              )}
              <h3 className="display-5 text-center">
                {!project || !this.props.match.params.projectId
                  ? "Artists"
                  : projectInstrument.instrument_detailes.art_practic_name +
                    " players "}{" "}
                Profiles
              </h3>

              {!project ||
                (!this.props.match.params.projectId && (
                  <p className="lead text-center">
                    Brouse and connect with other artists
                  </p>
                ))}
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  clearProject: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
  deleteNotificationsById: PropTypes.func.isRequired,
  getNotificationsByUserId: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  notifications: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  project: state.project,
  notifications: state.notifications,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getProfiles,
    getProject,
    clearProject,
    sendNotification,
    getNotificationsByUserId,
    deleteNotificationsById
  }
)(Profiles);
