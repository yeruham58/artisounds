import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setAudioStartTime } from "../../actions/audioEditorActions";
import InstrumentRecordFeed from "./InstrumentRecordFeed";

class RecordingTopRuler extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.pointerRef = React.createRef();

    this.state = {
      pointerStartPos: this.props.editor.audioStartTime,
      spacing: 60,
      secondsPerBit: 0,
      secondsPerPx: 0,
      scrollNow: false,
      movePointer: false,
      pointerXPos: 0,
      projectBit: parseInt(this.props.project.project.bit.split("/")[0]),
      projectTempo: this.props.project.project.tempo,
      rulerTop: 0,
      isMoving: false
    };

    this.initTimeLine = this.initTimeLine.bind(this);
    this.movePointer = this.movePointer.bind(this);
    this.dragMouseDown = this.dragMouseDown.bind(this);
    this.closeDragPointer = this.closeDragPointer.bind(this);
    this.elementDrag = this.elementDrag.bind(this);
    this.scrollCanvas = this.scrollCanvas.bind(this);
    this.getClickPosition = this.getClickPosition.bind(this);
    this.setRulerTop = this.setRulerTop.bind(this);
  }

  componentDidMount() {
    const pointer = document.getElementById("record-pointer-holder");
    const canvas = document.getElementById("time-line-holder");
    this.initTimeLine();
    this.dragPointer(pointer);
    canvas.addEventListener("click", this.getClickPosition, false);

    const secondsPerBit = 60 / this.state.projectTempo;
    const secondsPerPx =
      secondsPerBit / (this.state.spacing / this.state.projectBit);
    this.setState({ secondsPerBit, secondsPerPx });
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.editor) {
      if (
        Object.keys(nextProp.editor).indexOf("isPlaying") > 0 ||
        Object.keys(nextProp.editor).indexOf("isRecording") > 0
      ) {
        if (
          !this.state.movePointer &&
          (nextProp.editor.isPlaying || nextProp.editor.isRecording)
        ) {
          this.setState({
            movePointer: true
          });
        }
        if (
          this.state.movePointer &&
          (!nextProp.editor.isPlaying && !nextProp.editor.isRecording)
        ) {
          this.setState({
            movePointer: false
          });
        }
        if (
          !this.state.movePointer &&
          (nextProp.editor.isPlaying || nextProp.editor.isRecording)
        )
          setTimeout(() => {
            this.movePointer();
          }, 100);
      }

      if (nextProp.editor.audioStartTime) {
        this.setState({ pointerStartPos: nextProp.editor.audioStartTime });
      }
    }
  }

  setRulerTop() {
    this.setState({
      rulerTop: document.getElementById("time-line-holder").scrollTop
    });
  }

  movePointer() {
    var elem = document.getElementById("record-pointer-holder");
    var pos = this.state.pointerStartPos / this.state.secondsPerPx;
    const { secondsPerBit } = this.state;
    const pxPerBit = this.state.spacing / this.state.projectBit;
    var id = setInterval(() => {
      if (!this.state.movePointer) {
        // pos = 0;
        this.props.setAudioStartTime(pos * this.state.secondsPerPx);
        clearInterval(id);
      } else {
        pos += pxPerBit / 100;
        elem.style.left = pos + "px";
      }
    }, (secondsPerBit * 1000) / 100);
  }

  getClickPosition(e) {
    if (!this.state.movePointer) {
      const pointer = document.getElementById("record-pointer-holder");
      const canvas = document.getElementById("time-line-holder");
      const canvasPositions = canvas.getBoundingClientRect();
      const setPoint = e.clientX - canvasPositions.left + canvas.scrollLeft;
      pointer.style.left = setPoint - 7.5 + "px"; // 7.5 is middle width of pointer element
      const audioPointInSeconds = this.state.secondsPerPx * setPoint;
      this.props.setAudioStartTime(audioPointInSeconds);
    }
  }

  dragPointer() {
    const pointer = document.getElementById("record-pointer-holder");
    if (document.getElementById("record-pointer")) {
      /* if present, the record-pointer is where you move the DIV from:*/
      document.getElementById(
        "record-pointer"
      ).onmousedown = this.dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      pointer.onmousedown = this.dragMouseDown;
    }
  }

  dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    this.setState({ pointerXPos: e.clientX });
    document.onmouseup = this.closeDragPointer;
    // call a function whenever the cursor moves:
    document.onmousemove = this.elementDrag;
  }

  scrollCanvas(timeline, pointer) {
    var id = setInterval(() => {
      {
        const timelineWidth = timeline.offsetWidth;
        const timelineLeft = timeline.scrollLeft;
        const { scrollNow } = this.state;
        if (!scrollNow) {
          clearInterval(id);
        } else {
          let setPos;
          let scrollNum;
          if (pointer.offsetLeft > timelineWidth + timelineLeft - 30) {
            setPos = timelineWidth + timelineLeft - 25;
            scrollNum = timeline.scrollLeft + 10;
          }
          if (pointer.offsetLeft < timelineLeft + 5) {
            setPos = timelineLeft;
            scrollNum = timeline.scrollLeft - 10;
          }
          pointer.style.left = setPos + "px";
          const audioPointInSeconds = this.state.secondsPerPx * setPos;
          this.props.setAudioStartTime(audioPointInSeconds);
          timeline.scroll({
            left: scrollNum,
            behavior: "smooth"
          });
        }
      }
    }, 0.2);
  }

  elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    if (!this.state.movePointer) {
      const timeline = document.getElementById("time-line-holder");
      const timelineWidth = timeline.offsetWidth;
      const timelineLeft = timeline.scrollLeft;
      // calculate the new cursor position:
      const newPos = this.state.pointerXPos - e.clientX;
      this.setState({ pointerXPos: e.clientX });

      // set the element's new position:
      var pointer = document.getElementById("record-pointer-holder");

      let setPos =
        pointer.offsetLeft - newPos > 0 ? pointer.offsetLeft - newPos : 0;
      if (setPos > 50 * this.state.spacing) setPos = 50 * this.state.spacing;

      if (
        pointer.offsetLeft > timelineWidth + timelineLeft - 25 ||
        pointer.offsetLeft < timelineLeft
      ) {
        this.setState({ scrollNow: true });
        this.scrollCanvas(timeline, pointer);
      } else {
        pointer.style.left = setPos + "px";
        const audioPointInSeconds = this.state.secondsPerPx * setPos;
        this.props.setAudioStartTime(audioPointInSeconds);
      }
    }
  }

  closeDragPointer() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    this.setState({ scrollNow: false });
  }

  // Initialize the timeline after the page loads all of its HTML into the window
  initTimeLine() {
    const canvas = document.getElementById("timeline");
    const context = canvas.getContext("2d");
    var spacing = this.state.spacing;
    var subSpacing = spacing / this.state.projectBit;

    context.beginPath();
    context.moveTo(0, 25);
    context.lineTo(50 * spacing, 25);
    context.strokeStyle = "black";
    context.stroke();

    for (var interval = 0; interval < 50; interval++) {
      context.beginPath();
      context.strokeStyle = "red";
      context.moveTo(interval * spacing + 7, 0);
      context.lineTo(interval * spacing + 7, 70);

      for (
        var subInterval = 0;
        subInterval < this.state.projectBit;
        subInterval++
      ) {
        context.moveTo(interval * spacing + 7 + subSpacing * subInterval, 50);
        context.lineTo(interval * spacing + 7 + subSpacing * subInterval, 37);
      }
      context.stroke();
      context.beginPath();
      context.strokeStyle = "#F8F8FF";
      context.font = "12px Arial";
      context.strokeText(interval + 1, interval * spacing + 12, 16);
      context.stroke();
    }

    this.setState({
      canvas,
      context
    });
  }
  render() {
    const { project } = this.props.project;
    const scaleLine = (
      <div
        style={{
          overflowX: "scroll",
          position: "relative",
          // height: "100px"
          maxHeight: window.innerHeight * 0.75 + "px"
        }}
        id="time-line-holder"
        onScroll={this.setRulerTop}
      >
        <canvas
          ref={this.canvasRef}
          id="timeline"
          width={60 * 50}
          height="50px"
          style={{
            background: "#343a40",
            position: "absolute",
            top: this.state.rulerTop + "px"
          }}
        />
        <div
          ref={this.pointerRef}
          id="record-pointer-holder"
          style={{
            position: "absolute",
            height: "100%",
            maxHeight: window.innerHeight * 0.75 - 40 + "px",
            top: this.state.rulerTop + 40 + "px"
          }}
        >
          <div className="record-pointer">
            <div className="record-pointer-line" />
          </div>
        </div>

        {project.instruments && project.instruments[0] ? (
          <div style={{ marginTop: "50px" }}>
            <InstrumentRecordFeed
              instruments={project.instruments}
              setAudioFiles={this.props.setAudioFiles}
              movePointer={this.props.movePointerFunc}
              clearRecord={this.props.clearRecord}
            />
          </div>
        ) : null}
      </div>
    );
    return <div id="ruler">{scaleLine}</div>;
  }
}

RecordingTopRuler.propTypes = {
  project: PropTypes.object.isRequired,
  clearRecord: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor,
  project: state.project
});

export default connect(
  mapStateToProps,

  { setAudioStartTime }
)(RecordingTopRuler);
