const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateProjectInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name.toString()) ? data.name.toString() : "";
  data.original_by = !isEmpty(data.original_by.toString())
    ? data.original_by.toString()
    : "";
  if (Validator.isEmpty(data.name.toString())) {
    errors.name = "Project name field is required";
  }
  if (Validator.isEmpty(data.original_by.toString()) && !data.original) {
    errors.original_by = "Original by field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
