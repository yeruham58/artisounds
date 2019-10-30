import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RangeSlider from "../common/RangeSlider";

import {
  setIsPlaying,
  setIsRecording,
  setRecordsDic,
  setCurrentBolb,
  uploadRecord,
  deleteRecord,
  clearRecord,
  setMasterVolume
} from "../../actions/audioEditorActions";
import Player from "./Player";

class EditorControlBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      isRecording: false,
      currentInstrumentId: window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ],
      volume: 80
    };
    this.clearRecord = this.clearRecord.bind(this);
    this.uploadRecord = this.uploadRecord.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
  }

  clearRecord() {
    const recordsDic = {
      ...this.props.editor.recordsDic,
      [this.state.currentInstrumentId]: {
        duration: null,
        buffer: null
      }
    };
    this.props.setRecordsDic(recordsDic);
    this.props.setCurrentBolb({});
    this.props.clearRecord(true);
  }

  uploadRecord() {
    if (
      this.props.editor.courrentRecordBolb &&
      this.props.editor.courrentRecordBolb.size
    ) {
      const data = new FormData();
      data.append(
        "projectRecord",
        this.props.editor.courrentRecordBolb,
        "some name"
      );
      this.props.uploadRecord(data, this.state.currentInstrumentId);
    } else {
      const recordKey = this.props.recordUrls.find(
        record => record.id === parseInt(this.state.currentInstrumentId)
      ).record_key;
      if (
        recordKey &&
        this.props.editor.courrentRecordBolb &&
        !this.props.editor.courrentRecordBolb.size
      ) {
        this.props.deleteRecord(recordKey, this.state.currentInstrumentId);
      }
    }

    this.props.setCurrentBolb(null);
  }

  onVolumeChange() {
    var slider = document.getElementById("myRangemasterVolumeRange");
    this.setState({ volume: slider.value });
    document.onmouseup = () => {
      this.props.setMasterVolume(slider.value);
      document.onmouseup = null;
    };
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-8">
            <div>
              <button
                type="button"
                className="btn btn-light mb-3 mr-4"
                onClick={() => {
                  window.location.href = `/project/project-view/${this.props.project.project.id}`;
                }}
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
              <button
                type="button"
                className="btn btn-success mb-3 mr-2"
                onClick={this.uploadRecord}
              >
                Save
              </button>
              <div
                style={{
                  width: "150px",
                  float: "right",
                  marginTop: "10px"
                }}
              >
                <RangeSlider
                  disabled={this.props.editor.isPlaying}
                  id="masterVolumeRange"
                  value={this.state.volume}
                  min={0}
                  max={100}
                  onChange={this.onVolumeChange}
                />
              </div>
            </div>
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
  uploadRecord: PropTypes.func.isRequired,
  deleteRecord: PropTypes.func.isRequired,
  clearRecord: PropTypes.func.isRequired,
  setCurrentBolb: PropTypes.func.isRequired,
  setRecordsDic: PropTypes.func.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
  setIsRecording: PropTypes.func.isRequired,
  setMasterVolume: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor,
  project: state.project
});

export default connect(
  mapStateToProps,

  {
    setIsPlaying,
    setIsRecording,
    setRecordsDic,
    setCurrentBolb,
    uploadRecord,
    deleteRecord,
    clearRecord,
    setMasterVolume
  }
)(EditorControlBar);
