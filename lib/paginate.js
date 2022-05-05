const paginate = (req) => {
  const page = req.query?.page * 1 || 1;
  const limit = req?.query?.limit * 1 || 10;
  const skip = (page - 1) * limit;

  return {
    limit,
    skip,
  };
};

module.exports = paginate;
