const Location = require('../models/location')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const { cloudinary } = require('../cloudinary/index')

const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
    const locations = await Location.find({});
    res.send(locations)
    res.render('locations/index', { locations })
}

module.exports.renderNewForm = (req, res) => {
    res.render('locations/new')
}

module.exports.createLocation = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location.location,
        limit: 2
    }).send()
    const location = new Location(req.body.location);
    location.geometry = geoData.body.features[0].geometry;
    location.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    location.author = req.user._id;
    await location.save();
    console.log(location)
    req.flash('success', 'Successfully made a new location')
    res.redirect(`/locations/${location._id}`)
}

module.exports.showLocation = async (req, res) => {
    const location = await Location.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!location) {
        req.flash('error', 'cannot find that location')
        return res.redirect('/locations')
    }
    res.render('locations/show', { location })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const location = await Location.findById(id)
    if (!location) {
        req.flash('error', 'cannot find that location')
        return res.redirect('/locations')
    }
    res.render('locations/edit', { location })
}

module.exports.updateLocation = async (req, res) => {
    const { id } = req.params;
    console.log(req.body.deleteImages)
    const location = await Location.findByIdAndUpdate(id, { ...req.body.location })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    location.images.push(...imgs)
    await location.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await location.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Successfully Updated this Location')
    res.redirect(`/locations/${location._id}`)
}

module.exports.deleteLocation = async (req, res) => {
    const { id } = req.params;
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
        req.flash('error', 'cannot find that location')
        return res.redirect('/locations')
    }
    req.flash('success', 'Location deleted')
    res.redirect('/locations')
}