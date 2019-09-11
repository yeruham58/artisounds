import React, { Component } from "react";
import PropTypes from "prop-types";

// import range from "../common/RangeSlider";

class Player extends Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.canvasRef = React.createRef();

    this.state = {
      currentAudio: this.props.audio,
      isPlaing: false,
      analyser: this.props.analyser,
      canvas: null,
      ctx: null
    };

    this.frameLooper = this.frameLooper.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  componentDidMount() {
    this.initPlayer(this.props.audio);
  }

  componentWillReceiveProps(nextProp) {
    if (
      nextProp.audio &&
      nextProp.audio !== this.state.currentAudio &&
      this.state.currentAudio
    ) {
      this.setState({
        currentAudio: nextProp.audio,
        analyser: nextProp.analyser
      });

      this.initPlayer(nextProp.audio);
    }
  }

  // Initialize the player after the page loads all of its HTML into the window
  initPlayer(newAudio) {
    newAudio.loop = false;
    newAudio.onended = () => {
      this.setState({
        isPlaing: false
      });
      this.props.setAudioFiles(null);
      this.props.movePointer(false);
    };
    const canvas = document.getElementById("analyser_render");
    const ctx = canvas.getContext("2d");
    this.setState({
      canvas,
      ctx
    });
  }

  // frameLooper() animates any style of graphics you wish to the audio frequency
  // Looping at the default frame rate that the browser provides(approx. 60 FPS)
  frameLooper() {
    // console.log("currentTime");
    // console.log(this.state.currentAudio.context.currentTime);
    // if (
    //   this.state.currentAudio.context.currentTime >=
    //   this.state.currentAudio.buffer.duration
    // ) {
    //   // this.state.currentAudio.context.currentTime = 0;
    // }
    let fbc_array, bars, bar_x, bar_width, bar_height;
    const { ctx, canvas, analyser } = this.state;
    if (this.state.isPlaing) {
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
    this.setState({ isPlaing: true });
    setTimeout(() => {
      this.state.currentAudio
        .start
        // this.state.currentAudio.context.currentTime + 4,
        // 2,
        // this.state.currentAudio.buffer.duration - 2
        ();
      this.frameLooper();
      this.props.movePointer(true);
    }, 500);
  }

  onStop() {
    this.state.currentAudio.stop();
    this.setState({ isPlaing: false });
    this.props.setAudioFiles(null);
    this.props.movePointer(false);
  }

  render() {
    return (
      <div>
        <div
          id="audio_player"
          style={{
            width: "500px",
            height: "100px",
            background: "#000",
            padding: "5px",
            margin: "50px auto"
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
          <button onClick={this.onPlay}>play</button>
          <button onClick={this.onStop}>stop</button>
        </div>
      </div>
    );
  }
}

Player.propTypes = {
  audio: PropTypes.object.isRequired,
  analyser: PropTypes.object.isRequired,
  setAudioFiles: PropTypes.func.isRequired,
  movePointer: PropTypes.func.isRequired
};

export default Player;
