import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import {
  updateInstrument,
  deleteInstrument
} from "../../../actions/projectActions";
import {
  deleteNotificationsByInstrumentId,
  deleteNotificationsById,
  sendNotification
} from "../../../actions/notificationActions";

import defaultImg from "../../../img/stillNoBodyImg.jpeg";
import InstrumentForm from "./InstrumentForm";

class InstrumentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moreDetailes: false,
      joinProjectMsg: ""
    };
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.sendJoinProjectReq = this.sendJoinProjectReq.bind(this);
  }

  onDeleteClick(instrument) {
    if (
      instrument.user_id &&
      instrument.user_id !== this.props.projectOwnerId
    ) {
      if (
        window.confirm(
          "Are you sure? \n By confirm you gonna delete all your info connected to this instrument including your access to this project thrue this instrument"
        )
      ) {
        this.props.updateInstrument(
          instrument.id,
          { user_id: null },
          this.props.history
        );
      }
    }

    if (
      instrument.user_id === this.props.projectOwnerId ||
      !instrument.record_url
    ) {
      if (
        window.confirm(
          "Are you sure? \nBy confirm you gonna delete all your info connected to this instrument"
        )
      ) {
        this.props.deleteInstrument(instrument.id);
      }
    }
  }

  sendJoinProjectReq() {
    const notificationInfo = {};
    notificationInfo.project_id = this.props.instrument.project_id;
    notificationInfo.project_owner_id = this.props.projectOwnerId;
    notificationInfo.project_instrument_id = this.props.instrument.id;
    notificationInfo.sender_id = this.props.logedInUserId;
    notificationInfo.sent_to_id = this.props.projectOwnerId;
    notificationInfo.message_text = this.state.joinProjectMsg;
    notificationInfo.unread = true;
    notificationInfo.need_action = true;
    notificationInfo.deleted = false;
    this.props.sendNotification(notificationInfo);
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

    const doImgLink =
      instrument.user_detailes && instrument.user_detailes.avatar;

    const joinDisabled =
      !this.props.userArtTypes ||
      this.props.userArtTypes.find(artType =>
        artType.art_practics.find(
          artPractic =>
            artPractic.art_practic_details.id ===
            instrument.instrument_detailes.id
        )
      ) === undefined;

    const alreadySent =
      this.props.notifications &&
      this.props.notifications.find(
        notification => notification.sender_id === this.props.logedInUserId
      );

    return (
      <div
        className="card card-body bg-light mb-3"
        style={{ minHeight: imgInTop ? "280px" : "190px" }}
      >
        {imgInTop && (
          <div className="text-center">
            {doImgLink ? (
              <Link to={`/profile/${instrument.user_id}`}>{img}</Link>
            ) : (
              <div>{img}</div>
            )}
          </div>
        )}
        <div className="row">
          <div className={imgInTop ? null : "col-3"}>
            {!imgInTop ? (
              doImgLink ? (
                <Link to={`/profile/${instrument.user_id}`}>{img}</Link>
              ) : (
                <div>{img}</div>
              )
            ) : null}
          </div>
          <div className={imgInTop ? "col-5" : "col-4"}>
            <div>
              <strong>{instrument.instrument_detailes.art_practic_name}</strong>
            </div>
            <div style={instrument.user_detailes ? null : { color: "green" }}>
              {instrument.user_detailes ? (
                <Link to={`/profile/${instrument.user_id}`}>
                  {instrument.user_detailes.name}
                </Link>
              ) : (
                "Still open"
              )}
            </div>
          </div>
          <div className={imgInTop ? "col-7" : "col-5"}>
            <div>
              {instrument.role &&
              instrument.user_id &&
              !this.state.moreDetailes ? (
                <div className="mb-2">
                  <strong>Roll: </strong> {instrument.role}
                </div>
              ) : null}
              {instrument.user_detailes &&
              this.props.logedInUserId === instrument.user_detailes.id ? (
                <Link
                  to={`/project/add-instrument/${instrument.id}`}
                  className="btn btn-outline-warning mb-2"
                  style={{ width: "100%" }}
                >
                  Work on it
                </Link>
              ) : null}
              {this.props.projectOwner && !instrument.user_detailes ? (
                <Link
                  to={`/profiles/${instrument.project_id}/${instrument.id}`}
                  className="btn btn-outline-success mb-2"
                  style={{ width: "100%" }}
                >
                  Invite a freind
                </Link>
              ) : null}
              {!this.props.projectOwner && !instrument.user_detailes ? (
                <div>
                  <button
                    type="button"
                    disabled={joinDisabled || alreadySent}
                    className={
                      joinDisabled
                        ? `btn btn btn-success mb-2`
                        : alreadySent
                        ? "btn btn-primary mb-2"
                        : "btn btn-outline-success mb-2"
                    }
                    onClick={this.sendJoinProjectReq}
                    style={{ width: "100%" }}
                  >
                    {alreadySent ? "Already sent" : "Join project"}
                  </button>
                </div>
              ) : null}
              {alreadySent && !this.props.projectOwner && (
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-primary mb-2"
                    onClick={() => {
                      this.props.deleteNotificationsById(
                        this.props.notifications.find(
                          notification =>
                            notification.sender_id === this.props.logedInUserId
                        ).id
                      );
                    }}
                    style={{ width: "100%" }}
                  >
                    Cancle
                  </button>
                </div>
              )}
              {this.props.projectOwner && !instrument.user_detailes ? (
                <button
                  type="button"
                  className="btn btn-outline-primary mb-2"
                  style={{ width: "100%" }}
                  onClick={() => {
                    this.props.updateInstrument(
                      instrument.id,
                      {
                        user_id: this.props.projectOwnerId
                      },
                      this.props.history
                    );
                    this.props.deleteNotificationsByInstrumentId(instrument.id);
                  }}
                >
                  Il'l do it
                </button>
              ) : null}
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
        <div>
          {instrument.comments || (instrument.role && !instrument.user_id) ? (
            <button
              onClick={() =>
                this.setState({
                  moreDetailes: !this.state.moreDetailes
                })
              }
              type="button"
              className="btn btn-light mt-2 float-right "
            >
              {this.state.moreDetailes ? (
                <i className="fas fa-minus" />
              ) : (
                <i className="fas fa-plus" />
              )}
            </button>
          ) : null}

          {this.props.projectOwnerId === this.props.logedInUserId ||
          (instrument.user_detailes &&
            instrument.user_detailes.id === this.props.logedInUserId) ? (
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
                {close => (
                  <InstrumentForm
                    project_id={instrument.project_id}
                    instrument={instrument}
                    close={close}
                  />
                )}
              </Popup>

              <button
                onClick={() => this.onDeleteClick(instrument)}
                type="button"
                className="btn btn-light mt-2 float-right"
              >
                <i className="far fa-trash-alt" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

InstrumentItem.propTypes = {
  updateInstrument: PropTypes.func.isRequired,
  deleteInstrument: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
  deleteNotificationsByInstrumentId: PropTypes.func.isRequired,
  deleteNotificationsById: PropTypes.func.isRequired,

  notification: PropTypes.object,
  instrument: PropTypes.object.isRequired,
  projectOwner: PropTypes.bool,

  projectOwnerId: PropTypes.number,
  logedInUserId: PropTypes.number,
  userArtTypes: PropTypes.array
};

// export default InstrumentItem;
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    updateInstrument,
    deleteInstrument,
    deleteNotificationsByInstrumentId,
    deleteNotificationsById,
    sendNotification
  }
)(InstrumentItem);
