'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

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
    match: /^[a-zA-Z0-9_]*$/,
    index: { unique: true }
  },
  email: {
    type: String,
    required: 'The e-mail address for the user',
    trim: 'true',
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    set: toLower
  },
  password: {
    type: String,
    required: 'The un-salted password for the user',
    trim: 'true'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true 
  }
});

UserSchema
  .virtual('full_name')
  .get(function () {
    return this.first_name + ' ' + this.surname;
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

module.exports = mongoose.model('User', UserSchema);