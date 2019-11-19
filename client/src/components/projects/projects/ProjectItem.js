import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";

import {
  deleteProject,
  updateProject,
  clearProject
} from "../../../actions/projectActions";
import { clearEditor } from "../../../actions/audioEditorActions";
import { deleteNotificationsByProjectId } from "../../../actions/notificationActions";
import CreateProject from "../create-project/CreateProject";
import projectDefaultImg from "../../../img/musicGif.gif";
import ProjectAudioControls from "./ProjectAudioControls";
import ArtistInProjectList from "./ArtistInProjectList";
import ProjectDetiales from "./ProjectDetiales";
import ProjectLikesAndCommentsControl from "./ProjectLikesAndCommentsControl";

class ProjectItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moreDetails: false,
      instrumentsList: 2
    };

    this.moreDetailesControl = this.moreDetailesControl.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
  }

  // componentWillUnmount() {
  //   this.props.clearProject();
  //   this.props.clearEditor();
  // }

  moreDetailesControl() {
    this.setState({
      moreDetails: !this.state.moreDetails,
      instrumentsList: this.state.moreDetails ? 2 : 4
    });
  }

  deleteProject() {
    if (
      window.confirm(
        "Are you sure?\nBy delete this project you gonna give other artist in this group to be the manager!\nIf you have any records for this project, you can access this project thrue your records (if thre is another artist in this project) but not like a manager!"
      )
    ) {
      this.props.deleteProject(this.props.project.id);
      this.props.deleteNotificationsByProjectId(this.props.project.id);

      if (window.location.href.indexOf("dashboard") < 0) {
        this.props.history.push("/dashboard");
      }
    }
  }

  render() {
    const { project } = this.props;
    if (!project || project === undefined) {
      return null;
    }

    const commentOrText =
      project.comment || project.description || project.text;

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-md-7">
            {window.location.href.indexOf("project-view") < 0 ? (
              <ProjectDetiales
                project={project}
                moreDetails={this.state.moreDetails}
                instrumentsList={this.state.instrumentsList}
                showImg={true}
              />
            ) : (
              <img
                src={
                  project.img_or_video_url
                    ? project.img_or_video_url
                    : projectDefaultImg
                }
                alt=""
                className="rounded mb-4"
                id="project-img"
                style={{ maxWidth: "400px" }}
              />
            )}
          </div>

          <div className="col-md-5 d-none d-md-block col-4">
            {window.location.href.indexOf("project-view") < 0 ? (
              <ArtistInProjectList
                project={project}
                moreDetails={this.state.moreDetails}
                instrumentsList={this.state.instrumentsList}
              />
            ) : (
              <ProjectDetiales
                project={project}
                moreDetails={this.state.moreDetails}
                instrumentsList={this.state.instrumentsList}
                showImg={false}
              />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {project.instruments.find(instru => instru.record_url) && (
              <div style={{ float: "left", width: "100%" }}>
                <ProjectAudioControls project={project} />
              </div>
            )}

            {!project.in_action && this.props.showActions && (
              <div className="float-right mt-2">
                <ProjectLikesAndCommentsControl
                  project={project}
                  authUser={this.props.auth.user}
                />
              </div>
            )}

            {this.props.projectOwner ? (
              <div>
                <Popup
                  modal
                  trigger={
                    <button
                      type="button"
                      className="btn btn-light mt-2 float-right"
                    >
                      <i className="fas fa-pencil-alt" />
                    </button>
                  }
                >
                  {close => <CreateProject project={project} close={close} />}
                </Popup>

                <button
                  onClick={this.deleteProject}
                  type="button"
                  className="btn btn-light mt-2 float-right"
                >
                  <i className="far fa-trash-alt" />
                </button>
              </div>
            ) : null}

            {commentOrText && (
              <button
                onClick={this.moreDetailesControl}
                type="button"
                className="btn btn-light mt-2 float-right "
              >
                {this.state.moreDetails ? (
                  <i className="fas fa-minus" />
                ) : (
                  <i className="fas fa-plus" />
                )}
              </button>
            )}

            {this.props.showActions ? (
              <Link
                to={`/project/project-view/${project.id}`}
                className="btn btn-outline-success mr-2 mb-2"
              >
                {this.props.projectOwner
                  ? "Manage indtruments"
                  : "View project"}
              </Link>
            ) : null}
            {this.props.projectOwner && !this.props.showActions ? (
              <button
                type="button"
                className={`btn ${
                  project.in_action
                    ? "btn-outline-success"
                    : "btn-outline-warning"
                } mr-2 mb-2`}
                onClick={() => {
                  if (
                    window.confirm(
                      project.in_action
                        ? "By back to edit project - people will be able to find your project and ask to join you, but you can't get likes or comments on a project you are still editing. \n\n The likes and comments that you alredy ahve will not be deleted by back to edit"
                        : "By marking as finished project - people will not be able any more to find your project and ask to join you, but people will be able to find your project in finished projects and give you likes or comments!"
                    )
                  ) {
                    this.props.updateProject(
                      project.id,
                      { in_action: !project.in_action },
                      this.props.history
                    );
                  }
                }}
              >
                {project.in_action
                  ? "Mark as finished project"
                  : "Back to work on project"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

ProjectItem.defaultProps = {
  showActions: true
};

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
  deleteProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  clearProject: PropTypes.func.isRequired,
  deleteNotificationsByProjectId: PropTypes.func.isRequired,
  projectOwner: PropTypes.bool,
  clearEditor: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    deleteProject,
    updateProject,
    clearProject,
    deleteNotificationsByProjectId,
    clearEditor
  }
)(ProjectItem);
