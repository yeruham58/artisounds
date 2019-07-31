const projectBitValidation = bit => {
  const templateMessage =
    "Please config your project bit - like this template: '4/4'";
  const leftSideNumbers = [1, 2, 4, 8, 16, 32, 64];
  if (!bit.indexOf("/")) {
    return templateMessage;
  } else {
    const left = bit.split("/")[0];
    const right = bit.split("/")[1];
    const leftIsDigit = /^\d+$/.test(left);
    const rightIsDigit = /^\d+$/.test(right);
    if (!right || !left || !leftIsDigit || !rightIsDigit) {
      return templateMessage;
    } else {
      const leftInt = parseInt(left);
      const rightInt = parseInt(right);
      if (leftInt > 99) {
        return "Left side number can not be more then 99!";
      }
      if (leftSideNumbers.indexOf(rightInt) < 0) {
        return "Right number shoud be one of this numbers: 1, 2, 4, 8, 16, 32, 64";
      }
    }
  }
};

export { projectBitValidation };
