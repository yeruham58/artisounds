import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  setAudioStartTime,
  setSecondsPerBit,
  setPxPerBit,
  setSecondsPerPx
} from "../../actions/audioEditorActions";
import InstrumentRecordFeed from "./InstrumentRecordFeed";
import RecordControlList from "./RecordControlList";

class RecordingTopRuler extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.pointerRef = React.createRef();

    this.state = {
      // pointerStartPos: this.props.editor.audioStartTime,
      pointerStartPos: null,
      spacing: this.props.editor.spacing,
      numOfBits: this.props.editor.numOfBits,
      secondsPerBit: 0,
      secondsPerPx: 0,
      scrollNow: false,
      movePointer: false,
      pointerXPos: 0,
      projectBit: parseInt(this.props.project.project.bit.split("/")[0]),
      projectTempo: this.props.project.project.tempo,
      rulerTop: 0,
      audioPointInSeconds: 0,
      recordsHighth: window.innerHeight * 0.6,
      timelineOverflowY: null,
      instruListLen: 0
    };

    this.initTimeLine = this.initTimeLine.bind(this);
    this.movePointer = this.movePointer.bind(this);
    this.setPointer = this.setPointer.bind(this);
    this.dragMouseDown = this.dragMouseDown.bind(this);
    this.closeDragPointer = this.closeDragPointer.bind(this);
    this.elementDrag = this.elementDrag.bind(this);
    this.scrollCanvas = this.scrollCanvas.bind(this);
    this.getClickPosition = this.getClickPosition.bind(this);
    this.setRulerTop = this.setRulerTop.bind(this);
    this.scrollCanvasInRecord = this.scrollCanvasInRecord.bind(this);
  }

  componentDidMount() {
    const pointer = document.getElementById("record-pointer-holder");
    const canvas = document.getElementById("timeline");
    this.initTimeLine();
    this.dragPointer(pointer);
    canvas.addEventListener("click", this.getClickPosition, false);

    const secondsPerBit = this.state.spacing / this.state.projectTempo;
    const pxPerBit = this.state.spacing / this.state.projectBit;
    const secondsPerPx = secondsPerBit / pxPerBit;

    this.setState({ secondsPerBit, secondsPerPx });
    this.props.setPxPerBit(pxPerBit);
    this.props.setSecondsPerBit(secondsPerBit);
    this.props.setSecondsPerPx(secondsPerPx);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.project && nextProp.project.project) {
      // const id = setInterval(() => {
      //   if (
      //     nextProp.project.project.instruments &&
      //     nextProp.project.project.instruments[0]
      //   )
      //     clearInterval(id);
      const instruList = nextProp.project.project.instruments.filter(
        instrument =>
          instrument.record_url ||
          instrument.id === this.props.editor.currentRecordId
      );
      this.setState({
        instruListLen: instruList.length
      });
      const highth = instruList.length * (90 + 18);
      if (highth < this.state.recordsHighth) {
        this.setState({ timelineOverflowY: "hidden" });
      } else {
        this.setState({ timelineOverflowY: "scroll" });
      }
      // }, 1000);
    }
    if (nextProp.editor) {
      if (this.state.pointerStartPos !== nextProp.editor.audioStartTime) {
        this.setState({ pointerStartPos: nextProp.editor.audioStartTime });
        this.setPointer(nextProp.editor.audioStartTime);
      }
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
          !nextProp.editor.isPlaying &&
          !nextProp.editor.isRecording
        ) {
          this.setState({
            movePointer: false
          });
        }
        if (
          !this.state.movePointer &&
          (nextProp.editor.isPlaying || nextProp.editor.isRecording)
        )
          this.movePointer();
        if (nextProp.editor.numOfBits !== this.state.numOfBits) {
          this.setState({ numOfBits: nextProp.editor.numOfBits });
          setTimeout(() => {
            this.initTimeLine();
          }, 100);
        }
      }
    }
  }

  setRulerTop(type) {
    let top;
    const scrollTop = document.getElementById(type).scrollTop;
    const efectedElem =
      type === "time-line-holder"
        ? document.getElementById("record-control-list")
        : document.getElementById("time-line-holder");

    const { recordsHighth } = this.state;
    const allRecordsHighth = this.state.instruListLen * (90 + 18);

    const scrollLimit = allRecordsHighth + 50 - recordsHighth;

    top = scrollTop < scrollLimit ? scrollTop : scrollLimit;

    if (scrollTop < scrollLimit) {
      this.setState({
        rulerTop: top
      });

      efectedElem.scroll({
        top: scrollTop
      });
    } else {
      document.getElementById("time-line-holder").scroll({
        top: scrollLimit
      });
    }
  }

  setPointer(audioStartTime) {
    const pointer = document.getElementById("record-pointer-holder");
    const pos =
      audioStartTime / this.state.secondsPerPx > 0
        ? audioStartTime / this.state.secondsPerPx
        : 0;
    pointer.style.left = pos + "px";
  }

  movePointer() {
    var pointer = document.getElementById("record-pointer-holder");
    // we need the timeOut for when start record after a record, so the state will first update with the new start time of the first record duration
    this.setState({ scrollNow: true });
    setTimeout(() => {
      const { secondsPerBit } = this.state;
      const pxPerBit = this.state.spacing / this.state.projectBit;
      var pos = this.state.pointerStartPos / this.state.secondsPerPx;
      var id = setInterval(() => {
        if (!this.state.movePointer) {
          // pos = 0;
          this.props.setAudioStartTime({
            audioStartTime: pos * this.state.secondsPerPx
          });
          clearInterval(id);
          this.setState({ scrollNow: false });
        } else {
          pos += pxPerBit / pxPerBit;
          pointer.style.left = pos + "px";
        }
      }, (secondsPerBit * 1000) / pxPerBit);
      setTimeout(() => {
        this.scrollCanvasInRecord(
          (secondsPerBit * 1000) / pxPerBit,
          pxPerBit / pxPerBit
        );
      }, 20);
    }, 100);
  }

  getClickPosition(e) {
    const canvas = document.getElementById("timeline");
    const canvasPositions = canvas.getBoundingClientRect();
    if (e.clientY > canvasPositions.top + 26 && !this.state.movePointer) {
      const setPoint =
        e.clientX - canvasPositions.left + canvas.scrollLeft - 7.5; // 7.5 is middle width of pointer element
      const audioPointInSeconds = this.state.secondsPerPx * setPoint;
      this.props.setAudioStartTime({ audioStartTime: audioPointInSeconds });
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
          timeline.scroll({
            left: scrollNum,
            behavior: "smooth"
          });
        }
      }
    }, 0.2);
  }

  //scroll the canvas during play
  scrollCanvasInRecord(intervatTime, scrollPx) {
    const ruler = document.getElementById("time-line-holder");
    const pointer = document.getElementById("record-pointer-holder");
    var pos = pointer.offsetLeft - ruler.offsetWidth * 0.45;
    var id = setInterval(() => {
      const { scrollNow } = this.state;
      if (!scrollNow) {
        clearInterval(id);
      } else {
        pos += scrollPx;
        ruler.scroll({
          left: pos,
          behavior: "smooth"
        });
      }
    }, intervatTime);
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
        pointer.offsetLeft - newPos > 0.5 ? pointer.offsetLeft - newPos : 0.5;
      if (setPos > this.state.numOfBits * this.state.spacing - 17)
        setPos = this.state.numOfBits * this.state.spacing - 17;

      if (
        pointer.offsetLeft > timelineWidth + timelineLeft - 25 ||
        pointer.offsetLeft < timelineLeft
      ) {
        this.setState({ scrollNow: true });
        this.scrollCanvas(timeline, pointer);
      } else {
        pointer.style.left = setPos + "px";
        // const audioPointInSeconds = this.state.secondsPerPx * setPos;
        // this.setState({ audioPointInSeconds });
      }
    }
  }

  closeDragPointer() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    const pointer = document.getElementById("record-pointer-holder");
    const audioPointInSeconds = this.state.secondsPerPx * pointer.offsetLeft;
    this.props.setAudioStartTime({ audioStartTime: audioPointInSeconds });

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
    context.lineTo(this.state.numOfBits * spacing, 25);
    context.strokeStyle = "black";
    context.stroke();

    for (var interval = 0; interval < this.state.numOfBits; interval++) {
      context.beginPath();
      context.strokeStyle = "red";
      context.moveTo(interval * spacing + 7.5, 0);
      context.lineTo(interval * spacing + 7.5, 70);

      for (
        var subInterval = 0;
        subInterval < this.state.projectBit;
        subInterval++
      ) {
        context.moveTo(
          interval * spacing + 7.5 + subSpacing * subInterval,
          this.state.numOfBits
        );
        context.lineTo(interval * spacing + 7.5 + subSpacing * subInterval, 37);
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
      <div className="container">
        <div className="row">
          <div className="col-2" style={{ background: "grey", padding: "0px" }}>
            <div
              style={{
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: "100%",
                  position: "relative",
                  height: this.state.recordsHighth + "px",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  paddingRight: "17px",

                  boxSizing: "content-box"
                }}
                id="record-control-list"
                onScroll={() => {
                  this.setRulerTop("record-control-list");
                }}
              >
                <div
                  style={{
                    height: "50px",
                    width: "100%",
                    position: "absolute",
                    top: this.state.rulerTop + "px",
                    background: "#343a40"
                  }}
                ></div>
                <div style={{ marginTop: "50px" }}>
                  <RecordControlList
                    instruments={project.instruments}
                    userId={this.props.auth.user.id}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-10" style={{ padding: "0px" }}>
            <div>
              <div
                style={{
                  // overflow: "scroll",
                  overflowY: this.state.timelineOverflowY,
                  position: "relative",
                  left: -20,
                  height: this.state.recordsHighth + "px",
                  background: "grey",
                  color: "white"
                }}
                id="time-line-holder"
                onScroll={() => this.setRulerTop("time-line-holder")}
              >
                <canvas
                  ref={this.canvasRef}
                  id="timeline"
                  width={this.state.spacing * this.state.numOfBits}
                  height="50px"
                  style={{
                    background: "#343a40",
                    position: "absolute",
                    top: this.state.rulerTop + "px"
                  }}
                />
                <div
                  // ref={this.pointerRef}
                  ref={this.props.pointerRef}
                  id="record-pointer-holder"
                  style={{
                    position: "absolute",
                    height: "100%",
                    marginTop: "40px",
                    top: this.state.rulerTop + "px"
                  }}
                >
                  <div className="record-pointer" ref={this.props.pointerRef}>
                    <div
                      className="record-pointer-line"
                      style={{ height: this.state.recordsHighth }}
                    />
                  </div>
                </div>
                {project.instruments && project.instruments[0] ? (
                  <div style={{ marginTop: "50px" }}>
                    <InstrumentRecordFeed instruments={project.instruments} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return <div>{scaleLine}</div>;
  }
}

RecordingTopRuler.propTypes = {
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  setPxPerBit: PropTypes.func.isRequired,
  setSecondsPerPx: PropTypes.func.isRequired,
  setSecondsPerBit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  editor: state.audioEditor,
  project: state.project
});

export default connect(
  mapStateToProps,

  { setAudioStartTime, setSecondsPerBit, setPxPerBit, setSecondsPerPx }
)(RecordingTopRuler);
