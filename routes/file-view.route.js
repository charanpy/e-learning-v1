const express = require('express');
const { getFileAccess } = require('../controllers/file-view');
const { checkToken, checkRole } = require('../services/auth');

const router = express.Router();

router.route('/:id').get(checkToken, checkRole('student'), getFileAccess);

module.exports = router;
