import React, { Component } from "react";
import PropTypes from "prop-types";

import RecordControlItem from "./RecordControlItem";

class RecordControlList extends Component {
  changeInstrument(instrument) {
    const currentInstrument = parseInt(
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    );
    if (
      instrument.user_id === this.props.userId &&
      instrument.id !== currentInstrument
    )
      window.location.href = `/projects/work-zone/${instrument.project_id}/${instrument.id}`;
  }
  render() {
    const instruments = this.props.instruments;
    return instruments.map(
      instrument =>
        instrument.user_detailes && (
          <div
            key={instrument.id}
            onClick={() => this.changeInstrument(instrument)}
          >
            <div>
              <RecordControlItem instrument={instrument} />
            </div>
          </div>
        )
    );
  }
}

RecordControlList.propTypes = {
  instruments: PropTypes.array.isRequired,
  userId: PropTypes.number.isRequired
};

export default RecordControlList;
