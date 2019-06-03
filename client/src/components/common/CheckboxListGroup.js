import React from "react";
import PropTypes from "prop-types";

const CheckboxListGroup = ({
  name,
  value,
  error,
  info,
  onChange,
  options,
  lable
}) => {
  const selectOptions = options.map((option, i) => (
    <div className="form-check form-check-inline" key={i}>
      <input
        className="form-check-input"
        type="checkbox"
        id={option.id}
        value={option.value}
        name={name}
        checked={option.checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={option.id}>
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

CheckboxListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  info: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

export default CheckboxListGroup;
