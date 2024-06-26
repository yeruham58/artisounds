import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getLongestDuration } from "./setPlayerTracks";
import {
  setIsPlaying,
  setPlayingNowList,
  setAudioStartTime,
  clearEditor,
} from "../../actions/audioEditorActions";

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buffersList: null,
      // playingNowList: this.props.editor.playingNowList,
      audioStartTime:
        this.props.editor.audioStartTime > 0
          ? this.props.editor.audioStartTime
          : 0.00001,
      // isPlaying: this.props.editor.isPlaying,
      isPlaying: false,
      volume: 0,
      startSec: 0,
      allowChangeTime: false,
      // allowChangeTime: this.props.editor.isPlaying,
      intervalsIdList: [],
    };
  }

  componentWillMount() {
    if (this.props.buffersList) {
      this.setState({ buffersList: this.props.buffersList });
    }
  }

  componentWillUnmount() {
    if (this.state.isPlaying) {
      this.onStop();
      this.props.setAudioStartTime({
        audioStartTime: this.state.audioStartTime,
        allowChangeTime: true,
      });
    }

    for (var inter of this.state.intervalsIdList) {
      clearInterval(inter);
    }
    this.props.setAudioStartTime(0);
    this.props.setIsPlaying(false);
    this.props.clearEditor();
  }

  componentWillReceiveProps(nextProp) {
    const changeOfPlayerInEditor =
      nextProp.editor.buffersList &&
      nextProp.editor.buffersList !== this.state.buffersList &&
      !nextProp.buffersList;

    const changeOfPlayerInProject =
      nextProp.buffersList &&
      nextProp.buffersList !== this.state.buffersList &&
      nextProp.editor.isPlaying === this.props.projectId;

    if (changeOfPlayerInEditor || changeOfPlayerInProject) {
      const buffersList = changeOfPlayerInEditor
        ? nextProp.editor.buffersList
        : nextProp.buffersList;

      this.setState({
        buffersList,
      });
      // if (nextProp.editor.allowChangeTime) {
      if (this.state.allowChangeTime) {
        this.setState({
          audioStartTime: this.props.editor.audioStartTime,
        });
      }
      if (this.state.isPlaying) {
        setTimeout(() => {
          this.stopAndPlayNew();
        }, 20);
      }
    }
    if (
      nextProp.editor.isPlaying &&
      !this.state.isPlaying &&
      !nextProp.editor.playingNowList &&
      (nextProp.editor.isPlaying === this.props.projectId ||
        this.props.pointerRef)
    ) {
      this.setState({ isPlaying: true });
      //time out is for current audio to update
      setTimeout(() => {
        this.onPlay();
      }, 100);
    }
    if (!nextProp.editor.isPlaying && this.state.isPlaying) {
      this.setState({ isPlaying: false });
      this.onStop();
    }
  }

  stopAndPlayNew() {
    this.onStop();
    var id = setInterval(() => {
      if (!this.props.editor.playingNowList) {
        this.onPlay();
        clearInterval(id);
      }
    }, 20);
  }

  countTime(startSec) {
    const duration = getLongestDuration(this.state.buffersList);
    let seconds = startSec;
    const id = setInterval(() => {
      if (
        !this.state.isPlaying ||
        this.state.startSec !== startSec ||
        this.state.allowChangeTime
        // !this.props.editor.playingNowList
      ) {
        clearInterval(id);
      } else {
        this.setState({ audioStartTime: seconds });
        seconds += 0.1;
        if (seconds > duration && !this.props.pointerRef) {
          seconds = 0.00001;
          this.props.setIsPlaying(false);
          this.props.setAudioStartTime({ audioStartTime: 0.0001 });
        }
      }
    }, 100);
    const stateIntervals = this.state.intervalsIdList;
    stateIntervals.push(id);
    this.setState({ intervalsIdList: stateIntervals });
  }

  onPlay() {
    this.setState({
      allowChangeTime: false,
      intervalsIdList: [],
    });
    this.props.setPlayingNowList(this.state.buffersList);

    for (var buffer of this.state.buffersList) {
      let { audioStartTime } = this.state;
      if (this.props.pointerRef) {
        const pointerLeftPx = this.props.pointerRef.current.offsetLeft;
        audioStartTime = this.props.editor.secondsPerPx * pointerLeftPx;
      }
      this.setState({ startSec: audioStartTime });
      this.countTime(audioStartTime);
      const { duration } = buffer.buffer;

      if (duration > audioStartTime) {
        buffer.start(
          0, // how much time from now it will start,
          audioStartTime,
          duration - audioStartTime
        );
      }
    }
  }

  onStop() {
    var id = setInterval(() => {
      if (this.props.editor.playingNowList) {
        clearInterval(id);
        for (var buffer of this.props.editor.playingNowList) {
          try {
            buffer.stop();
          } catch (err) {
            console.log("audio is not playing");
          }
        }
        this.setState({ playingNowList: null });
        this.props.setPlayingNowList(null);
      }
    }, 20);
  }

  onTimeCange() {
    if (this.state.isPlaying) {
      this.setState({ allowChangeTime: true });
    }

    var slider = document.getElementById("timeControl" + this.props.projectId);
    this.setState({ audioStartTime: slider.value / 10 });

    setTimeout(() => {
      document.onmouseup = () => {
        this.props.setAudioStartTime({
          audioStartTime: slider.value / 10,
          allowChangeTime: true,
        });

        document.onmouseup = null;
      };
    }, 20);
  }

  getTimeFormat(duration) {
    const min = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${min}:${Math.floor(seconds / 1)}`;
  }

  render() {
    const duration = getLongestDuration(this.state.buffersList);
    const durationTime = this.getTimeFormat(duration);
    const seconds = this.getTimeFormat(this.state.audioStartTime);
    return (
      <div
        style={{
          background: "#343a40",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div className="row">
          <div className="col-2" style={{ paddingRight: "0px" }}>
            <strong
              style={{ color: "red", marginLeft: "5px", fontSize: "12px" }}
            >
              {seconds}
            </strong>
          </div>
          <div className="col-8" style={{ color: "red" }}>
            <input
              disabled={this.props.pointerRef}
              value={this.state.audioStartTime * 10}
              type="range"
              id={"timeControl" + this.props.projectId}
              min={0}
              max={Math.floor(duration / 1) * 10}
              onChange={this.onTimeCange.bind(this)}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-2">
            <strong
              style={{
                color: "red",
                marginRight: "5px",
                fontSize: "12px",
                position: "relative",
                right: "5px",
              }}
            >
              {durationTime}
            </strong>
          </div>
        </div>
      </div>
    );
  }
}

Player.propTypes = {
  setIsPlaying: PropTypes.func.isRequired,
  clearEditor: PropTypes.func.isRequired,
  setPlayingNowList: PropTypes.func.isRequired,
  setAudioStartTime: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.audioEditor,
});

export default connect(
  mapStateToProps,

  { setIsPlaying, setPlayingNowList, setAudioStartTime, clearEditor }
)(Player);
