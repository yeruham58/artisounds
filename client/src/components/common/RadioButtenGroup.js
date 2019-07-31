import React from "react";
import PropTypes from "prop-types";

const RadioButtenGroup = ({
  name,
  value,
  error,
  info,
  onChange,
  options,
  lable
}) => {
  const selectOptions = options.map((option, i) => (
    <div
      className="custom-control custom-radio custom-control-inline mb-3"
      key={i}
    >
      <input
        className="custom-control-input"
        type="radio"
        id={option.id}
        value={option.value}
        name={name}
        checked={option.value}
        onChange={onChange}
      />
      <label className="custom-control-label" htmlFor={option.id}>
        {option.name}
      </label>
    </div>
  ));
  return (
    <div className="mb-3">
      <p>
        <strong>{lable}</strong>
      </p>
      <div name={name} value={value}>
        {selectOptions}
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
      {info && <small className="form-text text-muted">{info}</small>}
    </div>
  );
};

RadioButtenGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  info: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

export default RadioButtenGroup;
