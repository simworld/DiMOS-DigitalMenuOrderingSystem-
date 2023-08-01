const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  // A new passport local strategy is created
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        // Username/email not exist in the database
        if (!user) {
          return done(null, false, {
            message: 'Username or Email Not Registered',
          });
        }
        // Email found and we check if the password is valid
        const isMatch = await user.isValidPassword(password);
        return isMatch
          ? done(null, user)
          : done(null, false, { message: 'Wrong Password' });
      } catch (error) {
        done(error);
      }
    }
  )
);

// To mantain a login session, Passport serializes and deserializes the user id to and from the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
