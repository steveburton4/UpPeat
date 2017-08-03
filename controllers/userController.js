'use strict';

require('../models/userModel');

var mongoose = require('mongoose'),
  Users = mongoose.model('User'),
  results = require('./resultController');

exports.list_all_users = function(req, res) {
  Users.find({}, function(err, user) {
    results.sendSuccessAfterCheckingError(res, err, user);
  });
};

exports.create_a_user = function(req, res) {
  var new_user = new Users(req.body);
  check_user_name(req, res, new_user.user_name, function(req, res) {
    if (validate_user(req, res))
    {
      new_user.save(function(err, user) {
        results.sendSuccessAfterCheckingError(res, err, user);
      });
    }
  });
};

function check_user_name(req, res, username, successCallback)
{
  Users.findOne({user_name: username, deleted: false}, function(err, user) {
    if (results.checkAndSendError(res, err))
      return;
    
    if (user != null)
    {
      results.sendRequestError(res, 'User already exists' );
      return;
    }

    successCallback(req, res);
  });
}

exports.read_a_user = function(req, res) {
  read_a_user_base({_id: req.params._id}, req, res); 
};

exports.read_a_user_by_name = function(req, res) {
  read_a_user_base({user_name: req.params.user_name}, req, res); 
};

function read_a_user_base (conditions, req, res) {
  Users.findOne(conditions, function(err, user) {
    results.sendSuccessAfterCheckingError(res, err, user);
  });
};

exports.update_a_user = function(req, res) {
  update_a_user_base({_id: req.params._id}, req, res); 
};

exports.update_a_user_by_name = function(req, res) {
  update_a_user_base({user_name: req.params.user_name}, req, res); 
};

function update_a_user_base (conditions, req, res) {
  if (validate_user(req, res))
  {
    Users.findOneAndUpdate(conditions, req.body, {new: true}, function(err, user) {
      results.sendSuccessAfterCheckingError(res, err, user);
    });
  }
};

exports.delete_a_user = function(req, res) {
  delete_a_user_base({_id: req.params._id}, req, res); 
};

exports.delete_a_user_by_name = function(req, res) {
  delete_a_user_base({user_name: req.params.user_name}, req, res); 
};

function delete_a_user_base (conditions, req, res) {
  Users.findOne(conditions, function(err, new_user) {
    if (results.checkAndSendError(res, err))
      return;
    
    if (new_user == null)
      results.sendRequestError(res, 'User could not be found' );
    
    if (new_user.deleted)
      results.sendRequestError(res, 'User already deleted' );

    new_user.deleted = true;
    Users.findOneAndUpdate({_id: new_user._id}, new_user, {new: true}, function(err, user) {
      results.sendSuccessAfterCheckingError(res, err, 'User successfully deleted');
    });
  });
};

function validate_user(req, res) {
  var schema = require('../validation schemas/userValidationSchema');
  req.checkBody(schema);
  const errors = req.validationErrors();
  
  return !results.checkAndSendError(res, errors);
}

module.exports.login = function(req, res)
{
  Users.getAuthenticated(req.params._id, req.params.password, function(err, user, reason) {
    if (results.checkAndSendError(res, err))
      return;

    if (user) {
        results.sendSuccess('Login successful');
        return;
    }

    var reasons = Users.failedLogin;
    switch (reason) {
        case reasons.NOT_FOUND:
        case reasons.PASSWORD_INCORRECT:
            results.sendRequestError('Login failed');
            break;
        case reasons.MAX_ATTEMPTS:
            results.sendRequestError('User account is locked out');
            break;
    }
  });
}