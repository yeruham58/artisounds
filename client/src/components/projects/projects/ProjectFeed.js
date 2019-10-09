import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spinner from "../../common/Spinner";
import ProjectItem from "./ProjectItem";
import { getProjects, deleteProject } from "../../../actions/projectActions";

class ProjectFeed extends Component {
  componentDidMount() {
    if (!this.props.filterdProjects) this.props.getProjects();
  }
  render() {
    const { projects, loading } = this.props.project;
    const { filterdProjects } = this.props;
    if (
      (!projects && !loading && !filterdProjects) ||
      (filterdProjects && filterdProjects.length < 1)
    ) {
      return (
        <div className="text-center mt-4">
          <strong>You still dont have any projects here</strong>
        </div>
      );
    }

    if (loading) {
      return <Spinner />;
    }
    const projectsListToShow = filterdProjects ? filterdProjects : projects;

    return projectsListToShow.map(project => (
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
  finishedProjects: PropTypes.object,
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
