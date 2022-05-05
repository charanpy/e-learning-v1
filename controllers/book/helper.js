const Author = require('../../models/Author.model');
const Category = require('../../models/Category.model');

const authorLookup = (authorName) => {
  const regex = new RegExp(authorName, 'i');

  const lookup = {
    from: Author.collection.name,
    localField: 'author',
    foreignField: '_id',
    as: 'author',
  };

  if (authorName)
    lookup['pipeline'] = [
      {
        $match: {
          $expr: {
            $regexMatch: { input: '$authorName', regex: regex },
          },
        },
      },
      {
        $project: {
          _id: 1,
          authorName: 1,
        },
      },
    ];
  return {
    $lookup: lookup,
  };
};

const categoryLookup = (categoryName) => {
  const regexValue = new RegExp(categoryName, 'i');

  const lookup = {
    from: Category.collection.name,
    localField: 'category',
    foreignField: '_id',
    as: 'category',
  };

  if (categoryName) {
    lookup['pipeline'] = [
      {
        $match: {
          categoryName: {
            $in: [regexValue],
          },
        },
      },
    ];
  }

  return {
    $lookup: lookup,
   
  };
};

module.exports = {
  categoryLookup,
  authorLookup,
};
