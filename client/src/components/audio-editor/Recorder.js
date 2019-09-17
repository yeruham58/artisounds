import React, { Component } from "react";
import PropTypes from "prop-types";

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
      this.props.movePointer(true, true);

      const audioChunks = this.state.audioBlob ? this.state.audioChunks : [];
      this.mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
        this.setState({ audioChunks });
      });

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        this.props.setAudioFiles(audioBlob);
        this.setState({
          audioBlob,
          audioUrl
        });
      });
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.audioChunks ? this.state.audioChunks.length : null}
        </div>
        <button onClick={this.startRecord}>start</button>
        <button
          onClick={() => {
            this.mediaRecorder.stop();
            this.props.movePointer(false, true);
          }}
        >
          stop
        </button>
        <button
          onClick={() => {
            this.setState({ audioChunks: [] });
            this.props.clearRecord();
          }}
        >
          clear record
        </button>
      </div>
    );
  }
}

Recorder.propTypes = {
  setAudioFiles: PropTypes.func.isRequired,
  movePointer: PropTypes.func.isRequired,
  clearRecord: PropTypes.func.isRequired
};

export default Recorder;
