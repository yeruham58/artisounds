import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
    ) {
      if (
        !this.props.editor.courrentRecordBolb ||
        window.confirm(
          "Are you sure you wanna change an instrument before saving your changes?"
        )
      ) {
        window.location.href = `/projects/work-zone/${instrument.project_id}/${instrument.id}`;
      }
    }
  }
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
          <div
            key={instrument.id}
            onDoubleClick={() => this.changeInstrument(instrument)}
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

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  {}
)(RecordControlList);
