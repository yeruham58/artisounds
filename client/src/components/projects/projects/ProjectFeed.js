import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ProjectItem from "./ProjectItem";
import { getProjects } from "../../../actions/projectActions";

class ProjectFeed extends Component {
  componentDidMount() {
    this.props.getProjects();
  }
  render() {
    const { projects } = this.props.project;
    if (!projects) {
      return <div>You stiil dont have any projects</div>;
    }

    return projects.map(project => (
      <ProjectItem key={project.id} project={project} />
    ));
  }
}

ProjectFeed.propTypes = {
  // projects: PropTypes.array.isRequired,
  getProjects: PropTypes.func.isRequired
};

// export default ProjectFeed;
const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  project: state.project
});

export default connect(
  mapStateToProps,
  { getProjects }
)(ProjectFeed);
