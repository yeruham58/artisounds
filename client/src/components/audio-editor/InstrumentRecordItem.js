import React, { Component } from "react";
// import PropTypes from "prop-types";

// import Recorder from "./Recorder";
import RecordCanvas from "./RecordCanvas";

class InstrumentRecordItem extends Component {
  render() {
    return (
      <div>
        <RecordCanvas />
      </div>
    );
  }
}

export default InstrumentRecordItem;
