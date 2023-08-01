const router = require('express').Router();
// const User = require('../models/user');
const services = require('../services/render')
const authController = require('../controller/auth');
// const { body, validationResult } = require('express-validator');
// const passport = require('passport');
const { ensureLoggedOut, ensureLoggedIn } = require('connect-ensure-login');
const { registerValidator } = require('../utils/validators');


/**
 * @description Render the login page
 * @method GET 
 * @route /login
 */
router.get ('/login',   ensureLoggedOut({ redirectTo: '/' }), services.login)

/**
 * @description Authenticate user credentials and perform login
 * @method POST 
 * @route /login
 */
router.post ('/login',   ensureLoggedOut({ redirectTo: '/' }), authController.authLogin)

/**
 * @description Render the registration page
 * @method GET 
 * @route /register
 */
router.get ('/register',   ensureLoggedOut({ redirectTo: '/' }), services.register)

/**
 * @description Validate user input and create a new account
 * @method POST 
 * @route /register
 */
router.post ('/register',   ensureLoggedOut({ redirectTo: '/' }), registerValidator, authController.authRegister)

/**
 * @description Logout the user
 * @method GET 
 * @route /logout
 */
router.get ('/logout',   ensureLoggedIn({ redirectTo: '/' }), authController.logout)


module.exports = router;

