import React, { Component } from "react";
import PropTypes from "prop-types";

// import Player from "./Player";

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null,
      audioUrl: null,
      audioBlob: null,
      audioChunks: null
    };

    this.startRecord = this.startRecord.bind(this);
  }

  startRecord() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder = mediaRecorder;
      this.mediaRecorder.start();
      this.props.movePointer(true);

      const audioChunks = this.state.audioBlob ? this.state.audioChunks : [];
      this.mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
        this.setState({ audioChunks });
      });

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        this.props.setAudioFiles(audioBlob);
        // const audio = new Audio(audioUrl);
        // audio.controls = true;
        this.setState({
          // audio,
          audioBlob,
          audioUrl
        });
      });
    });
  }

  render() {
    return (
      <div>
        {/* <div>audioChunks:</div> */}
        <div>
          {this.state.audioChunks ? this.state.audioChunks.length : null}
        </div>
        <button onClick={this.startRecord}>start</button>
        <button
          onClick={() => {
            this.mediaRecorder.stop();
            this.props.movePointer(false);
          }}
        >
          stop
        </button>
        <button
          onClick={() => {
            // this.state.audio.play();
            // this.setState({ audioBlob: null });
            this.setState({ audioChunks: [] });
          }}
        >
          clear record
          {/* play */}
        </button>
        {/* {this.state.audioBlob && <Player audio={this.state.audio} />} */}
      </div>
    );
  }
}

Recorder.propTypes = {
  setAudioFiles: PropTypes.func.isRequired,
  movePointer: PropTypes.func.isRequired
};

export default Recorder;
