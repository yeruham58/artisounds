import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spinner from "../../common/Spinner";
import ProjectItem from "./ProjectItem";
import {
  getProjects,
  deleteProject,
  clearProject
} from "../../../actions/projectActions";

class ProjectFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all: false,
      finished: true,
      inAction: false
    };
  }
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
          <strong>You still don't have any projects here</strong>
        </div>
      );
    }

    if (loading) {
      return <Spinner />;
    }
    var projectsListToShow = filterdProjects ? filterdProjects : projects;

    if (!filterdProjects && (this.state.finished || this.state.inAction)) {
      projectsListToShow = this.state.finished
        ? projectsListToShow.filter(project => !project.in_action)
        : projectsListToShow.filter(project => project.in_action);
    }

    const radioButtons = (
      <div className="container">
        <div className="row">
          <div
            className="col-sm-12"
            // style={{ position: "absolute", top: "100px" }}
          >
            <form>
              <div className="radio float-left ml-4">
                <label>
                  <input
                    type="radio"
                    value="option1"
                    className="mr-2"
                    checked={this.state.finished}
                    onChange={() => {
                      this.setState({
                        finished: true,
                        all: false,
                        inAction: false
                      });
                    }}
                  />
                  Finished projects
                </label>
              </div>
              <div className="radio float-left ml-4">
                <label>
                  <input
                    type="radio"
                    value="option2"
                    className="mr-2"
                    checked={this.state.inAction}
                    onChange={() => {
                      this.setState({
                        finished: false,
                        all: false,
                        inAction: true
                      });
                    }}
                  />
                  Projects in action
                </label>
              </div>

              <div className="radio float-left ml-4">
                <label>
                  <input
                    type="radio"
                    value="option3"
                    className="mr-2"
                    checked={this.state.all}
                    onChange={() => {
                      this.setState({
                        finished: false,
                        all: true,
                        inAction: false
                      });
                    }}
                  />
                  All
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

    var projectsListToShowElm = [];
    projectsListToShow.map(project =>
      projectsListToShowElm.push(
        <ProjectItem
          key={project.id}
          project={project}
          projectOwner={
            this.props.auth.user && this.props.auth.user.id === project.user_id
          }
          deleteProject={this.props.deleteProject}
          history={this.props.history}
        />
      )
    );

    return (
      <div>
        <div>{filterdProjects ? "" : radioButtons}</div>
        {projectsListToShowElm}
      </div>
    );
  }
}

ProjectFeed.propTypes = {
  project: PropTypes.object.isRequired,
  finishedProjects: PropTypes.object,
  getProjects: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  clearProject: PropTypes.func.isRequired
};

// export default ProjectFeed;
const mapStateToProps = state => ({
  auth: state.auth,
  project: state.project
});

export default connect(
  mapStateToProps,
  { getProjects, deleteProject, clearProject }
)(ProjectFeed);
