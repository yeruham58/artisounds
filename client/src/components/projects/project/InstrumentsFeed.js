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
          projectOwner={this.props.projectOwner}
          updateInstrument={this.props.updateInstrument}
          projectOwnerId={this.props.projectOwnerId}
          logedInUserId={this.props.logedInUserId}
        />
      </span>
    ));
  }
}

InstrumentsFeed.propTypes = {
  instruments: PropTypes.array.isRequired,
  projectOwner: PropTypes.bool.isRequired,
  projectOwnerId: PropTypes.number.isRequired,
  logedInUserId: PropTypes.number.isRequired,
  updateInstrument: PropTypes.func.isRequired
};

export default InstrumentsFeed;
// const mapStateToProps = state => ({
//   auth: state.auth
// });

// export default connect(
//   mapStateToProps,
//   {}
// )(InstrumentsFeed);
