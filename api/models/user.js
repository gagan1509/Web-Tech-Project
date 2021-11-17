const Mongoose = require('mongoose');
const location = require('./location');

const schema = Mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    mobileNumber: {
        type: Number
    },
    password: {
        type: String
    },
    myBooking: [
        {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'location'
        }
    ]
});

module.exports = Mongoose.model('users', schema);