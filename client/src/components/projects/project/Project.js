import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ProjectItem from "../projects/ProjectItem";
import CommentForm from "./CommentForm";
import CommentFeed from "./CommentFeed";
import Spinner from "../../common/Spinner";
import { getProject } from "../../../actions/projectActions";

class Poroject extends Component {
  componentDidMount() {
    this.props.getProject(this.props.match.params.id);
  }

  render() {
    const { project, loading } = this.props.project;
    let projectContant;
    if (project === null || loading || Object.keys(project).length === 0) {
      projectContant = <Spinner />;
    } else {
      projectContant = (
        <div>
          <ProjectItem project={project} showActions={false} />
          <CommentForm projectId={project.id} />
          <CommentFeed projectId={project.id} comments={project.comments} />
        </div>
      );
    }
    return (
      <div className="project">
        <div className="container">
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-10">
              <button
                type="button"
                className="btn btn-light mb-3"
                onClick={() => window.history.back()}
              >
                Back
              </button>
              {projectContant}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Poroject.propTypes = {
  getProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  project: state.project
});

export default connect(
  mapStateToProps,
  { getProject }
)(Poroject);
