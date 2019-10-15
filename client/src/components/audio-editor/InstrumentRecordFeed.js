import React, { Component } from "react";
import PropTypes from "prop-types";

// import InstrumentRecordItem from "./InstrumentRecordItem";
import RecordCanvas from "./RecordCanvas";

class InstrumentRecordFeed extends Component {
  render() {
    const instruments = this.props.instruments;

    return instruments.map(instrument => (
      <span key={instrument.id}>
        <RecordCanvas instrument={instrument} />
      </span>
    ));
  }
}

InstrumentRecordFeed.propTypes = {
  instruments: PropTypes.array.isRequired
};

export default InstrumentRecordFeed;
