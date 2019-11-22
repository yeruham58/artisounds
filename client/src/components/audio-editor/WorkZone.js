import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RecordingTopRuler from "./RecordingTopRuler";
import Spinner from "../common/Spinner";
import { getProject, clearProject } from "../../actions/projectActions";
import {
  setBuffersList,
  setRecordsDic,
  setCurretRecordId
} from "../../actions/audioEditorActions";
import { initAudioDic, initBuffersList } from "./setPlayerTracks";
import EditorControlBar from "./EditorControlBar";
import Recorder from "./Recorder";

class WorkZone extends Component {
  constructor(props) {
    super(props);
    this.pointerRef = React.createRef();
    this.state = {
      movePointer: false,
      setingRecordsDic: false,
      isPlaying: false,
      isRecording: false,
      recordsDic: {},
      project: null,
      recordBlob: null,
      buffersList: null,
      masterVolume: this.props.editor.masterVolume,
      audioStartTime: null
    };
    this.setAudioDic = this.setAudioDic.bind(this);
    this.initBuffersList = this.initBuffersList.bind(this);
    this.setRecordBlob = this.setRecordBlob.bind(this);
  }

  componentDidMount() {
    const currentRecordId = parseInt(
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    );
    this.props.getProject(this.props.match.params.projectId);
    this.props.setCurretRecordId(currentRecordId);
  }

  componentWillReceiveProps(nextProp) {
    if (
      nextProp.project &&
      nextProp.project.project &&
      nextProp.project.project !== this.state.project
    ) {
      this.setState({ project: nextProp.project.project });
      setTimeout(() => {
        this.setAudioDic();
        this.setRecordBlob(nextProp.project.project);
      }, 20);
    }
    if (nextProp.editor) {
      if (
        nextProp.editor.recordsDic &&
        nextProp.editor.recordsDic !== this.state.recordsDic
      ) {
        this.setState({
          recordsDic: nextProp.editor.recordsDic
        });
        // this timeout is for state to update in reload page
        if (Object.keys(nextProp.editor.recordsDic)[0])
          setTimeout(() => {
            this.initBuffersList(nextProp.editor.masterVolume);
          }, 20);
      }
      if (
        nextProp.editor.audioStartTime !== this.state.audioStartTime &&
        nextProp.editor.allowChangeTime
      ) {
        this.setState({ audioStartTime: nextProp.editor.audioStartTime });
        setTimeout(() => {
          this.initBuffersList(nextProp.editor.masterVolume);
        }, 20);
      }
      if (nextProp.editor.masterVolume !== this.state.masterVolume) {
        this.setState({ masterVolume: nextProp.editor.masterVolume });
        this.initBuffersList(nextProp.editor.masterVolume);
      }
      if (nextProp.editor.isPlaying && !this.state.isPlaying) {
        this.setState({ isPlaying: true });
      }
      if (!nextProp.editor.isPlaying && this.state.isPlaying) {
        this.initBuffersList(nextProp.editor.masterVolume);
        this.setState({ isPlaying: false });
      }
    }
  }

  setRecordBlob(project) {
    const recordObject = project.instruments.find(
      record => record.id === this.props.editor.currentRecordId
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

  setAudioDic() {
    if (this.props.project.project) {
      const { instruments } = this.props.project.project;
      if (instruments && instruments.length > 0) {
        const recordsDic = initAudioDic(instruments);
        this.props.setRecordsDic(recordsDic);
      }
    }
  }

  initBuffersList(masterVolume) {
    const { recordsDic } = this.props.editor;
    //Not working without time outwhen loading page, I have to understend why
    setTimeout(() => {
      const projectBuffersList = initBuffersList(recordsDic, masterVolume);
      this.props.setBuffersList(projectBuffersList);
    }, 500);
  }

  render() {
    const { loading } = this.props.project;
    const { project } = this.state;

    if (loading || !project) {
      return <Spinner />;
    }

    const instrument = project.instruments.find(
      instru => instru.id === this.props.editor.currentRecordId
    );

    if (instrument.user_id !== this.props.auth.user.id) {
      return <Spinner />;
    }

    const recordObject = project.instruments.find(
      record => record.id === this.props.editor.currentRecordId
    );

    const record_key = recordObject ? recordObject.record_key : null;

    return (
      <div className="work-zone">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div>
                <EditorControlBar
                  record_key={record_key}
                  pointerRef={this.pointerRef}
                />
                <div style={{ marginTop: "40px" }}></div>
                <Recorder recordBlob={this.state.recordBlob} />
                <RecordingTopRuler pointerRef={this.pointerRef} />
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
  setCurretRecordId: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  clearProject: PropTypes.func.isRequired,
  setBuffersList: PropTypes.func.isRequired,
  setRecordsDic: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  project: state.project,
  auth: state.auth,
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  {
    getProject,
    clearProject,
    setRecordsDic,
    setCurretRecordId,
    setBuffersList
  }
)(WorkZone);
