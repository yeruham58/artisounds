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
import Player from "./Player";
import Recorder from "./Recorder";

class WorkZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movePointer: false,
      setingRecordsDic: false,
      isPlaying: false,
      isRecording: false,
      recordsDic: {}
    };
    this.initAudioDic = this.initAudioDic.bind(this);
    this.initBuffersList = this.initBuffersList.bind(this);
    this.setBuffer = this.setBuffer.bind(this);
    this.clearRecord = this.clearRecord.bind(this);
  }
  componentDidMount() {
    this.props.getProject(this.props.match.params.projectId);
    setTimeout(() => {
      this.initAudioDic();
    }, 100);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.editor) {
      if (nextProp.editor.recordsDic && !this.state.setingRecordsDic) {
        this.setState({
          setingRecordsDic: true
        });
        setTimeout(() => {
          this.initBuffersList();
        }, 100);
      }

      if (nextProp.editor.recordsDic && this.state.setingRecordsDic) {
        this.setState({
          setingRecordsDic: false
        });
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

  initAudioDic() {
    const { instruments } = this.props.project.project;
    const recordsDic = {};
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

  initBuffersList() {
    const { recordsDic } = this.props.editor;
    const buffersList = [];
    for (var key in recordsDic) {
      if (recordsDic[key].buffer) {
        buffersList.push(recordsDic[key].buffer);
      }
    }
    this.setBuffer(buffersList);
  }

  setBuffer(buffersList) {
    const mergedBuffer = buffersList[0] ? this.mergeBuffers(buffersList) : null;
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

  clearRecord() {
    this.setState({
      recordsDic: {
        ...this.state.recordsDic,
        [this.props.match.params.instrumentId.toString]: {
          duration: null
        }
      }
    });
  }

  render() {
    const { project, loading } = this.props.project;

    if (loading || !project) {
      return <Spinner />;
    }

    return (
      <div className="work-zone">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div>
                <button
                  type="button"
                  className="btn btn-light mb-3"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
                <Recorder />
                <div className="text-center">
                  <Player />
                </div>
              </div>
              <div style={{ height: "10px" }}>
                <RecordingTopRuler />
              </div>
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
