import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Crunker from "crunker";

import RecordingTopRuler from "./RecordingTopRuler";
import Spinner from "../common/Spinner";
import { getProject, clearProject } from "../../actions/projectActions";
import {
  setAudioBuffer,
  setAudioStartTime,
  setRecordsDic
} from "../../actions/audioEditorActions";
import EditorControlBar from "./EditorControlBar";
import Recorder from "./Recorder";

class WorkZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movePointer: false,
      setingRecordsDic: false,
      isPlaying: false,
      isRecording: false,
      recordsDic: {},
      project: null,
      currentInstrumentId: window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ],
      recordBlob: null
    };
    this.initAudioDic = this.initAudioDic.bind(this);
    this.initBuffersList = this.initBuffersList.bind(this);
    this.setBuffer = this.setBuffer.bind(this);
    this.setRecordBlob = this.setRecordBlob.bind(this);
  }

  componentDidMount() {
    this.props.getProject(this.props.match.params.projectId);
  }

  componentWillReceiveProps(nextProp) {
    if (
      nextProp.project &&
      nextProp.project.project &&
      nextProp.project.project !== this.state.project
    ) {
      this.setState({ project: nextProp.project.project });
      setTimeout(() => {
        this.initAudioDic();
        this.setRecordBlob();
      }, 100);
    }
    if (nextProp.editor) {
      if (
        nextProp.editor.recordsDic &&
        nextProp.editor.recordsDic !== this.state.recordsDic
      ) {
        this.setState({
          recordsDic: nextProp.editor.recordsDic
        });
        setTimeout(() => {
          this.initBuffersList();
        }, 200);
      }
      if (nextProp.editor.audioStartTime) {
        this.setState({ audioStartTime: nextProp.editor.audioStartTime });
      }
      if (Object.keys(nextProp.editor).indexOf("isPlaying") > 0) {
        if (nextProp.editor.isPlaying && !this.state.isPlaying) {
          this.setState({ isPlaying: true });
        }
        if (!nextProp.editor.isPlaying && this.state.isPlaying) {
          this.initBuffersList();
          this.setState({ isPlaying: false });
        }
      }
    }
  }

  setRecordBlob() {
    const recordObject = this.props.project.project.instruments.find(
      record => record.id === parseInt(this.state.currentInstrumentId)
    );

    const recordUrl = recordObject ? recordObject.record_url : null;

    if (recordUrl) {
      fetch(recordUrl).then(res => {
        res.blob().then(blob => {
          const recordBlob = blob;
          this.setState({ recordBlob });
        });
      });
    }
  }

  initAudioDic() {
    if (this.props.project.project) {
      const { instruments } = this.props.project.project;
      const recordsDic = {};
      if (instruments && instruments.length > 0) {
        instruments.forEach(instrument => {
          recordsDic[instrument.id] = {};
          const audioUrl = instrument.record_url ? instrument.record_url : null;
          let audio = new Crunker();
          if (audioUrl) {
            audio
              .fetchAudio(audioUrl, audioUrl)
              .then(buffers => {
                recordsDic[instrument.id].duration = buffers[0].duration;
                recordsDic[instrument.id].buffer = buffers[0];
                this.props.setRecordsDic(recordsDic);
              })
              .catch(() => {
                // err in Crunker create buffer
                console.log("err in Crunker create buffer");
                recordsDic[instrument.id].duration = null;
                recordsDic[instrument.id].buffer = null;
              });
          } else {
            recordsDic[instrument.id].duration = null;
            recordsDic[instrument.id].buffer = null;
          }
        });
        this.props.setRecordsDic(recordsDic);
      }
    }
  }

  initBuffersList() {
    const { recordsDic } = this.props.editor;
    const buffersList = [];
    for (var key in recordsDic) {
      if (recordsDic[key].buffer) {
        buffersList.push(recordsDic[key].buffer);
      }
    }
    if (buffersList[0]) this.setBuffer(buffersList);
  }
  setBuffer(buffersList) {
    const mergedBuffer = this.mergeBuffers(buffersList);
    this.props.setAudioBuffer(mergedBuffer);
  }

  mergeBuffers(buffers) {
    const ac = new AudioContext();
    var maxChannels = 0;
    var maxDuration = 0;
    for (var i = 0; i < buffers.length; i++) {
      if (buffers[i].numberOfChannels > maxChannels) {
        maxChannels = buffers[i].numberOfChannels;
      }
      if (buffers[i].duration > maxDuration) {
        maxDuration = buffers[i].duration;
      }
    }
    var out = ac.createBuffer(
      maxChannels,
      ac.sampleRate * maxDuration,
      ac.sampleRate
    );
    for (var j = 0; j < buffers.length; j++) {
      for (
        var srcChannel = 0;
        srcChannel < buffers[j].numberOfChannels;
        srcChannel++
      ) {
        var outt = out.getChannelData(srcChannel);
        var inn = buffers[j].getChannelData(srcChannel);
        for (var i2 = 0; i2 < inn.length; i2++) {
          outt[i2] += inn[i2];
        }
        out.getChannelData(srcChannel).set(outt, 0);
      }
    }
    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    var source = ac.createBufferSource();
    // // set the buffer in the AudioBufferSourceNode
    source.buffer = out;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(ac.destination);
    return source;
  }

  render() {
    const { project, loading } = this.props.project;

    if (loading || !project) {
      return <Spinner />;
    }

    const recordObject = this.props.project.project.instruments.find(
      record => record.id === parseInt(this.state.currentInstrumentId)
    );

    const record_key = recordObject ? recordObject.record_key : null;

    return (
      <div className="work-zone">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div>
                <EditorControlBar record_key={record_key} />
                <Recorder recordBlob={this.state.recordBlob} />
                <RecordingTopRuler />
              </div>
              {/* save record popup */}
              {this.props.editor.saving && (
                <div
                  className="text-center"
                  style={{
                    background: "#FFFAFA",
                    height: "150px",
                    width: "400px",
                    position: "fixed",
                    top: "80px",
                    left: (window.innerWidth - 400) / 2
                  }}
                >
                  <div className="mt-9">saving...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WorkZone.propTypes = {
  getProject: PropTypes.func.isRequired,
  clearProject: PropTypes.func.isRequired,
  setAudioBuffer: PropTypes.func.isRequired,
  setRecordsDic: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  project: state.project,
  auth: state.auth,
  profile: state.profile,
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  {
    getProject,
    clearProject,
    setAudioBuffer,
    setAudioStartTime,
    setRecordsDic
  }
)(WorkZone);
