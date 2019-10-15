import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Crunker from "crunker";

import {
  setIsRecording,
  setRecordsDic,
  setAudioStartTime
} from "../../actions/audioEditorActions";

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentInstrumentId: window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ],
      audio: null,
      audioUrl: null,
      audioBlob: null,
      audioChunks: null,
      isRecording: false
    };

    this.startRecord = this.startRecord.bind(this);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.editor) {
      if (nextProp.editor.isRecording && !this.state.isRecording) {
        this.setState({ isRecording: true });
        // timeOut becouse thre is time out in the pointer
        setTimeout(() => {
          this.startRecord();
        }, 100);
      }
      if (!nextProp.editor.isRecording && this.state.isRecording) {
        this.setState({ isRecording: false });
        this.mediaRecorder.stop();
      }
      if (
        nextProp.editor.recordsDic[this.state.currentInstrumentId] &&
        !nextProp.editor.recordsDic[this.state.currentInstrumentId].duration
      ) {
        this.setState({ audioChunks: [] });
      }
    }
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
          const recordsDic = {
            ...this.props.editor.recordsDic,
            [window.location.href.split("/")[
              window.location.href.split("/").length - 1
            ]]: {
              duration: buffers[0].duration,
              buffer: buffers[0]
            }
          };
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
    // we shoud set to 00.01 so the new props will recognize a change, we need it after clear record
    const startTime =
      instrumentRecord && instrumentRecord.duration
        ? instrumentRecord.duration
        : 0.0000001;
    this.props.setAudioStartTime(startTime);
  }

  render() {
    return <div></div>;
  }
}

Recorder.propTypes = {
  setIsRecording: PropTypes.func.isRequired,
  setRecordsDic: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  { setIsRecording, setRecordsDic, setAudioStartTime }
)(Recorder);
