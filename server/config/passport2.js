const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
      // Match user
      console.log("looking for email: " + email);
      User.findOne({
        email: email
      }).catch(err => {
        console.log(err)
      }).then(user => {
        if (!user) {
            console.log("No user with that name found");
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            console.log("Checking for password: " + user.password);
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
              console.log("Incorrect password");
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.uuid);
  });

  passport.deserializeUser(function(uuid, done) {
    db.Accounts.findById(uuid).then(function(user) {
      if (user) {
          done(null, user.get());
      } else {
          done(user.errors, null);
      }
    });
  });
};