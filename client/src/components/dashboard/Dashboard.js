import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spiner from "../common/Spinner";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import ProfileActions from "./ProfileActions";
import ProjectFeed from "../projects/projects/ProjectFeed";
import { getNotificationsByUserId } from "../../actions/notificationActions";
import ProjectNotificationsFeed from "../notifications/ProjectNotificationsFeed";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.getNotificationsByUserId();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spiner />;
    } else {
      // Chack if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">
              Wellcome
              <Link to={`/profile/${profile.id}`}> {user.name}</Link>
            </p>
            <ProfileActions />
            <ul className="nav nav-tabs mb-3" id="myTab" role="tablist">
              <li className="nav-item">
                <div
                  className="nav-link active"
                  id="projects-you-manage-tab"
                  data-toggle="tab"
                  href="#projects-you-manage"
                  role="tab"
                  aria-controls="projects-you-manage"
                  aria-selected="true"
                >
                  Projects you manage
                </div>
              </li>
              <li className="nav-item">
                <div
                  className="nav-link"
                  id="profile-tab"
                  data-toggle="tab"
                  href="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Projects you work on
                </div>
              </li>
              <li className="nav-item">
                <div
                  className="nav-link"
                  id="profile-tab"
                  data-toggle="tab"
                  href="#profile1"
                  role="tab"
                  aria-controls="profile1"
                  aria-selected="false"
                >
                  Finished projects
                </div>
              </li>
              <li className="nav-item">
                <div
                  className="nav-link"
                  id="contact-tab"
                  data-toggle="tab"
                  href="#contact"
                  role="tab"
                  aria-controls="contact"
                  aria-selected="false"
                >
                  Notifications
                </div>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="projects-you-manage"
                role="tabpanel"
                aria-labelledby="projects-you-manage-tab"
              >
                <ProjectFeed />
              </div>
              <div
                className="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                profile test
              </div>
              <div
                className="tab-pane fade"
                id="profile1"
                role="tabpanel"
                aria-labelledby="profile1-tab"
              >
                profile1 test
              </div>
              <div
                className="tab-pane fade"
                id="contact"
                role="tabpanel"
                aria-labelledby="contact-tab"
              >
                <ProjectNotificationsFeed
                  notifications={this.props.notifications}
                />
              </div>
            </div>
          </div>
        );
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Wellcome {user.name}</p>
            <p>You have not yet set up a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  getNotificationsByUserId: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  notifications: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  notifications: state.notifications,
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount, getNotificationsByUserId }
)(Dashboard);
