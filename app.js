const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const errorController = require('./errors/error-controller');

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use('*', (_, res) => {
  return res.status(404).json({ message: 'Requested resource not found' });
});
app.use(errorController);

module.exports = app;
