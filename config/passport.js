const LocalStrategy = require("passport-local").Strategy;
const User = require('../model/User');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'identity',
    passwordField: 'password'
  },
  async function(identity, password, done) {
    try {
      const user = await User.findOne({ $or: [{ email: identity }, { phone: identity }] });

      if (!user) {
        return done(null, false, { message: 'There is no active user with this email pr phone number' });
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
