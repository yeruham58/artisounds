import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";

import { deleteProject } from "../../../actions/projectActions";
import { deleteNotificationsByProjectId } from "../../../actions/notificationActions";
import CreateProject from "../create-project/CreateProject";
import projectDefaultImg from "../../../img/musicGif.gif";
import InstrumentDefaultImg from "../../../img/stillNoBodyImg.jpeg";

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

    const moreDetailes1 = (
      <div>
        {project.scale ? (
          <div>
            <span>
              <strong>Scale: </strong>
            </span>
            <span>{`${project.scale} ${project.scale_type}`}</span>
          </div>
        ) : null}
        {project.bit ? (
          <div>
            <span>
              <strong>Bit: </strong>
            </span>
            <span>{project.bit}</span>
          </div>
        ) : null}
        {project.tempo ? (
          <div>
            <span>
              <strong>Tempo (metronom): </strong>
            </span>
            <span>{project.tempo}</span>
          </div>
        ) : null}
        <br />
      </div>
    );
    const moreDetailes2 = (
      <div>
        {project.description ? (
          <div>
            <div>
              <strong>Description: </strong>
            </div>
            <div className="project-details">{project.description}</div>
          </div>
        ) : null}
        {project.comment ? (
          <div>
            <div>
              <strong>Comment: </strong>
            </div>
            <div className="project-details">{project.comment}</div>
          </div>
        ) : null}
        {project.description ? (
          <div>
            <div>
              <strong>Text: </strong>
            </div>
            <div className="project-details">{project.text}</div>
          </div>
        ) : null}

        <br />
      </div>
    );

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              <div className="col-md-5">
                <img
                  src={
                    project.img_or_video_url
                      ? project.img_or_video_url
                      : projectDefaultImg
                  }
                  alt=""
                  className="rounded mb-4"
                  id="project-img"
                />
              </div>
              <div className="col-7">
                <h5>
                  {project.original ? null : "Cover to "}
                  <strong>{project.name}</strong>
                </h5>
                <h6>
                  {project.original ? "Original!" : "Original by "}
                  {!project.original ? (
                    <strong>{project.original_by}</strong>
                  ) : null}
                </h6>

                {project.genre ? (
                  <p className="mt-4">
                    <span className="genre">
                      {"#" + project.genre.music_genre_name}
                    </span>
                  </p>
                ) : null}
                {this.state.moreDetails ||
                (project.instruments && project.instruments[0])
                  ? moreDetailes1
                  : null}
              </div>
            </div>
            {this.state.moreDetails ? <div>{moreDetailes2}</div> : null}
          </div>

          <div className="col-md-5 d-none d-md-block col-4">
            {this.state.moreDetails ||
            !project.instruments ||
            !project.instruments[0] ? (
              <div>
                <h4>Project Manager:</h4>
                <ul className="list-group">
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col-3 col-lg-2">
                        <img
                          alt=""
                          src={project.user_detailes.avatar}
                          style={{ height: "35px", width: "35px" }}
                          className="rounded-circle mt-1"
                          onClick={() => {
                            this.props.history.push(
                              `/profile/${project.user_id}`
                            );
                          }}
                        />
                      </div>

                      <div className="col-8">
                        <div className="mt-2">
                          <strong>{project.user_detailes.name}</strong>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ) : null}
            {project.instruments && project.instruments[0] ? (
              <div>
                <h4>Instruments:</h4>
                <ul className="list-group">
                  {project.instruments
                    .slice(0, this.state.instrumentsList)
                    .map((instrument, index) => (
                      <li key={index} className="list-group-item">
                        <div className="row">
                          <div className="col-3 col-lg-2">
                            <img
                              alt=""
                              src={
                                instrument.user_detailes
                                  ? instrument.user_detailes.avatar
                                  : InstrumentDefaultImg
                              }
                              style={{ height: "35px", width: "35px" }}
                              className="rounded-circle mt-1"
                              onClick={() => {
                                if (instrument.user_detailes) {
                                  this.props.history.push(
                                    `/profile/${instrument.user_id}`
                                  );
                                }
                              }}
                            />
                          </div>

                          <div className="col-8">
                            <strong>
                              {instrument.instrument_detailes.art_practic_name}
                            </strong>
                            <div
                              style={
                                !instrument.user_id ? { color: "green" } : null
                              }
                            >
                              {instrument.user_detailes
                                ? instrument.user_detailes.name
                                : "Still open"}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  {project.instruments.length > this.state.instrumentsList ? (
                    <li key={2} className="list-group-item">
                      More...
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
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
            <div
              className="btn btn-outline-primary mr-2 mb-2"
              onClick={this.moreDetailesControl}
            >
              {this.state.moreDetails ? "Close" : "More detailes"}
            </div>
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
  deleteNotificationsByProjectId: PropTypes.func.isRequired,
  projectOwner: PropTypes.bool
};

// export default ProjectItem;
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    deleteProject,
    deleteNotificationsByProjectId
  }
)(ProjectItem);
