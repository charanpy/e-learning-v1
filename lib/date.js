const addDate = (issuedDate, noOfDays = 15) => {
  const today = new Date(issuedDate);
  const result = today.setDate(today.getDate() + noOfDays);

  return new Date(result);
};

module.exports = addDate;
