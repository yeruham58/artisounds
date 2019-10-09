import React, { Component } from "react";
import { connect } from "react-redux";

class RecordCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      isRecording: false,
      recordLen: 0,
      recordLineWidth: 0,
      lineLen: 60 * 50
    };

    this.createRecordLine = this.createRecordLine.bind(this);
    this.setRecordLineInRecord = this.setRecordLineInRecord.bind(this);
  }

  componentDidMount() {
    this.createRecordLine();
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.editor.recordsDic && nextProp.editor.recordsDic["101"]) {
      const recordLen = nextProp.editor.recordsDic["101"].duration
        ? nextProp.editor.recordsDic["101"].duration
        : 0;
      this.setState({
        isRecording: nextProp.editor.isRecording,
        recordLen: recordLen,
        recordLineWidth: recordLen / nextProp.editor.secondsPerPx
      });
      if (nextProp.editor.isRecording && !this.state.isRecording) {
        this.setRecordLineInRecord();
      } else {
        this.createRecordLine();
      }
    }
  }

  createRecordLine() {
    const canvas = document.getElementById("recordLine");
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
                id="recordLine"
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

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  {}
)(RecordCanvas);
