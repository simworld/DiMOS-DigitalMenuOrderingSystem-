const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

// authenticate the user login using Passport library
exports.authLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      req.flash('error', 'Invalid username or password');
      return res.redirect('/auth/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // Redirect to different routes based on the user's role
      if (user.role === 'ADMIN') {
        return res.redirect('/admin/orders');
      } else {
        return res.redirect('/');
      }
    });
  })(req, res, next);
};

// validates the user inputs and register a new user in the database
exports.authRegister = async (req, res, next) => {
    try {
      //Validate the data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash('Error!', error.msg);
        });
        // Render the register page passing the three variables email, username, messages
        res.render('register', {
          email: req.body.email,
          username: req.body.username,
          messages: req.flash(),
        });
        return;
      }

      const { email, username} = req.body;

      // Check if the email or username exist already in the database
      const doesExist = await User.findOne({ email });
      const doesExist2 = await User.findOne({ username });

      if (doesExist) {
        req.flash('warning', 'Email already exists');
        res.redirect('/auth/register');
        return;
      }
      else if (doesExist2){
        req.flash('warning', 'Username already exists');
        res.redirect('/auth/register');
        return;
      }

      // If username or email do not exist, a new user is created and a flash message is displayed
      const user = new User(req.body);
      await user.save();
      req.flash(
        'success',
        `${user.email} registered succesfully! You can now login!`
      );

      // The user is redirected in the login page after the registration is completed
      res.redirect('/auth/login');
    } catch (error) {
      next(error);
    }
}


// log out the user
exports.logout =  async (req, res, next) => {
    req.logout(function(err) {
      if (err) {return next(err);}
    res.redirect('/');
    });
}