const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};
  data.text_contant = !isEmpty(data.text_contant) ? data.text_contant : "";
  data.link = !isEmpty(data.link) ? data.link : "";

  if (Validator.isEmpty(data.text_contant) && Validator.isEmpty(data.link)) {
    errors.text_contant_or_link =
      "You can't share an empty post, you have to share some contant";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
