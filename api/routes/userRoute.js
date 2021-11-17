const userController = require('../controllers/userController');
const auth = require('../controllers/auth');


module.exports = (app) => {
    app.route('/user').post(userController.createUser).get(auth.authToken, userController.getAllUser);
    app.route('/user').put(auth.authToken, userController.updateUser).delete(auth.authToken, userController.deleteUser);
    app.route('/user/login').post(auth.login);
    app.route('/user/manageBooking/add').put(auth.authToken, userController.addTour);
};