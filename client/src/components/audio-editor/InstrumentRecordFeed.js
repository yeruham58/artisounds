import React, { Component } from "react";
import PropTypes from "prop-types";

import InstrumentRecordItem from "./InstrumentRecordItem";

class InstrumentRecordFeed extends Component {
  render() {
    const instruments = this.props.instruments;

    return instruments.map(instrument => (
      <span key={instrument.id}>
        <InstrumentRecordItem
          instrument={instrument}
          clearRecord={this.props.clearRecord}
        />
      </span>
    ));
  }
}

InstrumentRecordFeed.propTypes = {
  instruments: PropTypes.array.isRequired,
  clearRecord: PropTypes.func.isRequired
};

export default InstrumentRecordFeed;
