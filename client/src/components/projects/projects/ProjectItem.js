import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import isEmpty from "../../validation/isEmpty";
import defaultImg from "../../../img/musicGif.gif";

class ProjectItem extends Component {
  render() {
    const { project } = this.props;

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-3">
            <img
              src={
                project.img_or_video_url ? project.img_or_video_url : defaultImg
              }
              alt=""
              className="rounded"
              id="project-img"
            />
          </div>
          <div className="col-lg-6 col-md-4 col-7">
            <h5>
              {project.original ? null : "Cover to "}
              <strong>{project.name}</strong>
            </h5>
            <p>
              {project.original
                ? "Original!"
                : "Original by " + project.original_by}
            </p>
            <p>{project.genre_id ? project.genre_id + "jenre TODO" : null}</p>
            {this.props.showActions ? (
              <Link
                to={`/project/add-instrument/${project.id}`}
                className="btn btn-info  mr-2 mb-2"
              >
                Add indtruments
              </Link>
            ) : null}
          </div>

          {/* <div className="col-md-4 d-none d-md-block">
            <h4>Art types</h4>
            <ul className="list-group">
              {project.art_types.slice(0, 2).map((artType, index) => (
                <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1" />
                  {artType.art_type_details.art_type_name}
                </li>
              ))}
              {project.art_types.length > 2 ? (
                <li key={2} className="list-group-item">
                  More...
                </li>
              ) : null}
            </ul>
          </div> */}
        </div>
      </div>
    );
  }
}

ProjectItem.defaultProps = {
  showActions: true
};

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired
};

export default ProjectItem;
