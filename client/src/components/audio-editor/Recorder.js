import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Crunker from "crunker";

import {
  setIsRecording,
  setRecordsDic,
  setAudioStartTime,
  setCurrentBolb
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

  componentDidMount() {
    const recordUrl = this.props.recordUrls.find(
      record => record.id === parseInt(this.state.currentInstrumentId)
    ).record_url;
    if (recordUrl) {
      fetch(recordUrl).then(res => {
        res.blob().then(blob => {
          const audioChunks = [blob];
          console.log("blob");
          console.log(this.state.audioChunks.concat(audioChunks));
          this.setState({
            audioBlob: blob,
            audioChunks: this.state.audioChunks.concat(audioChunks)
          });
        });
      });
    }
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.editor) {
      if (this.state.recordDic !== nextProp.editor.recordsDic) {
        this.setState({
          recordDic: nextProp.editor.recordsDic
        });
      }
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
        !nextProp.editor.recordsDic[this.state.currentInstrumentId].buffer &&
        Object.keys(this.state.recordDic)[0]
      ) {
        console.log("this Way");
        console.log(this.state.recordDic);
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
        this.props.setCurrentBolb(audioBlob);
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
  setCurrentBolb: PropTypes.func.isRequired,
  setIsRecording: PropTypes.func.isRequired,
  setRecordsDic: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  { setIsRecording, setRecordsDic, setAudioStartTime, setCurrentBolb }
)(Recorder);
