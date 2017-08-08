'use strict';

require('../models/distilleryModel');

var mongoose = require('mongoose'),
  results = require('./resultController'),
  Distilleries = mongoose.model('Distillery');

function validate_distillery(req, res) {
  var schema = require('../validation schemas/distilleryValidationSchema');
  req.checkBody(schema);
  const errors = req.validationErrors();
  
  return !results.checkAndSendError(res, errors);
}

exports.list_all_distilleries = function(req, res) {
  Distilleries.find({}, function(err, distillery) {
    if (results.checkAndSendError(res, err))
      return;

    results.sendSuccess(res, distillery);
  });
};

exports.create_a_distillery = function(req, res) {
  var new_distillery = new Distilleries(req.body);

  if (validate_distillery(req, res))
  {
    if (check_distillery_name(req, res, new_distillery.name, function(req, res)
    {
      new_distillery.save(function(err, distillery) {
        if (results.checkAndSendError(res, err))
          return;

        results.sendSuccess(res, distillery);
      });
    }));
  }
};

function check_distillery_name(req, res, name, successCallback)
{
  Distilleries.findOne({name: name}, function(err, user) {
    if (results.checkAndSendError(res, err))
      return;
    
    if (user != null)
    {
      results.sendRequestError(res, 'Distillery name already exists');
      return;
    }

    successCallback(req, res);
  });
}

exports.read_a_distillery = function(req, res) {
  Distilleries.findById(req.params._id, function(err, distillery) {
    if (results.checkAndSendError(res, err))
      return;

    if (distillery == null)
    {
      results.sendNotFound(res, "No distillery could be found with the given details");
      return;
    }

    results.sendSuccess(res, distillery);
  });
};

exports.update_a_distillery = function(req, res) {
  var edited_distillery = new Distilleries(req.body);

  if (validate_distillery(req, res))
  {
    if (check_distillery_name(req, res, edited_distillery.name, function(req, res)
    {
      Distilleries.findByIdAndUpdate(req.params._id, req.body, {new: true}, function(err, distillery) {
        if (results.checkAndSendError(res, err))
          return;

        results.sendSuccess(res, distillery);
      });
    }));
  }
};

exports.delete_a_distillery = function(req, res) {
  Distilleries.findById(req.params._id, function(err, distillery) {
    if (results.checkAndSendError(res, err))
      return;

    if (distillery == null)
    {
      results.sendRequestError(res, "Could not find distillery to delete");
      return;
    }

    distillery.remove(function (err, distilleryDeleted) {
      if (results.checkAndSendError(res, err))
        return;
      
      results.sendSuccessAfterCheckingError(res, err, 'Distillery successfully deleted');
    });  
  });
};

