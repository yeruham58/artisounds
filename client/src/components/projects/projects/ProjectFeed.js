import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spinner from "../../common/Spinner";
import ProjectItem from "./ProjectItem";
import { getProjects, deleteProject } from "../../../actions/projectActions";

class ProjectFeed extends Component {
  componentDidMount() {
    this.props.getProjects();
  }
  render() {
    const { projects, loading } = this.props.project;
    if (!projects && !loading) {
      return <div>You stiil dont have any projects</div>;
    }

    if (loading) {
      return <Spinner />;
    }

    return projects.map(project => (
      <ProjectItem
        key={project.id}
        project={project}
        projectOwner={
          this.props.auth.user && this.props.auth.user.id === project.user_id
        }
        deleteProject={this.props.deleteProject}
        history={this.props.history}
      />
    ));
  }
}

ProjectFeed.propTypes = {
  project: PropTypes.object.isRequired,
  getProjects: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired
};

// export default ProjectFeed;
const mapStateToProps = state => ({
  auth: state.auth,
  project: state.project
});

export default connect(
  mapStateToProps,
  { getProjects, deleteProject }
)(ProjectFeed);
