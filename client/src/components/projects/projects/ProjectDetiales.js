import React, { Component } from "react";
// import { Link } from "react-router-dom";

import projectDefaultImg from "../../../img/musicGif.gif";

class ProjectDetiales extends Component {
  render() {
    const { project } = this.props;

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
              <strong>Tempo (metronome): </strong>
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
      <div>
        <div className="row">
          {this.props.showImg && (
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
          )}

          <div className={`${this.props.showImg ? "col-7" : "col-12"}`}>
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

            <div className="mt-3">
              <strong>Project Manager: </strong>
              <a
                href={`/profile/${project.user_id}`}
                style={{ color: "black" }}
              >
                <div>{project.user_detailes.name}</div>
              </a>
            </div>
            {project.genre ? (
              <p className="mt-4">
                <span className="genre">
                  {"#" + project.genre.music_genre_name}
                </span>
              </p>
            ) : null}
            {this.props.moreDetails ||
            (project.instruments && project.instruments[0])
              ? moreDetailes1
              : null}
          </div>
        </div>
        {this.props.moreDetails ? <div>{moreDetailes2}</div> : null}
      </div>
    );
  }
}

export default ProjectDetiales;
