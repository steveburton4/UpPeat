'use strict';

require('../models/userModel');

var mongoose = require('mongoose'),
  Users = mongoose.model('User'),
  results = require('./resultController'),
  passport = require('../configuration/passport');

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
  Users.findOne({user_name: username}, function(err, user) {
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
    if (results.checkAndSendError(res, err))
      return;

    if (user == null)
    {
      results.sendNotFound(res, "No user could be found with the given details");
      return;
    }

    if (results.checkUserIsLoggedIn(req, res, user.user_name) == false)
      return;

    results.sendSuccess(res, user);
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
    Users.findOne(conditions, function(err, user) {
      if (results.checkAndSendError(res, err))
        return;

      if (user == null)
      {
        results.sendNotFound(res, "No user could be found with the given details");
        return;
      }

      if (results.checkUserIsLoggedIn(req, res, user.user_name) == false)
        return;

      Users.findByIdAndUpdate(user._id, req.body, {new: true}, function(err, user) {
        results.sendSuccessAfterCheckingError(res, err, user);
      });
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

  Users.findOne(conditions, function(err, user) {
    if (results.checkAndSendError(res, err))
      return;

    if (user == null)
    {
      results.sendRequestError(res, "Could not find user to delete");
      return;
    }
      
    if (results.checkUserIsLoggedIn(req, res, user.user_name) == false)
      return;

    Users.findByIdAndRemove(user._id, function(err) {
      req.logout();
      req.session.destroy();
      
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

module.exports.logout = function(req, res)
{        
  req.logout();
  req.session.destroy(function() {
    results.sendSuccess(res, 'User logged out');
  });
}

module.exports.login = function(req, res, next)
{
  passport.authenticate('local-login', function(err, user, info) {
    if(results.checkAndSendError(res, err))
      return;
      
    if (!user) {
      results.sendRequestError(res, info.message);
      return;
    }
    req.login(user, function(err){
      if(results.checkAndSendError(res, err))
        return;

      return results.sendSuccess(res, "User logged in successfully");
    });
  })(req, res, next);
}

module.exports.signup = function(req, res, next)
{
  passport.authenticate('local-signup', function(err, user, info) {
    if(results.checkAndSendError(res, err))
      return;

    if (!user) {
      results.sendRequestError(res, info.message);
      return;
    }
    req.login(user, function(err){
      if(results.checkAndSendError(res, err))
        return;

      return results.sendSuccess(res, user);
    });
  })(req, res, next);
}