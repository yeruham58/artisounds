import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Crunker from "crunker";

import InstrumentRecordFeed from "./InstrumentRecordFeed";
import Spinner from "../common/Spinner";
import { getProject, clearProject } from "../../actions/projectActions";
import Player from "./Player";

// import firstmp3 from "../../mp3test/lechaDodi - 4:25:19, 5.05 PM.mp3";
// import secondmp3 from "../../mp3test/shanimDm - beforeVoice.mp3";

class WorkZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analyser: null,
      audio: null,
      context: null,
      buffersList: []
    };
    this.setAudioFilesInPlayer = this.setAudioFilesInPlayer.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
    this.setBuffersList = this.setBuffersList.bind(this);
  }
  componentDidMount() {
    this.props.getProject(this.props.match.params.projectId);
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

    // // // start the source playing
    // source.start();

    // return out;
    return source;
  }

  setBuffersList(audioFile) {
    const audioUrl = URL.createObjectURL(audioFile);
    let audio = new Crunker();
    audio.fetchAudio(audioUrl, audioUrl).then(buffers => {
      const buffersList = [...this.state.buffersList, buffers[0]];
      this.setState({
        buffersList
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

    // });
  }

  initPlayer(audioFile) {
    // const audio = new Audio(audioFile);
    // audio.controls = true;
    console.log("audioFile");
    console.log(audioFile);
    // audioFile.start();
    const audio = audioFile;
    // const context = new AudioContext();
    const context = audioFile.context;
    const analyser = context.createAnalyser();
    // const source = context.createMediaElementSource(audio);
    // source.connect(analyser);
    audioFile.connect(analyser);
    analyser.connect(context.destination);

    this.setState({
      analyser,
      audio,
      context
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
                  analyser={this.state.analyser}
                  setAudioFiles={this.setAudioFilesInPlayer}
                />
              )}
              {project.instruments && project.instruments[0] ? (
                <InstrumentRecordFeed
                  instruments={project.instruments}
                  setAudioFiles={this.setAudioFilesInPlayer}
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
