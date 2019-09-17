import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Crunker from "crunker";

import InstrumentRecordFeed from "./InstrumentRecordFeed";
import RecordingTopRuler from "./RecordingTopRuler";
import Spinner from "../common/Spinner";
import { getProject, clearProject } from "../../actions/projectActions";
import Player from "./Player";

class WorkZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioStartTime: 0,
      movePointer: false,
      analyser: null,
      audio: null,
      context: null,
      buffersList: [],
      recordsDic: {}
    };
    this.setAudioFilesInPlayer = this.setAudioFilesInPlayer.bind(this);
    this.setAudioStartTime = this.setAudioStartTime.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
    this.setBuffersList = this.setBuffersList.bind(this);
    this.movePointerInPlayOrRecord = this.movePointerInPlayOrRecord.bind(this);
    this.clearRecord = this.clearRecord.bind(this);
  }
  componentDidMount() {
    this.props.getProject(this.props.match.params.projectId);
  }

  setBuffersList(audioFile) {
    const audioUrl = URL.createObjectURL(audioFile);
    let audio = new Crunker();
    audio.fetchAudio(audioUrl, audioUrl).then(buffers => {
      const buffersList = [...this.state.buffersList, buffers[0]];
      this.setState({
        buffersList,
        recordsDic: {
          ...this.state.recordsDic,
          [this.props.match.params.instrumentId.toString]: {
            duration: buffers[0].duration
          }
        }
      });
      this.setAudioFilesInPlayer(null);
    });
  }

  setAudioFilesInPlayer(audioFile) {
    if (audioFile) {
      this.setBuffersList(audioFile);
    } else {
      const mergedBuffer = this.mergeBuffers(this.state.buffersList);

      if (this.state.context) {
        this.state.context.close().then(() => {
          this.initPlayer(mergedBuffer);
        });
      } else {
        this.initPlayer(mergedBuffer);
      }
    }
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

    // start the source playing
    return source;
  }

  initPlayer(audioFile) {
    const audio = audioFile;
    const context = audioFile.context;
    const analyser = context.createAnalyser();
    audioFile.connect(analyser);
    analyser.connect(context.destination);

    this.setState({
      analyser,
      audio,
      context
    });
  }

  movePointerInPlayOrRecord(playingNow, isRecord) {
    const instrumentRecord = this.state.recordsDic[
      this.props.match.params.instrumentId.toString
    ];
    if (isRecord) {
      console.log("instrumentRecord");
      console.log(instrumentRecord);
      const startTime =
        instrumentRecord && instrumentRecord.duration
          ? instrumentRecord.duration
          : 0.0000000001;
      this.setAudioStartTime(startTime);
    }
    this.setState({ movePointer: playingNow });
  }

  setAudioStartTime(startTime) {
    this.setState({ audioStartTime: startTime });
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
              <button
                type="button"
                className="btn btn-light mb-3"
                onClick={() => window.history.back()}
              >
                Back
              </button>
              {this.state.audio && this.state.context && (
                <Player
                  audio={this.state.audio}
                  audioStartTime={this.state.audioStartTime}
                  analyser={this.state.analyser}
                  setAudioFiles={this.setAudioFilesInPlayer}
                  movePointer={this.movePointerInPlayOrRecord}
                />
              )}
              <RecordingTopRuler
                project={this.props.project.project}
                pointerStartPoint={this.state.audioStartTime}
                movePointer={this.state.movePointer}
                setStartTime={this.setAudioStartTime}
              />

              {project.instruments && project.instruments[0] ? (
                <InstrumentRecordFeed
                  instruments={project.instruments}
                  setAudioFiles={this.setAudioFilesInPlayer}
                  movePointer={this.movePointerInPlayOrRecord}
                  clearRecord={this.clearRecord}
                />
              ) : null}
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
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  project: state.project,
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,

  {
    getProject,
    clearProject
  }
)(WorkZone);
