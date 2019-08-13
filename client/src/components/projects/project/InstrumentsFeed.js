import React, { Component } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";

import InstrumentItem from "./InstrumentItem";

class InstrumentsFeed extends Component {
  render() {
    const instruments = this.props.instruments;

    return instruments.map(instrument => (
      <span className={"col-md-6 col-12 instrument-item"} key={instrument.id}>
        <InstrumentItem
          instrument={instrument}
          notification={
            this.props.notifications
              ? this.props.notifications.find(
                  notification =>
                    notification.project_instrument_id === instrument.id
                )
              : null
          }
          projectOwner={this.props.projectOwner}
          updateInstrument={this.props.updateInstrument}
          deleteInstrument={this.props.deleteInstrument}
          projectOwnerId={this.props.projectOwnerId}
          logedInUserId={this.props.logedInUserId}
          userArtTypes={this.props.userArtTypes}
          sendNotification={this.props.sendNotification}
        />
      </span>
    ));
  }
}

InstrumentsFeed.propTypes = {
  notifications: PropTypes.array,
  instruments: PropTypes.array.isRequired,
  projectOwner: PropTypes.bool,
  projectOwnerId: PropTypes.number.isRequired,
  logedInUserId: PropTypes.number,
  userArtTypes: PropTypes.array,
  updateInstrument: PropTypes.func.isRequired,
  deleteInstrument: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired
};

export default InstrumentsFeed;
// const mapStateToProps = state => ({
//   auth: state.auth
// });

// export default connect(
//   mapStateToProps,
//   {}
// )(InstrumentsFeed);
