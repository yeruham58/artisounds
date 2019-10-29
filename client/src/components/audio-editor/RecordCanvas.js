import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class RecordCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      isRecording: false,
      recordLen: 0,
      recordLineWidth: 0,
      lineLen: 60 * 50,
      currentRecordId: parseInt(
        window.location.href.split("/")[
          window.location.href.split("/").length - 1
        ]
      )
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
      this.setState({
        isRecording: nextProp.editor.isRecording,
        recordLen: recordLen,
        recordLineWidth: recordLen / nextProp.editor.secondsPerPx
      });
      setTimeout(() => {
        this.createRecordLine();
      }, 100);
    }
  }

  createRecordLine() {
    const canvas = document.getElementById(
      this.props.instrument.id + "RecordLine"
    );
    const context = canvas.getContext("2d");

    // Create gradient
    var grd = context.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, "red");

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
        width += pxPerBit / 15;
        this.setState({
          recordLineWidth: width
        });
        this.createRecordLine();
      }
    }, (secondsPerBit * 1000) / 15);
  }

  render() {
    return (
      <div>
        <div style={{ marginLeft: "12px", height: "25px" }}>
          {this.props.instrument.instrument_detailes.art_practic_name}
        </div>
        <div
          style={{
            background: "grey",
            width: this.state.lineLen,
            height: "90px"
          }}
        >
          <div
            style={{
              background: "#A9A9A9",
              width: this.state.lineLen,
              height: "88px"
            }}
          >
            <div
              id="record-line-holder"
              style={{
                background: "white",
                borderRadius: "3px",
                width: this.state.recordLineWidth,
                height: "88px",
                marginLeft: "8px"
              }}
            >
              <canvas
                ref={this.canvasRef}
                id={this.props.instrument.id + "RecordLine"}
                width={this.state.recordLineWidth - 2}
                height="86"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RecordCanvas.propTypes = {
  instrument: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  {}
)(RecordCanvas);
