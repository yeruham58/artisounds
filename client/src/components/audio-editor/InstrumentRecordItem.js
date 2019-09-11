import React, { Component } from "react";
import PropTypes from "prop-types";

import Recorder from "./Recorder";

class InstrumentRecordItem extends Component {
  render() {
    return (
      <div>
        <Recorder
          setAudioFiles={this.props.setAudioFiles}
          movePointer={this.props.movePointer}
        />
      </div>
    );
  }
}

InstrumentRecordItem.propTypes = {
  setAudioFiles: PropTypes.func.isRequired,
  movePointer: PropTypes.func.isRequired
};

export default InstrumentRecordItem;
