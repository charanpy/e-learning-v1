const paginate = (req) => {
  const page = req.query?.page * 1 || 0;
  const limit = page === 0 ? 0 : 10;
  const currentPage = page - 1;
  const skip = currentPage >= 0 ? currentPage * limit : 0;


  return {
    limit,
    skip,
  };
};

module.exports = paginate;
