'use strict';

require('../models/locationModel');

var mongoose = require('mongoose'),
  results = require('./resultController'),
  Locations = mongoose.model('Location');

function validate_location(req, res) {
  var schema = require('../validation schemas/locationValidationSchema');
  req.checkBody(schema);
  const errors = req.validationErrors();
  
  return !results.checkAndSendError(res, errors);
}

exports.list_all_locations = function(req, res) {
  Locations.find({}, function(err, location) {
    if (results.checkAndSendError(res, err))
      return;

    results.sendSuccess(res, location);
  });
};

exports.create_a_location = function(req, res) {
  var new_location = new Locations(req.body);

  if (validate_location(req, res))
  {
    if (check_location_name(req, res, new_location.name, function(req, res)
    {
      new_location.save(function(err, location) {
        if (results.checkAndSendError(res, err))
          return;

        results.sendSuccess(res, location);
      });
    }));
  }
};

function check_location_name(req, res, name, successCallback)
{
  Locations.findOne({name: name}, function(err, user) {
    if (results.checkAndSendError(res, err))
      return;
    
    if (user != null)
    {
      results.sendRequestError(res, 'Location name already exists');
      return;
    }

    successCallback(req, res);
  });
}

exports.read_a_location = function(req, res) {
  Locations.findById(req.params._id, function(err, location) {
    if (results.checkAndSendError(res, err))
      return;

    if (location == null)
    {
      results.sendNotFound(res, "No location could be found with the given details");
      return;
    }

    results.sendSuccess(res, location);
  });
};

exports.update_a_location = function(req, res) {
  var edited_location = new Locations(req.body);

  if (validate_location(req, res))
  {
    if (check_location_name(req, res, edited_location.name, function(req, res)
    {
      Locations.findByIdAndUpdate(req.params._id, req.body, {new: true}, function(err, location) {
        if (results.checkAndSendError(res, err))
          return;

        results.sendSuccess(res, location);
      });
    }));
  }
};

exports.delete_a_location = function(req, res) {
  Locations.findById(req.params._id, function(err, location) {
    if (results.checkAndSendError(res, err))
      return;

    if (location == null)
    {
      results.sendRequestError(res, "Could not find location to delete");
      return;
    }

    location.remove(function (err, locationDeleted) {
      if (results.checkAndSendError(res, err))
        return;

      results.sendSuccessAfterCheckingError(res, err, 'Location successfully deleted');
    });  
  });
};

