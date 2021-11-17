const Express = require('express');
const Mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const locationsRoutes = require('./routes/location');
const reviewsRoutes = require('./routes/reviews');
// const bodyParser = require('body-parser');

const app = Express();

/**
 * Connect to database
 */
const connection = Mongoose.connect('mongodb://localhost:27017/WebTechProject');

/**
 * Middleware
 */
app.use(Express.json());
app.use(Express.urlencoded({
    extended: true
}));
  

// catch 400
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(400).send(`Error: ${res.originUrl} not found`);
    next();
});

// catch 500
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send(`Error: ${err}`);
    next();
});

/**
 * Register the routes
 */
userRoute(app);
app.use('/locations', locationsRoutes)
app.use('/locations/:id/reviews', reviewsRoutes)


app.set('view engine', 'ejs')

module.exports = app;