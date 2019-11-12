import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RangeSlider from "../../common/RangeSlider";
import {
  setBuffersList,
  setRecordsDic
} from "../../../actions/audioEditorActions";
import {
  setIsPlaying,
  setMasterVolume
} from "../../../actions/audioEditorActions";
import {
  initAudioDic,
  initBuffersList
} from "../../audio-editor/setPlayerTracks";
import Player from "../../audio-editor/Player";

class ProjectAudioControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      volume: 80,
      recordsDic: null
    };

    this.onVolumeChange = this.onVolumeChange.bind(this);
  }

  componentDidMount() {
    const { instruments } = this.props.project;
    const recordsDic = initAudioDic(instruments);
    this.props.setRecordsDic(recordsDic);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.editor.recordsDic !== this.state.recordsDic) {
      this.setState({
        recordsDic: nextProp.editor.recordsDic
      });
      // this timeout is for state to update in reload page
      setTimeout(() => {
        this.initBuffersList(nextProp.editor.masterVolume);
      }, 20);
    }
    if (nextProp.editor.audioStartTime !== this.state.audioStartTime) {
      this.setState({ audioStartTime: nextProp.editor.audioStartTime });
      setTimeout(() => {
        this.initBuffersList(nextProp.editor.masterVolume);
      }, 20);
    }
    if (nextProp.editor.masterVolume !== this.state.masterVolume) {
      this.setState({ masterVolume: nextProp.editor.masterVolume });
      this.initBuffersList(nextProp.editor.masterVolume);
    }
    if (nextProp.editor.isPlaying && !this.state.isPlaying) {
      this.setState({ isPlaying: true });
    }
    if (!nextProp.editor.isPlaying && this.state.isPlaying) {
      this.initBuffersList(nextProp.editor.masterVolume);
      this.setState({ isPlaying: false });
    }
  }

  initBuffersList(masterVolume) {
    const { recordsDic } = this.props.editor;
    //Not working without time outwhen loading page, I have to understend why
    setTimeout(() => {
      const buffersList = initBuffersList(recordsDic, masterVolume);
      this.props.setBuffersList(buffersList);
    }, 500);
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
                disabled={this.state.isPlaying}
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

              {/* stop */}
              <button
                type="button"
                className="btn btn-light mb-2 mt-2 ml-2 text-warning"
                disabled={!this.state.isPlaying}
                onClick={() => {
                  this.props.setIsPlaying(false);
                  this.setState({ isPlaying: false });
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
                id="masterVolumeRange"
                value={this.state.volume}
                min={0}
                max={100}
                onChange={this.onVolumeChange}
              />
            </div>
          </div>
        </div>

        <div>
          <Player projectId={this.props.project.id} />
        </div>
      </div>
    );
  }
}

ProjectAudioControls.propTypes = {
  setIsPlaying: PropTypes.func.isRequired,
  setMasterVolume: PropTypes.func.isRequired,
  setBuffersList: PropTypes.func.isRequired,
  setRecordsDic: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired
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
    setRecordsDic
  }
)(ProjectAudioControls);
