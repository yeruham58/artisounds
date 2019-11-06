import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { setNumOfBits } from "../../actions/audioEditorActions";

class RecordCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      isRecording: false,
      recordLen: 0,
      recordLineWidth: 0,
      lineLen: this.props.editor.spacing * this.props.editor.numOfBits,
      currentRecordId: this.props.editor.currentRecordId
    };

    this.createRecordLine = this.createRecordLine.bind(this);
    this.setRecordLineInRecord = this.setRecordLineInRecord.bind(this);
  }

  componentDidMount() {
    this.createRecordLine();
  }

  componentWillReceiveProps(nextProp) {
    if (
      nextProp.editor.isRecording &&
      !this.state.isRecording &&
      this.state.currentRecordId === this.props.instrument.id
    ) {
      // time out becouse there is time out in record and pointer
      this.setState({ isRecording: true });
      setTimeout(() => {
        this.setRecordLineInRecord();
      }, 100);
    }

    if (
      nextProp.editor.recordsDic &&
      nextProp.editor.recordsDic[this.props.instrument.id]
    ) {
      const recordLen = nextProp.editor.recordsDic[this.props.instrument.id]
        .duration
        ? nextProp.editor.recordsDic[this.props.instrument.id].duration
        : 0;
      const recordLineWidth = recordLen / nextProp.editor.secondsPerPx;
      this.setState({
        isRecording: nextProp.editor.isRecording,
        recordLen,
        recordLineWidth
      });
      if (
        nextProp.editor.spacing * nextProp.editor.numOfBits - recordLineWidth <
        1000
      ) {
        this.props.setNumOfBits(nextProp.editor.numOfBits + 20);
      }
      setTimeout(() => {
        this.createRecordLine();
      }, 100);
    }
    if (
      nextProp.editor &&
      this.state.lineLen !== nextProp.editor.spacing * nextProp.editor.numOfBits
    ) {
      this.setState({
        lineLen: nextProp.editor.spacing * nextProp.editor.numOfBits
      });
    }
  }

  createRecordLine() {
    const canvas = document.getElementById(
      this.props.instrument.id + "RecordLine"
    );
    const context = canvas.getContext("2d");

    // Create gradient
    var grd = context.createLinearGradient(0, 0, 200, 0);
    const recordColor =
      this.state.currentRecordId === this.props.instrument.id
        ? "#78bcff"
        : "#5e80e6";
    grd.addColorStop(0, recordColor);

    // Fill with gradient
    context.fillStyle = grd;
    context.fillRect(2, 2, this.state.recordLineWidth, 86);
  }

  setRecordLineInRecord() {
    const { pxPerBit, secondsPerBit } = this.props.editor;
    var width = this.state.recordLineWidth;

    var id = setInterval(() => {
      if (!this.state.isRecording) {
        clearInterval(id);
      } else {
        width += pxPerBit / pxPerBit;
        this.setState({
          recordLineWidth: width
        });
        this.createRecordLine();
        if (this.state.lineLen - width < 1000) {
          this.props.setNumOfBits(this.props.editor.numOfBits + 20);
        }
      }
    }, (secondsPerBit * 1000) / pxPerBit);
  }

  render() {
    return (
      <div>
        <div style={{ height: "18px", marginLeft: "12px", fontSize: "12px" }}>
          {" "}
          <strong>
            {this.props.instrument.instrument_detailes.art_practic_name}
          </strong>
        </div>
        <div
          style={{
            background:
              this.state.currentRecordId === this.props.instrument.id
                ? "#ebedf0"
                : "#d6dbe0",
            width: this.state.lineLen,
            height: "90px"
          }}
        >
          <div
          // style={{
          //   // background: "#fdf3f5",
          //   width: this.state.lineLen,
          //   height: "89px"
          // }}
          >
            <div
              id="record-line-holder"
              style={{
                background: "#ffe34d",
                borderRadius: "3px",
                width: this.state.recordLineWidth,
                height: "89px",
                marginLeft: "7.5px"
              }}
            >
              <canvas
                ref={this.canvasRef}
                id={this.props.instrument.id + "RecordLine"}
                width={this.state.recordLineWidth - 2}
                height="87"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RecordCanvas.propTypes = {
  instrument: PropTypes.object.isRequired,
  setNumOfBits: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  { setNumOfBits }
)(RecordCanvas);
