'use strict';

require('../models/ratingModel');

var mongoose = require('mongoose'),
  results = require('./resultController'),
  Users = mongoose.model('User'),
  Ratings = mongoose.model('Rating');

function validate_whiskey(req, res) {
  var schema = require('../validation schemas/ratingValidationSchema');
  req.checkBody(schema);
  const errors = req.validationErrors();
  
  return !results.checkAndSendError(res, errors);
}

exports.list_all_ratings = function(req, res) {
  list_all_ratings_for_option({}, res);
}

exports.list_all_ratings_for_whiskey = function(req, res) {
  list_all_ratings_for_option({whiskey_id : req.params._id}, res);
}

exports.list_all_ratings_for_user = function(req, res) {
  list_all_ratings_for_option({created_by : req.params._id}, res);
}

exports.list_all_ratings_for_location = function(req, res) {
  list_all_ratings_for_option({location_id : req.params._id}, res);
}

function list_all_ratings_for_option(options, res) {
  Ratings.find(options, function(err, rating) {
    if (err)
      res.send(err);
    res.json(rating);
  });
};

exports.create_a_rating = function(req, res) {
  var new_rating = new Ratings(req.body);

  if (validate_rating(req, res))
  {
    if (results.checkUserIsLoggedIn(req, res) == false)
      return;

    check_rating_timing(req, res, new_rating, function(req, res) {
      new_rating.created_by = req.user._id;
      new_rating.save(function(err, rating) {
        if (results.checkAndSendError(res, err))
          return;

        results.sendSuccess(res, rating);
      });
    });
  }
};

function check_rating_timing(req, res, rating, successCallback)
{
  Ratings.findOne({created_by : req.user._id}).sort({ctime: -1}).exec(function(err, latestRating) { 
    if (results.checkAndSendError(res, err))
      return;

    if (latestRating != null)
    {
      var currentDate = new Date();
      var oneMinuteLater = new Date(latestRating.ctime);
      oneMinuteLater.setMinutes(latestRating.ctime.getMinutes() + 1);

      if (ratings_match(rating, latestRating) && currentDate > latestRating.ctime && currentDate < oneMinuteLater)
      {
        results.sendRequestError(res, "Duplicate rating, wait one minute and try again");
        return;
      }
    }

    successCallback(req, res);
  });
}

function ratings_match(ratingOne, ratingTwo)
{
  return ratingOne.whiskey_id.equals(ratingTwo.whiskey_id)
         && ratingOne.created_by.equals(ratingTwo.created_by);
}

function validate_rating(req, res) {
  var schema = require('../validation schemas/ratingValidationSchema');
  req.checkBody(schema);
  const errors = req.validationErrors();
  
  return !results.checkAndSendError(res, errors);
}

exports.read_a_rating = function(req, res) {
  Ratings.findById(req.params._id, function(err, rating) {
    if (results.checkAndSendError(res, err))
      return;

    if (rating == null)
    {
      results.sendNotFound(res, "No rating could be found with the given details");
      return;
    }

    results.sendSuccess(res, rating);
  });
};

exports.update_a_rating = function(req, res) {
  Ratings.findById(req.params._id, function(err, rating) {
    if (results.checkAndSendError(res, err))
      return;

    if (rating == null)
    {
      results.sendRequestError(res, "Could not find rating to update");
      return;
    }

    check_user_rights(req, res, rating.created_by, function(req, res) {
      var edited_rating = new Ratings(req.body);

      if (validate_rating(req, res))
      {
        edited_rating.created_by = req.user._id;
        edited_rating._id = req.params._id;
        Ratings.findByIdAndUpdate(req.params._id, edited_rating, {new: true}, function(err, rating) {
          if (results.checkAndSendError(res, err))
            return;

          results.sendSuccess(res, rating);
        });
      };
    });
  });
};

exports.delete_a_rating = function(req, res) {
  Ratings.findById(req.params._id, function(err, rating) {
    if (results.checkAndSendError(res, err))
      return;

    if (rating == null)
    {
      results.sendRequestError(res, "Could not find rating to delete");
      return;
    }

    check_user_rights(req, res, rating.created_by, function(req, res) {
      rating.remove(function (err, ratingDeleted) {
        if (results.checkAndSendError(res, err))
          return;
        
        results.sendSuccessAfterCheckingError(res, err, 'Rating successfully deleted');
      });
    });
  });
};

function check_user_rights(req, res, user_id, successCallback)
{
  Users.findById(user_id, function(err, user) {
    if (results.checkAndSendError(res, err))
      return;

    if (user == null)
    {
      results.sendNotFound(res, "No user could be found with the given details");
      return;
    }

    if (results.checkUserIsLoggedIn(req, res, user.user_name) == false)
      return;

    successCallback(req, res);
  });
};

