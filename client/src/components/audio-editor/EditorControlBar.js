import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RangeSlider from "../common/RangeSlider";
import { updateInstrument } from "../../actions/projectActions";

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
import Metronome from "../common/Metronome";

class EditorControlBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      isRecording: false,
      currentInstrumentId: this.props.editor.currentRecordId,
      volume: 80,
      headphonesMood: true,
      playMetronome: true,
      active1234: true,
      projectBit: parseInt(this.props.project.project.bit.split("/")[0]),
      projectTempo: this.props.project.project.tempo
    };

    this.clearRecord = this.clearRecord.bind(this);
    this.uploadRecord = this.uploadRecord.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
  }

  clearRecord() {
    const recordsDic = {
      ...this.props.editor.recordsDic,
      [this.state.currentInstrumentId]: {
        ...this.props.editor.recordsDic[this.state.currentInstrumentId],
        duration: null,
        buffer: null
      }
    };

    this.props.setRecordsDic(recordsDic);
    this.props.setCurrentBolb({});
    this.props.clearRecord(true);
  }

  uploadRecord() {
    const volume = this.props.editor.recordsDic[this.state.currentInstrumentId]
      .volume;
    const oldVolume = this.props.project.project.instruments.find(
      instru => instru.id === this.state.currentInstrumentId
    ).volume;

    if (volume !== oldVolume) {
      this.props.updateInstrument(
        this.state.currentInstrumentId,
        { volume },
        ""
      );
    }

    if (
      this.props.editor.courrentRecordBolb &&
      this.props.editor.courrentRecordBolb.size
    ) {
      const data = new FormData();
      data.append(
        "projectRecord",
        this.props.editor.courrentRecordBolb,
        this.props.project.project.name
      );
      this.props.uploadRecord(data, this.state.currentInstrumentId);
    } else {
      const recordKey = this.props.record_key;
      if (
        recordKey &&
        this.props.editor.courrentRecordBolb &&
        !this.props.editor.courrentRecordBolb.size
      ) {
        this.props.deleteRecord(recordKey, this.state.currentInstrumentId);
      }
    }

    // this.props.setCurrentBolb(null);
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
    const currentRecordObj = this.props.editor.recordsDic[
      this.state.currentInstrumentId
    ];
    const currentDuration =
      currentRecordObj &&
      currentRecordObj.duration &&
      this.props.editor.isRecording
        ? currentRecordObj.duration
        : this.props.editor.audioStartTime;
    const secondsPerBit = this.props.editor.secondsPerBit;
    const waitingTime =
      currentDuration % secondsPerBit > 0
        ? (secondsPerBit - (currentDuration % secondsPerBit)) * 1000
        : 0;

    return (
      <div>
        <div>
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
                const waitingTime = (60 / this.state.projectTempo) * 1000;
                setTimeout(() => {
                  this.props.setIsPlaying(true);
                }, waitingTime);

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
                const waitingTime = (60 / this.state.projectTempo) * 1000;
                const waitBeforeRecord = this.state.active1234
                  ? waitingTime * (this.state.projectBit + 1)
                  : waitingTime;
                this.setState({
                  isRecording: true
                });
                setTimeout(() => {
                  if (this.state.isRecording) {
                    this.props.setIsRecording(true);
                    this.props.setIsPlaying(this.state.headphonesMood);
                  }
                }, waitBeforeRecord);

                this.setState({
                  isRecording: true,
                  isPlaying: this.state.headphonesMood
                });
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
            {/* headphones mood control */}
            <button
              type="button"
              className="btn btn-light mb-3 mr-2"
              style={{
                color: this.state.headphonesMood ? "#D2691E" : "grey"
              }}
              onClick={() => {
                this.setState({ headphonesMood: !this.state.headphonesMood });
              }}
            >
              <i className="fas fa-headphones-alt"></i>
            </button>
            <button
              type="button"
              className="btn btn-light mb-3 mr-2"
              onClick={this.clearRecord}
            >
              Clear record
            </button>
            {/* metronome controle */}
            <button
              type="button"
              className={`btn ${
                this.state.active1234 ? "btn-warning" : "btn-secondary"
              } mb-3 mr-2`}
              onClick={() =>
                this.setState({ active1234: !this.state.active1234 })
              }
            >
              <span style={{ fontSize: "8px" }}>1</span>
              <span style={{ fontSize: "10px" }}>2</span>
              <span style={{ fontSize: "12px" }}>3</span>
              <span style={{ fontSize: "14px" }}>4</span>
            </button>
            <button
              type="button"
              className={`btn ${
                this.state.playMetronome ? "btn-warning" : "btn-secondary"
              } mb-3 mr-2`}
              onClick={() =>
                this.setState({ playMetronome: !this.state.playMetronome })
              }
            >
              <i className="fas fa-thermometer"></i>
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
                marginTop: "10px",
                position: "relative",
                right: "20px"
              }}
            >
              <RangeSlider
                id="masterVolumeRange"
                value={this.state.volume}
                min={0}
                max={100}
                onChange={this.onVolumeChange}
              />
            </div>
          </div>
          <Metronome
            play={
              this.state.playMetronome &&
              (this.state.isPlaying || this.state.isRecording)
            }
            bitsPerMin={this.props.project.project.tempo}
            waitingTime={waitingTime}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: "35px",
            width: "100%",
            maxWidth: "400px",
            float: "right"
          }}
        >
          <Player
            pointerRef={this.props.pointerRef}
            projectId={this.props.project.project.id}
          />
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
  setMasterVolume: PropTypes.func.isRequired,
  record_key: PropTypes.string,
  updateInstrument: PropTypes.func.isRequired
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
    setMasterVolume,
    updateInstrument
  }
)(EditorControlBar);
