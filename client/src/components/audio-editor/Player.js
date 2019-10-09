import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { setIsPlaying } from "../../actions/audioEditorActions";

// import range from "../common/RangeSlider";

class Player extends Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.canvasRef = React.createRef();

    this.state = {
      currentAudio: null,
      audioStartTime:
        this.props.editor.audioStartTime > 0
          ? this.props.editor.audioStartTime
          : 0,
      analyser: null,
      canvas: null,
      ctx: null
    };

    this.frameLooper = this.frameLooper.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.editor) {
      this.setState({ currentAudio: nextProp.editor.audioBuffer });
      if (nextProp.editor.audioBuffer) {
        this.initPlayer(nextProp.editor.audioBuffer);
      }
    }

    if (nextProp.editor && nextProp.editor.audioStartTime) {
      this.setState({ audioStartTime: nextProp.editor.audioStartTime });
    }
  }

  // Initialize the player after the page loads all of its HTML into the window
  initPlayer(newAudio) {
    if (newAudio.context) {
      const context = newAudio.context;
      const analyser = context.createAnalyser();
      newAudio.connect(analyser);
      analyser.connect(context.destination);

      newAudio.loop = false;
      newAudio.onended = () => {
        this.props.setIsPlaying(false);
      };
      const canvas = document.getElementById("analyser_render");
      const ctx = canvas.getContext("2d");
      this.setState({
        analyser,
        canvas,
        ctx
      });
    }
  }

  // frameLooper() animates any style of graphics you wish to the audio frequency
  // Looping at the default frame rate that the browser provides(approx. 60 FPS)
  frameLooper() {
    let fbc_array, bars, bar_x, bar_width, bar_height;
    const { ctx, canvas, analyser } = this.state;
    if (this.props.editor.isPlaying) {
      // Establish all variables that your Analyser will use
      window.requestAnimationFrame(this.frameLooper);
      if (analyser && ctx && canvas) {
        fbc_array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(fbc_array);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.fillStyle = "#00CCFF"; // Color of the bars
        bars = 100;
        for (var i = 0; i < bars; i++) {
          bar_x = i * 3;
          bar_width = 2;
          bar_height = -(fbc_array[i] / 2);
          //  fillRect( x, y, width, height ) // Explanation of the parameters below
          ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
        }
      }
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      return;
    }
  }

  onPlay() {
    this.props.setIsPlaying(true);
    setTimeout(() => {
      const { currentAudio, audioStartTime } = this.state;
      const { duration } = currentAudio.buffer;
      if (currentAudio.buffer.duration > audioStartTime) {
        currentAudio.start(
          // currentAudio.context.currentTime + 0, // how much time from now it will start,
          0, // how much time from now it will start,
          audioStartTime,
          duration - audioStartTime - currentAudio.context.currentTime > 0
            ? duration - audioStartTime - currentAudio.context.currentTime
            : duration - audioStartTime
        );
      }
      this.frameLooper();
    }, 500);
  }

  onStop() {
    try {
      this.state.currentAudio.stop();
    } catch (err) {
      console.log("audio is not playing");
    }

    this.props.setIsPlaying(false);
  }

  render() {
    return (
      <div>
        <div
          id="audio_player"
          style={{
            background: "#000",
            padding: "5px"
          }}
        >
          <canvas
            ref={this.canvasRef}
            id="analyser_render"
            style={{
              width: "100%",
              height: "70px",
              background: "#002D3C",
              float: "left"
            }}
          />
          <button onClick={this.onPlay} disabled={!this.state.currentAudio}>
            play
          </button>
          <button onClick={this.onStop} disabled={!this.props.editor.isPlaying}>
            stop
          </button>
        </div>
      </div>
    );
  }
}

Player.propTypes = {
  setIsPlaying: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  { setIsPlaying }
)(Player);
