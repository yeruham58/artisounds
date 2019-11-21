import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RangeSlider from "../../common/RangeSlider";
import {
  setBuffersList,
  setIsPlaying,
  setMasterVolume,
  setRecordsDic,
  clearEditor
} from "../../../actions/audioEditorActions";
import { initBuffersList } from "../../audio-editor/setPlayerTracks";
import Player from "../../audio-editor/Player";

class ProjectAudioControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      volume: this.props.editor.masterVolume,
      // masterVolume: this.props.editor.masterVolume,
      masterVolume: null,
      // recordsDic: null,
      buffersList: null,
      audioStartTime: this.props.editor.audioStartTime
    };

    this.onVolumeChange = this.onVolumeChange.bind(this);
    this.initBuffersList = this.initBuffersList.bind(this);
  }

  componentDidMount() {
    const { recordsDic } = this.props;
    this.recordsDic = recordsDic;

    let buffersList = [];

    const id = setInterval(() => {
      if (buffersList[0]) {
        setTimeout(() => {
          this.props.setMasterVolume(80);
        }, 500);

        clearInterval(id);
      } else {
        buffersList = initBuffersList(
          recordsDic,
          this.props.editor.masterVolume
        );
      }
    }, 20);
  }

  componentWillUnmount() {
    this.props.clearEditor();
  }

  componentWillReceiveProps(nextProp) {
    if (
      nextProp.editor.isPlaying === nextProp.projectId ||
      !this.props.editor.isPlaying
    ) {
      if (nextProp.editor.masterVolume !== this.state.masterVolume) {
        this.setState({ masterVolume: nextProp.editor.masterVolume });
        this.initBuffersList(nextProp.editor.masterVolume);
      }
      if (nextProp.editor.audioStartTime !== this.state.audioStartTime) {
        this.setState({ audioStartTime: nextProp.editor.audioStartTime });
        setTimeout(() => {
          this.initBuffersList(nextProp.editor.masterVolume);
        }, 20);
      }

      if (nextProp.editor.isPlaying && !this.state.isPlaying) {
        this.setState({ isPlaying: true });
      }

      if (!nextProp.editor.isPlaying && this.state.isPlaying) {
        this.setState({ isPlaying: false });
        this.initBuffersList(nextProp.editor.masterVolume);
      }
    }
  }

  initBuffersList(masterVolume) {
    const recordsDic = this.recordsDic;

    //Not working without time out when loading page, I have to understend why
    setTimeout(() => {
      const buffersList = initBuffersList(recordsDic, masterVolume);
      this.setState({ buffersList });
    }, 500);
  }

  onVolumeChange() {
    var slider = document.getElementById(
      "myRangemasterVolumeRange" + this.props.projectId
    );
    this.setState({ volume: slider.value });
    document.onmouseup = () => {
      this.props.setMasterVolume(slider.value);
      document.onmouseup = null;
    };
  }

  onPlay() {
    var slider = document.getElementById(
      "myRangemasterVolumeRange" + this.props.projectId
    );
    var timeOut = 0;
    if (this.props.editor.masterVolume.toString() !== slider.value) {
      this.setState({ volume: slider.value });
      this.props.setMasterVolume(slider.value);
      timeOut = 500;
    }

    if (this.props.editor.isPlaying) {
      this.props.setIsPlaying(false);
      timeOut = 1000;
    }

    var id = setInterval(() => {
      if (
        this.props.editor.masterVolume.toString() === slider.value &&
        !this.props.editor.isPlaying
      ) {
        clearInterval(id);
        setTimeout(() => {
          this.props.setIsPlaying(this.props.projectId);
        }, timeOut);
      }
    }, 10);
  }

  render() {
    return (
      <div
        style={{
          background: "white",
          maxWidth: "400px",
          minHeight: "55px",
          marginBottom: "8px",
          width: "100%"
        }}
      >
        <div className="row">
          <div className="col-6">
            <span>
              {/* play  */}
              <button
                type="button"
                className="btn btn-light mb-2 mt-2 ml-2 text-success"
                disabled={
                  this.props.editor.isPlaying === this.props.projectId ||
                  !this.state.buffersList
                }
                onClick={this.onPlay.bind(this)}
              >
                <i className="fas fa-play"></i>
              </button>

              {/* stop */}
              <button
                type="button"
                className="btn btn-light mb-2 mt-2 ml-2 text-warning"
                disabled={this.props.editor.isPlaying !== this.props.projectId}
                onClick={() => {
                  this.props.setIsPlaying(false);
                }}
              >
                <i className="fas fa-stop"></i>
              </button>
            </span>
          </div>
          <div className="col-6">
            <div
              style={{
                width: "100%",
                marginTop: "18px"
              }}
            >
              <RangeSlider
                className="masterVolumeRange"
                id={"masterVolumeRange" + this.props.projectId}
                value={this.state.volume}
                // value={this.state.volume}
                min={0}
                max={100}
                onChange={this.onVolumeChange}
              />
            </div>
          </div>
        </div>

        <div>
          {this.state.buffersList && this.state.buffersList[0] && (
            <Player
              projectId={this.props.projectId}
              buffersList={this.state.buffersList}
            />
          )}
        </div>
      </div>
    );
  }
}

ProjectAudioControls.propTypes = {
  setIsPlaying: PropTypes.func.isRequired,
  clearEditor: PropTypes.func.isRequired,
  setMasterVolume: PropTypes.func.isRequired,
  setBuffersList: PropTypes.func.isRequired,
  setRecordsDic: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  {
    setIsPlaying,
    setMasterVolume,
    setBuffersList,
    setRecordsDic,
    clearEditor
  }
)(ProjectAudioControls);
