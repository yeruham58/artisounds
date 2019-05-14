const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
  let errors = {};
  data.comment_contant = !isEmpty(data.comment_contant)
    ? data.comment_contant
    : "";

  if (Validator.isEmpty(data.comment_contant)) {
    errors.comment_contant =
      "You can't share an empty comment, you have to share some contant";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
