const getRequiredFieldMessage = (field) => {
  return [true, `${field} should not be empty`];
};

module.exports = getRequiredFieldMessage;
