const express = require('express');
const reviews = require('../controllers/reviewController')
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')

const Review = require('../models/review')
const location = require('../models/location')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.makeReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;