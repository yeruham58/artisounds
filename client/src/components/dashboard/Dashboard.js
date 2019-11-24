import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spiner from "../common/Spinner";
import { getCurrentProfile } from "../../actions/profileActions";
import CreateProjectButton from "./CreateProjectButton";
import ProjectFeed from "../projects/projects/ProjectFeed";
import { getUserProjects } from "../../actions/projectActions";
import { getNotificationsByUserId } from "../../actions/notificationActions";
import ProjectNotificationsFeed from "../notifications/ProjectNotificationsFeed";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendTab: localStorage.getItem("dashboardTab")
        ? localStorage.getItem("dashboardTab")
        : "projects-you-manage"
    };

    this.pageContantChange = this.pageContantChange.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.getNotificationsByUserId();
    this.props.getUserProjects(this.props.auth.user.id);
    this.setState({
      opendTab: localStorage.getItem("dashboardTab")
        ? localStorage.getItem("dashboardTab")
        : "projects-you-manage"
    });
  }

  pageContantChange(newTab) {
    localStorage.setItem("dashboardTab", newTab);
    this.setState({
      opendTab: newTab
    });
  }

  render() {
    const unreadMsgNumber =
      this.props.notifications && this.props.notifications.notifications
        ? this.props.notifications.notifications.filter(
            not => not.unread && not.sender_id !== this.props.auth.user.id
          ).length
        : null;
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const { projects } = this.props.project;
    const { opendTab } = this.state;

    let pageContant;
    let filterdProjects;

    if ((!projects || projects.length <= 0) && opendTab !== "notifications") {
      pageContant = (
        <div className="text-center">
          <strong>You still don't have any projects</strong>
        </div>
      );
    } else {
      if (opendTab === "projects-you-manage") {
        filterdProjects = projects.filter(
          project =>
            project.user_id === this.props.auth.user.id && project.in_action
        );
      }
      if (opendTab === "projects-you-work-on") {
        filterdProjects = projects.filter(
          project =>
            project.user_id !== this.props.auth.user.id && project.in_action
        );
      }
      if (opendTab === "finished-projects") {
        filterdProjects = projects.filter(project => !project.in_action);
      }
      if (opendTab === "notifications") {
        pageContant = (
          <ProjectNotificationsFeed notifications={this.props.notifications} />
        );
      }
    }

    if (this.props.project.loading) {
      pageContant = <Spiner />;
    }

    if (filterdProjects) {
      pageContant = <ProjectFeed filterdProjects={filterdProjects} />;
    }

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
            <CreateProjectButton />
            <div className="container">
              <div className="row">
                <button
                  className={`btn ${
                    this.state.opendTab === "projects-you-manage"
                      ? "btn-outline-dark"
                      : "btn-light"
                  } col-md-3 col-6 mb-3`}
                  style={{ width: "100%" }}
                  onClick={() => this.pageContantChange("projects-you-manage")}
                >
                  Projects you manage
                </button>
                <button
                  className={`btn ${
                    this.state.opendTab === "projects-you-work-on"
                      ? "btn-outline-dark"
                      : "btn-light"
                  } col-md-3 col-6 mb-3`}
                  style={{ width: "100%" }}
                  onClick={() => this.pageContantChange("projects-you-work-on")}
                >
                  Projects you work on
                </button>
                <button
                  className={`btn ${
                    this.state.opendTab === "finished-projects"
                      ? "btn-outline-dark"
                      : "btn-light"
                  } col-md-3 col-6 mb-3`}
                  style={{ width: "100%" }}
                  onClick={() => this.pageContantChange("finished-projects")}
                >
                  Finished projects
                </button>
                <button
                  className={`btn ${
                    this.state.opendTab === "notifications"
                      ? "btn-outline-dark"
                      : "btn-light"
                  } col-md-3 col-6 mb-3`}
                  style={{ width: "100%" }}
                  onClick={() => this.pageContantChange("notifications")}
                >
                  Notifications{" "}
                  {unreadMsgNumber &&
                  unreadMsgNumber > 0 &&
                  this.state.opendTab !== "notifications" ? (
                    <span className="new-notification">{unreadMsgNumber}</span>
                  ) : null}
                </button>
              </div>
            </div>
            {pageContant}
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
            <div className="col-md-12">{dashboardContent}</div>
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

export default connect(mapStateToProps, {
  getCurrentProfile,
  getNotificationsByUserId,
  getUserProjects
})(Dashboard);
