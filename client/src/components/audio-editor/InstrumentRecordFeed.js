import React, { Component } from "react";
import PropTypes from "prop-types";
import RecordCanvas from "./RecordCanvas";

class InstrumentRecordFeed extends Component {
  render() {
    const instruments = this.props.instruments;

    return instruments.map(
      instrument =>
        (instrument.record_url ||
          instrument.id ===
            parseInt(
              window.location.href.split("/")[
                window.location.href.split("/").length - 1
              ]
            )) && (
          <div key={instrument.id}>
            <div>
              <RecordCanvas instrument={instrument} />
            </div>
          </div>
        )
    );
  }
}

InstrumentRecordFeed.propTypes = {
  instruments: PropTypes.array.isRequired
};

export default InstrumentRecordFeed;
