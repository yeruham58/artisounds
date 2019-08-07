import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import defaultImg from "../../../img/stillNoBodyImg.jpeg";

class InstrumentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moreDetailes: false
    };
  }
  render() {
    const { instrument } = this.props;
    const imgInTop =
      window.innerWidth < 470 ||
      (window.innerWidth > 770 && window.innerWidth < 1000)
        ? true
        : false;

    const img = (
      <img
        src={
          instrument.user_detailes && instrument.user_detailes.avatar
            ? instrument.user_detailes.avatar
            : defaultImg
        }
        alt=""
        className="rounded-circle mb-3 mr-7"
        id="instrument-img"
        style={{
          width: "80px",
          height: "80px"
        }}
      />
    );

    return (
      <div className="card card-body bg-light mb-3">
        {imgInTop && <div className="text-center">{img}</div>}
        <div className="row">
          <div className={imgInTop ? null : "col-3"}>{!imgInTop && img}</div>
          <div className={imgInTop ? "col-5" : "col-4"}>
            <div>
              <strong>{instrument.instrument_detailes.art_practic_name}</strong>
            </div>
            <div style={instrument.user_detailes ? null : { color: "green" }}>
              {instrument.user_detailes
                ? instrument.user_detailes.name
                : "Still open"}
            </div>
          </div>
          <div className={imgInTop ? "col-7" : "col-5"}>
            <div>
              {instrument.user_detailes &&
              this.props.logedInUserId === instrument.user_detailes.id ? (
                <Link
                  to={`/project/add-instrument/${instrument.id}`}
                  className="btn btn-outline-warning mb-2"
                >
                  Work on it
                </Link>
              ) : null}
              {this.props.projectOwner && !instrument.user_detailes ? (
                <Link
                  to={`/project/add-instrument/${instrument.id}`}
                  className="btn btn-outline-success mb-2"
                >
                  Invite a freind
                </Link>
              ) : null}
              {this.props.projectOwner && !instrument.user_detailes ? (
                <button
                  type="button"
                  className="btn btn-outline-primary mb-2"
                  onClick={() => {
                    this.props.updateInstrument(instrument.id, {
                      user_id: this.props.projectOwnerId
                    });
                  }}
                >
                  Il'l do it
                </button>
              ) : null}
              <div>
                <button
                  // onClick={this.onDeleteClick.bind(this, post.id)}
                  type="button"
                  className="btn btn-light mb-2"
                >
                  <i className="fas fa-pencil-alt" />
                </button>
                <button
                  // onClick={this.onDeleteClick.bind(this, post.id)}
                  type="button"
                  className="btn btn-light mb-2"
                >
                  <i className="far fa-trash-alt" />
                </button>
                {instrument.comments || instrument.role ? (
                  <button
                    onClick={() =>
                      this.setState({
                        moreDetailes: !this.state.moreDetailes
                      })
                    }
                    type="button"
                    className="btn btn-light mb-2"
                  >
                    {this.state.moreDetailes ? (
                      <i className="fas fa-minus" />
                    ) : (
                      <i className="fas fa-plus" />
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {instrument.role && this.state.moreDetailes ? (
          <div className="mt-3">
            <strong>Roll: </strong> {instrument.role}
          </div>
        ) : null}
        {instrument.comments && this.state.moreDetailes ? (
          <div>
            <div>
              <strong>Comment: </strong>
            </div>
            <div className="project-details">{instrument.comments}</div>
          </div>
        ) : null}
      </div>
    );
  }
}

InstrumentItem.propTypes = {
  projectOwner: PropTypes.bool.isRequired,
  updateInstrument: PropTypes.func.isRequired,
  projectOwnerId: PropTypes.number.isRequired,
  logedInUserId: PropTypes.number.isRequired
};

export default InstrumentItem;
