import React, { Component } from "react";

class RecordCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      recording: false,
      recordLen: 80,
      lineLen: 60 * 50,
      secondsPerBit: 0,
      pxPerBit: 0
    };

    this.createRecordLine = this.createRecordLine.bind(this);
    this.setRecordLineInRecord = this.setRecordLineInRecord.bind(this);
  }

  componentDidMount() {
    this.createRecordLine();
  }

  componentWillReceiveProps(nextProp) {
    if (Object.keys(nextProp).indexOf("recording") > 0) {
      this.setState({ recording: nextProp.recording });
    }
  }

  createRecordLine() {
    const canvas = document.getElementById("recordLine");
    const context = canvas.getContext("2d");

    // Create gradient
    var grd = context.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    // Fill with gradient
    context.fillStyle = grd;
    context.fillRect(2, 2, this.state.recordLen, 86);
  }

  setRecordLineInRecord() {
    var width = 100;
    const { secondsPerBit, pxPerBit } = this.state;
    var id = setInterval(() => {
      if (!this.state.recording) {
        clearInterval(id);
      } else {
        width += pxPerBit / 100;
        this.setState({ recordLen: width });
        this.createRecordLine();
      }
    }, (secondsPerBit * 1000) / 100);
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
                width: this.state.recordLen,
                height: "88px",
                marginLeft: "8px"
              }}
            >
              <canvas
                ref={this.canvasRef}
                id="recordLine"
                width={this.state.recordLen - 2}
                height="86"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RecordCanvas;
