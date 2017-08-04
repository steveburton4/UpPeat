'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000;

function toLower (v) {
  return v.toLowerCase();
}

var UserSchema = new Schema({
  first_name: {
    type: String,
    required: 'The first name of the user',
    trim: 'true'
  },
  surname: {
    type: String,
    required: 'The last name of the user',
    trim: 'true'
  },
  user_name: {
    type: String,
    required: 'The unique user name - characters, digits and underscores only',
    trim: 'true',
    set: toLower,
    minLength: 5,
    maxLength: 20,
    match: /^[a-zA-Z0-9_]*$/,
    unique: true
  },
  email: {
    type: String,
    required: 'The e-mail address for the user',
    trim: 'true',
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    set: toLower,
    index: { unique: true, sparse: true }
  },
  password: {
    type: String,
    required: 'The un-salted password for the user',
    minLength: 5,
    maxLength: 20,
    trim: 'true',
    match: /^(?=.*[a-zA-Z_])(?=.*[0-9_]+).*$/
  },
  loginAttempts: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  lockUntil: { 
    type: Number 
  }
}, {
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true 
  }
});

var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

UserSchema
  .virtual('full_name')
  .get(function () {
    return this.first_name + ' ' + this.surname;
});

UserSchema
  .virtual('isLocked')
  .get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) 
    return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, encrypted) {
        if (err) return next(err);

        user.password = encrypted;
        next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

UserSchema.methods.incLoginAttempts = function(cb) {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
      
    var updates = { $inc: { loginAttempts: 1 } };

    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

UserSchema.statics.getAuthenticated = function(user_name, password, cb) {
    this.findOne({ user_name: user_name }, function(err, user) {
        if (err) return cb(err);

        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        if (user.isLocked) {
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            if (isMatch) {
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);

                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

var plugins = require('./plugins/timestampPlugin');
UserSchema.plugin(plugins.timestamps);

module.exports = mongoose.model('User', UserSchema);