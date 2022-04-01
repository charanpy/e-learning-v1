const express = require('express');
const { createCourse } = require('../controllers/course');
const { upload } = require('../lib/multer');

const router = express.Router();

router.route('/').post(upload().single('image'), createCourse);

module.exports = router;
