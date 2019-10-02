import React, { Component } from "react";
import PropTypes from "prop-types";

import Recorder from "./Recorder";
import RecordCanvas from "./RecordCanvas";

class InstrumentRecordItem extends Component {
  render() {
    return (
      <div>
        <Recorder clearRecord={this.props.clearRecord} />
        <RecordCanvas />
      </div>
    );
  }
}

InstrumentRecordItem.propTypes = {
  clearRecord: PropTypes.func.isRequired
};

export default InstrumentRecordItem;
