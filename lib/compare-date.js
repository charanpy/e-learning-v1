const getDueAmount = (dueDate) => {
  const todayDate = new Date();
  const newDueDate = new Date(dueDate);
  if (todayDate < newDueDate) {
    return 0;
  }
  const diffTime = Math.abs(todayDate - dueDate);

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = getDueAmount;
