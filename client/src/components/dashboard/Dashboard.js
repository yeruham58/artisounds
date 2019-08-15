import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spiner from "../common/Spinner";
import { getCurrentProfile } from "../../actions/profileActions";
import ProfileActions from "./ProfileActions";
import ProjectFeed from "../projects/projects/ProjectFeed";
import { getUserProjects } from "../../actions/projectActions";
import { getNotificationsByUserId } from "../../actions/notificationActions";
import ProjectNotificationsFeed from "../notifications/ProjectNotificationsFeed";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsYouManage: null,
      projectsYouWorkOn: null,
      finishedProjects: null
    };
  }

  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.getNotificationsByUserId();
    this.props.getUserProjects();
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.project && nextProp.project.projects) {
      this.setState({
        finishedProjects: nextProp.project.projects.filter(
          project => !project.in_action
        ),
        projectsYouManage: nextProp.project.projects.filter(
          project =>
            project.user_id === this.props.auth.user.id && project.in_action
        ),
        projectsYouWorkOn: nextProp.project.projects.filter(
          project =>
            project.user_id !== this.props.auth.user.id && project.in_action
        )
      });
    }
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spiner />;
    } else {
      // Chack if logged in user has profile data
      localStorage.removeItem("test");

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
                  className={`nav-link ${
                    localStorage.getItem("dashboardTab") ===
                      "projects-you-manage" ||
                    !localStorage.getItem("dashboardTab")
                      ? "active"
                      : null
                  }`}
                  id="projects-you-manage-tab"
                  data-toggle="tab"
                  href="#projects-you-manage"
                  role="tab"
                  aria-controls="projects-you-manage"
                  aria-selected="true"
                  onClick={() =>
                    localStorage.setItem("dashboardTab", "projects-you-manage")
                  }
                >
                  Projects you manage
                </div>
              </li>
              <li className="nav-item">
                <div
                  className={`nav-link ${
                    localStorage.getItem("dashboardTab") ===
                    "projects-you-work-on"
                      ? "active"
                      : null
                  }`}
                  id="projects-you-work-on-tab"
                  data-toggle="tab"
                  href="#projects-you-work-on"
                  role="tab"
                  aria-controls="projects-you-work-on"
                  aria-selected="false"
                  onClick={() => {
                    localStorage.setItem(
                      "dashboardTab",
                      "projects-you-work-on"
                    );
                    this.props.getUserProjects();
                  }}
                >
                  Projects you work on
                </div>
              </li>
              <li className="nav-item">
                <div
                  className={`nav-link ${
                    localStorage.getItem("dashboardTab") === "finished-projects"
                      ? "active"
                      : null
                  }`}
                  id="finished-projects-tab"
                  data-toggle="tab"
                  href="#finished-projects"
                  role="tab"
                  aria-controls="finished-projects"
                  aria-selected="false"
                  onClick={() => {
                    localStorage.setItem("dashboardTab", "finished-projects");
                    this.props.getUserProjects();
                  }}
                >
                  Finished projects
                </div>
              </li>
              <li className="nav-item">
                <div
                  className={`nav-link ${
                    localStorage.getItem("dashboardTab") === "notifications"
                      ? "active"
                      : null
                  }`}
                  id="notifications-tab"
                  data-toggle="tab"
                  href="#notifications"
                  role="tab"
                  aria-controls="notifications"
                  aria-selected="false"
                  onClick={() => {
                    localStorage.setItem("dashboardTab", "notifications");
                    this.props.getNotificationsByUserId();
                  }}
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
                <ProjectFeed filterdProjects={this.state.projectsYouManage} />
              </div>
              <div
                className="tab-pane fade"
                id="projects-you-work-on"
                role="tabpanel"
                aria-labelledby="projects-you-work-on-tab"
              >
                <ProjectFeed filterdProjects={this.state.projectsYouWorkOn} />
              </div>
              <div
                className="tab-pane fade"
                id="finished-projects"
                role="tabpanel"
                aria-labelledby="finished-projects-tab"
              >
                <ProjectFeed filterdProjects={this.state.finishedProjects} />
              </div>
              <div
                className="tab-pane fade"
                id="notifications"
                role="tabpanel"
                aria-labelledby="notifications-tab"
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
  getCurrentProfile: PropTypes.func.isRequired,
  getNotificationsByUserId: PropTypes.func.isRequired,
  getUserProjects: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  notifications: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  notifications: state.notifications,
  project: state.project,
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, getNotificationsByUserId, getUserProjects }
)(Dashboard);
