// passport.js

const LocalStrategy = require("passport-local").Strategy;
const User = require('../model/User');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'identity', // Use 'identity' to handle both email and phone
    passwordField: 'password'
  },
  async function(identity, password, done) {
    try {
      // Check if the identity is a valid email address
      const isEmail = /^\S+@\S+\.\S+$/.test(identity);

      let user;
      if (isEmail) {
        user = await User.findOne({ email: identity });
      } else {
        // If not an email, assume it's a phone number
        user = await User.findOne({ phone: identity });
      }

      if (!user) {
        return done(null, false, { message: 'There is no active user with this email or phone number' });
      } 

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: 'Wrong password for email address or phone number' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false); 
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
