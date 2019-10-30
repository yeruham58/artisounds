import React from "react";

const RangeSlider = (value, onChange, info, error) => {
  return (
    <div className="slidecontainer">
      <input
        disabled={value.disabled}
        value={value.value}
        type="range"
        min={value.min}
        max={value.max}
        className={
          !value.id || value.id === "masterVolumeRange" ? "slider" : null
        }
        id={value.id ? "myRange" + value.id : "myRange"}
        onChange={e => {
          value.onChange(e);
        }}
        style={
          value.id && value.id !== "masterVolumeRange"
            ? { width: "80px" }
            : null
        }
      />
      {!value.id && (
        <p>
          Tempo: {value.value}
          <span id="demo" />
        </p>
      )}
      {value.error && <div className="invalid-feedback">{value.error}</div>}
      {value.info && (
        <small className="form-text text-muted mb-3">{value.info}</small>
      )}
    </div>
  );
};

export default RangeSlider;
