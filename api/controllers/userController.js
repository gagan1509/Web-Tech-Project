const Joi = require('joi');
const dbModel = require('../models/user');
const auth = require('./auth');

module.exports.createUser = (req, res) => {
    const validator = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        emailId: Joi.string().required(),
        mobileNumber: Joi.number().required(),
        password: Joi.string().required(),
        prevTours: Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            date: Joi.date().required()
        }),
        upcomingTours: Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            date: Joi.date().required()
        })
    }).unknown(false);

    const result = validator.validate(req.body);
    if(result.error) {
        console.log(result.error.details[0].message);
        res.send(result.error.details[0].message);
        return;
    }

    const newUser = new dbModel(req.body);
    auth.signup(req)
    .then(hashedPassword => {
        console.log(hashedPassword);
        newUser.password = hashedPassword;
        newUser.save({validateBeforeSave: false}, (err, note) => {
            if(err) {
                res.send(err);
                console.log(err);
                return;
            }
            res.json(note);
        })
    });    
}

module.exports.getAllUser = (req, res, user) => {
    dbModel.find({emailId: req.user}, (err, data) => {
        if(err) {
            res.send(err);
            return;
        }
        res.send(data);
    })
};

module.exports.updateUser = (req, res) => {
    const update = req.body;
    const options = {runValidators: true, new: true};
    dbModel.findOneAndUpdate({emailId: req.user}, update, options, (err, data) => {
        if(err) {
            res.send(err);
            return;
        }
        res.json(data);
    })
};

module.exports.deleteUser = (req, res) => {
    dbModel.deleteOne({emailId: req.user}, (err, data) => {
        if(err) {
            res.send(err);
            return;
        }
        res.json(data);
    })
}

module.exports.addTour = (req, res) => {
    const update = req.body;
    const options = {runValidators: true, new: true};
    dbModel.findOneAndUpdate({emailId: req.user}, { $push: {upcomingTours: update} }, options, (err, data) => {
        if(err) {
            res.send(err);
            return;
        }
        res.json(data);
    })
};