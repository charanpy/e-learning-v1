const mongoose = require('mongoose');

const connectMongo = () => {
  return mongoose.connect(process.env.DB);
};

module.exports = connectMongo;
