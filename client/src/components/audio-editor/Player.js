import React, { Component } from "react";
import { connect } from "react-redux";

class Player extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

    this.state = {
      buffersList: null,
      playingNowList: null,
      audioStartTime:
        this.props.editor.audioStartTime > 0
          ? this.props.editor.audioStartTime
          : 0.00001,
      isPlaying: false,
      volume: 0
    };
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.editor) {
      if (
        nextProp.editor.buffersList &&
        nextProp.editor.buffersList !== this.state.buffersList
      ) {
        this.setState({ buffersList: nextProp.editor.buffersList });
        if (this.state.isPlaying) {
          this.onStop();
          var id = setInterval(() => {
            if (!this.state.playingNowList) {
              this.onPlay();
              clearInterval(id);
            }
          }, 20);
        }
      }

      if (
        nextProp.editor.audioStartTime &&
        nextProp.editor.audioStartTime !== this.state.audioStartTime
      ) {
        this.setState({ audioStartTime: nextProp.editor.audioStartTime });
      }

      if (nextProp.editor.isPlaying && !this.state.isPlaying) {
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
  }

  onPlay() {
    for (var buffer of this.props.editor.buffersList) {
      const pointerLeftPx = this.props.pointerRef.current.offsetLeft;
      const audioStartTime = this.props.editor.secondsPerPx * pointerLeftPx;
      const { duration } = buffer.buffer;
      if (duration > audioStartTime) {
        buffer.start(
          0, // how much time from now it will start,
          audioStartTime,
          duration - audioStartTime
        );
      }
    }
    this.setState({ playingNowList: this.props.editor.buffersList });
  }

  onStop() {
    for (var buffer of this.state.playingNowList) {
      try {
        buffer.stop();
      } catch (err) {
        console.log("audio is not playing");
      }
    }
    this.setState({ playingNowList: null });
  }

  render() {
    return (
      <div>
        <div id="audio_player">
          <canvas
            ref={this.canvasRef}
            id="analyser_render"
            style={{
              width: "100%",
              height: "70px",
              background: "#002D3C",
              float: "left",
              marginBottom: "50px"
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  {}
)(Player);
