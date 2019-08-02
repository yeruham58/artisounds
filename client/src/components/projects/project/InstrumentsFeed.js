import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import InstrumentItem from "./InstrumentItem";

class InstrumentsFeed extends Component {
  render() {
    const instruments = this.props.instruments;

    return instruments.map(instrument => (
      <div
        className="col-md-4 col-lg-3 col-6 instrument-item"
        key={instrument.id}
      >
        <InstrumentItem instrument={instrument} />
      </div>
    ));
  }
}

InstrumentsFeed.propTypes = {
  instruments: PropTypes.array.isRequired
};

// export default ProjectFeed;
const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
  // project: state.project
});

export default connect(
  mapStateToProps,
  {}
)(InstrumentsFeed);
