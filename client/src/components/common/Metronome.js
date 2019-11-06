import React, { Component } from "react";
import PropTypes from "prop-types";

import metronomBit from "../../audio/bit2.wav";

class Metronome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      play: false,
      bitsPerMin: null
    };
  }
  componentWillReceiveProps(nextProp) {
    if (nextProp.play && !this.state.play) {
      this.setState({ play: true });
      const waiteBeforePlay = this.props.waitingTime;
      console.log("waiteBeforePlay");
      console.log(waiteBeforePlay);
      setTimeout(() => {
        this.playMetronome();
      }, 100 + waiteBeforePlay);
    } else {
      if (!nextProp.play && this.state.play) {
        this.setState({ play: false });
      }
    }
    if (nextProp.bitsPerMin && nextProp.bitsPerMin !== this.state.bitsPerMin) {
      this.setState({ bitsPerMin: nextProp.bitsPerMin });
    }
  }

  playMetronome() {
    var id = setInterval(() => {
      if (!this.state.play) {
        clearInterval(id);
      } else {
        const bit = new Audio(metronomBit);
        bit.play();
      }
    }, (60 / this.props.bitsPerMin) * 1000);
  }

  render() {
    return <div>{""}</div>;
  }
}

Metronome.propTypes = {
  play: PropTypes.bool.isRequired,
  bitsPerMin: PropTypes.number.isRequired
};

export default Metronome;
