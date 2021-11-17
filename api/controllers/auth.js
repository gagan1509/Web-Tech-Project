require('dotenv').config();

const jwt = require('jsonwebtoken');
const dbModel = require('../models/user');
const bcrypt = require('bcrypt');
const { NextPlan } = require('@mui/icons-material');

const signup = async (req) => {
    const hashedPassword = (await bcrypt.hash(req.body.password, 10)).toString();
    // console.log(hashedPassword.Type);
    return hashedPassword;
};

const login = async (req, res) => {
    dbModel.findOne({ emailId: req.body.emailId }, async (err, data) => {
        if(err) {
            res.send(err);
            return;
        }
        // console.log(data);
        try {
            const result = await bcrypt.compare(req.body.password, data.password);
            if(result) {
                const accessToken = generateAccessToken(data.emailId);
                res.json({accessToken: accessToken});
                res.send(data);
            }
            else {
                res.status(404).send();
            }
        }
        catch {
            res.status(500).send();
        }
    })
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const authToken = authHeader && authHeader.split(' ')[1];
    if(authToken==null) res.sendStatus(401);

    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            // console.log(err);
            res.sendStatus(404);
            return;
        }
        req.user = user;
        next();
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.authToken = authenticateToken;