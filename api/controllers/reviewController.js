const Review = require('../models/review')
const location = require('../models/location')

module.exports.makeReview = async (req, res) => {
    const location = await location.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id
    location.reviews.push(review);
    await review.save();
    await location.save();
    req.flash('success', 'created new review')

    res.redirect(`/locations/${location._id}`)
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await location.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review Deleted')
    res.redirect(`/locations/${id}`);
}