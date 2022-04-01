'use strict';

const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(
    {
      data: payload,
    },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generate: generateToken,
  verifyToken: verifyToken,
};
