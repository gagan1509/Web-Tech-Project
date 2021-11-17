const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')
const Location = require('../models/location')
const locations = require('../controllers/locationController')
const { locationSchema } = require('../schemas.js')
const flash = require('connect-flash')
const { isLoggedIn, isAuthor, validatelocation } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(locations.index))
    .post(isLoggedIn, upload.array('image'), validatelocation, catchAsync(locations.createlocation))

router.get('/new', isLoggedIn, locations.renderNewForm)

router.route('/:id')
    .get(catchAsync(locations.showlocation))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatelocation, catchAsync(locations.updatelocation))
    .delete(isLoggedIn, isAuthor, catchAsync(locations.deletelocation))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(locations.renderEditForm))

module.exports = router;