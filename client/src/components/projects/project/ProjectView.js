import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

import ProjectItem from "../projects/ProjectItem";
import InstrumentForm from "./InstrumentForm";
import InstrumentsFeed from "./InstrumentsFeed";
import Spinner from "../../common/Spinner";
import { getProject, clearProject } from "../../../actions/projectActions";
import { getNotificationsByUserId } from "../../../actions/notificationActions";
import { getCurrentProfile } from "../../../actions/profileActions";

class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: null
    };
  }
  componentDidMount() {
    this.props.getProject(this.props.match.params.projectId);
    this.props.getCurrentProfile();
    this.props.getNotificationsByUserId();
  }

  componentWillUnmount() {
    this.props.clearProject();
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.notifications) {
      this.setState({
        notifications: nextProp.notifications.notifications
      });
    }
  }

  render() {
    const { project, loading } = this.props.project;
    const userProfile =
      this.props.profile && this.props.profile.profile
        ? this.props.profile.profile
        : null;

    let projectContant;
    if (project === null || loading || Object.keys(project).length === 0) {
      projectContant = <Spinner />;
    } else {
      projectContant = (
        <div>
          <ProjectItem
            project={project}
            showActions={false}
            history={this.props.history}
            projectOwner={
              this.props.auth.user &&
              this.props.auth.user.id === project.user_id
            }
          />
        </div>
      );
    }

    if (this.props.project.loading || !this.props.project.project) {
      return <Spinner />;
    }

    return (
      <div className="project">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <button
                type="button"
                className="btn btn-light mb-3"
                onClick={() => window.history.back()}
              >
                Back
              </button>
              {projectContant}
              {this.props.auth.user &&
              this.props.auth.user.id === project.user_id ? (
                <InstrumentForm project_id={this.props.project.project.id} />
              ) : null}

              {project.instruments && project.instruments[0] ? (
                <InstrumentsFeed
                  // notifications={
                  //   this.state.notifications.notifications
                  //     ? this.state.notifications.notifications
                  //     : null
                  // }
                  notifications={this.state.notifications}
                  instruments={project.instruments}
                  projectOwner={
                    this.props.auth.user &&
                    this.props.auth.user.id === project.user_id
                  }
                  projectOwnerId={project.user_id}
                  logedInUserId={
                    this.props.auth.user ? this.props.auth.user.id : null
                  }
                  userArtTypes={
                    userProfile && userProfile.art_types
                      ? userProfile.art_types
                      : null
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProjectView.propTypes = {
  getNotificationsByUserId: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  clearProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object
};

const mapStateToProps = state => ({
  notifications: state.notifications,
  project: state.project,
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,

  {
    getProject,
    clearProject,
    getCurrentProfile,
    getNotificationsByUserId
  }
)(ProjectView);
