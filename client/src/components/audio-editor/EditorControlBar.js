import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  setIsPlaying,
  setIsRecording,
  setRecordsDic
} from "../../actions/audioEditorActions";
import Player from "./Player";

class EditorControlBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      isRecording: false
    };
    this.clearRecord = this.clearRecord.bind(this);
  }

  clearRecord() {
    const recordsDic = {
      ...this.props.editor.recordsDic,
      [window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]]: {
        duration: null,
        buffer: null
      }
    };
    this.props.setRecordsDic(recordsDic);
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-8">
            <button
              type="button"
              className="btn btn-light mb-3 mr-4"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            {/* play  */}
            <button
              type="button"
              className="btn btn-light mb-3 mr-2 text-success"
              disabled={this.state.isPlaying || this.state.isRecording}
              onClick={() => {
                this.props.setIsPlaying(true);
                this.setState({ isPlaying: true });
              }}
            >
              <i className="fas fa-play"></i>
            </button>
            {/* record */}
            <button
              type="button"
              className="btn btn-light mb-3 mr-2 text-danger"
              disabled={this.state.isPlaying || this.state.isRecording}
              onClick={() => {
                this.props.setIsRecording(true);
                this.setState({ isRecording: true });
              }}
            >
              <i className="fas fa-circle"></i>
            </button>
            {/* stop */}
            <button
              type="button"
              className="btn btn-light mb-3 mr-2 text-warning"
              disabled={!this.state.isPlaying && !this.state.isRecording}
              onClick={() => {
                this.props.setIsPlaying(false);
                this.props.setIsRecording(false);
                this.setState({ isPlaying: false, isRecording: false });
              }}
            >
              <i className="fas fa-stop"></i>
            </button>
            <button
              type="button"
              className="btn btn-light mb-3 mr-2"
              onClick={this.clearRecord}
            >
              Clear record
            </button>
          </div>
          <div className="col-md-4">
            <Player />
          </div>
        </div>
      </div>
    );
  }
}

EditorControlBar.propTypes = {
  setRecordsDic: PropTypes.func.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
  setIsRecording: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  { setIsPlaying, setIsRecording, setRecordsDic }
)(EditorControlBar);
