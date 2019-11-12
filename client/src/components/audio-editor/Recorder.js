import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Crunker from "crunker";

import {
  setIsRecording,
  setRecordsDic,
  setAudioStartTime,
  setCurrentBolb,
  clearRecord
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
      audioChunks: [],
      audioBlob: null,
      isRecording: false,
      recordDic: null
    };

    this.startRecord = this.startRecord.bind(this);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.recordBlob && !this.state.audioBlob) {
      this.setState({
        audioBlob: nextProp.recordBlob,
        audioChunks: this.state.audioChunks.concat([nextProp.recordBlob])
      });
    }
    if (nextProp.editor) {
      if (this.state.recordDic !== nextProp.editor.recordsDic) {
        this.setState({
          recordDic: nextProp.editor.recordsDic
        });
      }
      if (nextProp.editor.isRecording && !this.state.isRecording) {
        this.setState({ isRecording: true });
        this.startRecord();
      }
      if (!nextProp.editor.isRecording && this.state.isRecording) {
        this.setState({ isRecording: false });
        this.mediaRecorder.stop();
      }
      if (nextProp.editor.clearRecord) {
        this.setState({ audioChunks: [] });
        this.props.clearRecord(false);
      }
    }
  }

  startRecord() {
    this.setRecordStartTime();
    // timeOut becouse thre is time out in the pointer
    setTimeout(() => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder = mediaRecorder;
        this.mediaRecorder.start();
        // this.props.setIsRecording(true);
        const audioChunks = this.state.audioBlob ? this.state.audioChunks : [];

        this.mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);

          this.setState({ audioChunks });
        });

        this.mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          this.props.setCurrentBolb(audioBlob);
          const audioUrl = URL.createObjectURL(audioBlob);
          let audio = new Crunker();
          audio.fetchAudio(audioUrl, audioUrl).then(buffers => {
            const recordsDic = {
              ...this.props.editor.recordsDic,
              [this.props.editor.currentRecordId]: {
                ...this.props.editor.recordsDic[
                  this.props.editor.currentRecordId
                ],
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
    }, 100);
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

    this.props.setAudioStartTime({ audioStartTime: startTime });
  }

  render() {
    return <div></div>;
  }
}

Recorder.propTypes = {
  setCurrentBolb: PropTypes.func.isRequired,
  setIsRecording: PropTypes.func.isRequired,
  setRecordsDic: PropTypes.func.isRequired,
  clearRecord: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  {
    setIsRecording,
    setRecordsDic,
    setAudioStartTime,
    setCurrentBolb,
    clearRecord
  }
)(Recorder);
