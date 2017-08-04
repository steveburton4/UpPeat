var passport = require('passport'),
  Users = require('../models/userModel'),
  LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  Users.findById(_id, function(err, user) {
    if(err) {
      return done(err, user);
    }
    return done(null, user);
  })
});

passport.use('local-signup', new LocalStrategy({
      usernameField : 'user_name',
      passwordField : 'password',
      passReqToCallback : true
  },
  function(req, user_name, password, done) {
    process.nextTick(function() {
      Users.findOne({user_name: user_name}, function(err, user) {
        if(err) {
          return done(err);
          }
        if(user) {
          return done(null, false, {message: 'User name already exists'});
        }
        else {
            var new_User = new Users();
            new_User.user_name = user_name;
            new_User.first_name = req.body.first_name;
            new_User.surname = req.body.surname;
            new_User.email = req.body.email;
            new_User.password = password;
            new_User.save(function(err) {
              if(err) {
                  return done(err);
                }

              return done(null, new_User);
            });
          }
      });
    });
}));

passport.use('local-login', new LocalStrategy({
        usernameField : 'user_name',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, user_name, password, done) {
        Users.getAuthenticated(user_name, password, function(err, user, reason) {
            if (err) { return done(err); }        

            if (user) {
                req.session.login(user, function(err) {
                    if (err) { return done(err); }
                    });
                return done(null, user);
            }

            var reasons = Users.failedLogin;
            switch (reason) {
                case reasons.NOT_FOUND:
                case reasons.PASSWORD_INCORRECT:
                    return done(null, false, { message: 'Login failed' });
                    break;
                case reasons.MAX_ATTEMPTS:
                    return done(null, false, { message: 'User account is locked out' });
                    break;
            }
        });
    }
));

module.exports = passport;