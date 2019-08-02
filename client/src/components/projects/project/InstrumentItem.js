import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import defaultImg from "../../../img/musicGif.gif";

class InstrumentItem extends Component {
  render() {
    const { instrument } = this.props;

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-12">
            <img
              src={
                defaultImg
                // project.img_or_video_url ? project.img_or_video_url : defaultImg
              }
              alt=""
              className="rounded-circle"
              id="instrument-img"
            />
          </div>
          <div>
            {this.props.showActions ? (
              <Link
                to={`/project/add-instrument/${instrument.id}`}
                className="btn btn-info  mr-2 mb-2"
              >
                Invite a freind
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

InstrumentItem.defaultProps = {
  showActions: true
};

InstrumentItem.propTypes = {
  // project: PropTypes.object.isRequired
};

export default InstrumentItem;
