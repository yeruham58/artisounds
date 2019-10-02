import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Crunker from "crunker";

import {
  setIsRecording,
  setBuffersList,
  setRecordsDic,
  setAudioStartTime
} from "../../actions/audioEditorActions";

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
    this.setRecordStartTime();
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder = mediaRecorder;
      this.mediaRecorder.start();
      this.props.setIsRecording(true);

      const audioChunks = this.state.audioBlob ? this.state.audioChunks : [];
      this.mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
        this.setState({ audioChunks });
      });

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        let audio = new Crunker();
        audio.fetchAudio(audioUrl, audioUrl).then(buffers => {
          const buffersList = [...this.props.editor.buffersList, buffers[0]];
          const recordsDic = {
            ...this.props.editor.recordsDic,
            [window.location.href.split("/")[
              window.location.href.split("/").length - 1
            ]]: {
              duration: buffers[0].duration
            }
          };
          this.props.setBuffersList(buffersList);
          this.props.setRecordsDic(recordsDic);
        });
        this.setState({
          audioBlob,
          audioUrl
        });
      });
    });
  }

  setRecordStartTime() {
    const instrumentRecord = this.props.editor.recordsDic[
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    ];
    const startTime =
      instrumentRecord && instrumentRecord.duration
        ? instrumentRecord.duration
        : 0.0000000001;
    this.props.setAudioStartTime(startTime);
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
            this.props.setIsRecording(false);
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
  setIsRecording: PropTypes.func.isRequired,
  setBuffersList: PropTypes.func.isRequired,
  setRecordsDic: PropTypes.func.isRequired,
  clearRecord: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  { setIsRecording, setBuffersList, setRecordsDic, setAudioStartTime }
)(Recorder);
