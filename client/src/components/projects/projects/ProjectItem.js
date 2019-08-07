import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import defaultImg from "../../../img/musicGif.gif";

class ProjectItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moreDetails: false,
      instrumentsList: 2
    };

    this.moreDetailesControl = this.moreDetailesControl.bind(this);
  }

  moreDetailesControl() {
    this.setState({
      moreDetails: !this.state.moreDetails,
      instrumentsList: this.state.moreDetails ? 2 : 6
    });
  }

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
    console.log("project");
    console.log(project);

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
                      : defaultImg
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
                  <p>
                    <span className="genre">
                      {"#" + project.genre.music_genre_name}
                    </span>
                  </p>
                ) : null}
                {this.state.moreDetails ? moreDetailes1 : null}
              </div>
            </div>
            {this.state.moreDetails ? <div>{moreDetailes2}</div> : null}
          </div>
          {project.instruments && project.instruments[0] ? (
            <div className="col-md-5 d-none d-md-block col-4">
              <h4>Instruments</h4>
              <ul className="list-group">
                {project.instruments
                  .slice(0, this.state.instrumentsList)
                  .map((instrument, index) => (
                    <li key={index} className="list-group-item">
                      <i className="fa fa-check pr-1" />
                      {instrument.instrument_detailes.art_practic_name}
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
        <div className="row">
          <div className="col-12">
            <div
              className="btn btn-outline-primary mr-2 mb-2"
              onClick={this.moreDetailesControl}
            >
              {this.state.moreDetails ? "Close" : "More detailes"}
            </div>
            {this.props.showActions ? (
              <Link
                to={`/project/project-view/${project.id}`}
                className="btn btn-info mr-2 mb-2"
              >
                Manage indtruments
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
  project: PropTypes.object.isRequired
};

export default ProjectItem;
