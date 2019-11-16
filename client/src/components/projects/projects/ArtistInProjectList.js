import React, { Component } from "react";
import { Link } from "react-router-dom";

import InstrumentDefaultImg from "../../../img/stillNoBodyImg.jpeg";

class ArtistInProjectList extends Component {
  render() {
    const { project } = this.props;
    return (
      <div>
        {this.props.moreDetails ||
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
                        this.props.history.push(`/profile/${project.user_id}`);
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
                .slice(0, this.props.instrumentsList)
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
              {project.instruments.length > this.props.instrumentsList ? (
                <li key={2} className="list-group-item">
                  <Link to={`/project/project-view/${project.id}`}>
                    <strong>More...</strong>
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ArtistInProjectList;
