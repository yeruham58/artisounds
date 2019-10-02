import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RecordingTopRuler from "./RecordingTopRuler";
import Spinner from "../common/Spinner";
import { getProject, clearProject } from "../../actions/projectActions";
import {
  setAudioBuffer,
  setAudioStartTime
} from "../../actions/audioEditorActions";
import Player from "./Player";
import Recorder from "./Recorder";

class WorkZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movePointer: false,
      buffersList: [],
      setingBuffersList: false,
      isPlaying: false,
      isRecording: false,
      recordsDic: {}
    };
    this.setBuffer = this.setBuffer.bind(this);
    this.clearRecord = this.clearRecord.bind(this);
  }
  componentDidMount() {
    this.props.getProject(this.props.match.params.projectId);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.editor) {
      if (nextProp.editor.buffersList[0] && !this.state.setingBuffersList) {
        this.setState({
          setingBuffersList: true,
          buffersList: nextProp.editor.buffersList
        });
        setTimeout(() => {
          this.setBuffer(nextProp.editor.buffersList);
        }, 100);
      }
      if (nextProp.editor.buffersList[0] && this.state.setingBuffersList) {
        this.setState({
          setingBuffersList: false,
          buffersList: nextProp.editor.buffersList
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
          this.setBuffer();
          this.setState({ isPlaying: false });
        }
      }
    }
  }

  setBuffer() {
    const mergedBuffer = this.mergeBuffers(this.state.buffersList);
    this.setState({
      audio: mergedBuffer
    });
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
                <Recorder clearRecord={this.clearRecord} />
                <div className="text-center">
                  <Player />
                </div>
              </div>
              <div style={{ height: "10px" }}>
                <RecordingTopRuler clearRecord={this.clearRecord} />
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
    setAudioStartTime
  }
)(WorkZone);
