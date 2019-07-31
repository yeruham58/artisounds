import React from "react";

const RangeSlider = (value, onChange, info, error) => {
  return (
    <div className="slidecontainer">
      <input
        type="range"
        min="40"
        max="260"
        className="slider"
        id="myRange"
        onChange={e => {
          value.onChange(e);
        }}
      />
      <p>
        Tempo:
        <span id="demo" />
      </p>
      {value.error && <div className="invalid-feedback">{value.error}</div>}
      {value.info && (
        <small className="form-text text-muted mb-3">{value.info}</small>
      )}
    </div>
  );
};

export default RangeSlider;
