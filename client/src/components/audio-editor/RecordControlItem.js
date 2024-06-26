import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import RangeSlider from "../common/RangeSlider";
import { setRecordsDic } from "../../actions/audioEditorActions";

class RecordControlItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: this.props.instrument.volume ? this.props.instrument.volume : 8,
      isMuted: false,
      currentInstrumentId: this.props.editor.currentRecordId
    };

    this.onVolumeChange = this.onVolumeChange.bind(this);
    this.muteControle = this.muteControle.bind(this);
  }

  onVolumeChange() {
    var slider = document.getElementById("myRange" + this.props.instrument.id);
    this.setState({ volume: slider.value });

    document.onmouseup = () => {
      const recordsDic = {
        ...this.props.editor.recordsDic,
        [this.props.instrument.id]: {
          ...this.props.editor.recordsDic[this.props.instrument.id],
          volume: slider.value
        }
      };

      this.props.setRecordsDic(recordsDic);
      document.onmouseup = null;
    };
  }

  muteControle() {
    const recordsDic = {
      ...this.props.editor.recordsDic,
      [this.props.instrument.id]: {
        ...this.props.editor.recordsDic[this.props.instrument.id],
        isMute: !this.state.isMuted
      }
    };

    this.props.setRecordsDic(recordsDic);
    this.setState({ isMuted: !this.state.isMuted });
  }

  render() {
    const userFirstName = this.props.instrument.user_detailes.name.split(
      " "
    )[0];

    return (
      <div>
        <div>
          <div
            style={{
              height: "18px",
              background: "grey",
              color: "white",
              minWidth: "100px",
              fontSize: "12px"
            }}
          >
            <strong style={{ marginLeft: "8px" }}>{userFirstName}</strong>
          </div>
          <div
            style={{
              background: `${
                parseInt(this.state.currentInstrumentId) ===
                this.props.instrument.id
                  ? "#ebedf0"
                  : "#c9cfd6"
              }`,
              minWidth: "100px",
              height: "90px"
            }}
          >
            <div>
              <img
                src={this.props.instrument.user_detailes.avatar}
                alt=""
                className="rounded ml-2"
                style={{ width: "40px", height: "40px" }}
              />

              <i
                style={{ color: this.state.isMuted ? "grey" : "	#4169E1" }}
                className={`fas ${
                  this.state.isMuted ? "fa-volume-mute" : "fa-volume-up"
                } mt-4 ml-3`}
                onClick={this.muteControle}
              ></i>
            </div>
            <div style={{ width: "85px", marginLeft: "5px", marginTop: "5px" }}>
              <RangeSlider
                id={this.props.instrument.id}
                value={this.state.volume}
                onChange={this.onVolumeChange}
                min={0}
                max={10}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RecordControlItem.propTypes = {
  instrument: PropTypes.object.isRequired,
  setRecordsDic: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.audioEditor
});

export default connect(
  mapStateToProps,

  {
    setRecordsDic
  }
)(RecordControlItem);
