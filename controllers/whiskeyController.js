'use strict';

require('../models/whiskeyModel');

var mongoose = require('mongoose'),
  results = require('./resultController'),
  Whiskeys = mongoose.model('Whiskey');

function validate_whiskey(req, res) {
  var schema = require('../validation schemas/whiskeyValidationSchema');
  req.checkBody(schema);
  const errors = req.validationErrors();
  
  return !results.checkAndSendError(res, errors);
}

exports.list_all_whiskeys = function(req, res) {
  Whiskeys.find({}, function(err, whiskey) {
    if (err)
      res.send(err);
    res.json(whiskey);
  });
};

exports.list_all_whiskeys_for_distillery = function(req, res) {
  Whiskeys.find({distillery_id : req.params.distilleryId}, function(err, whiskey) {
    if (err)
      res.send(err);
    res.json(whiskey);
  });
};

exports.create_a_whiskey = function(req, res) {
  var new_whiskey = new Whiskeys(req.body);

  if (validate_whiskey(req, res))
  {
    if (check_whiskey_name(req, res, new_whiskey.name, function(req, res)
    {
      new_whiskey.save(function(err, whiskey) {
        if (results.checkAndSendError(res, err))
          return;

        results.sendSuccess(res, whiskey);
      });
    }));
  }
};

function check_whiskey_name(req, res, name, successCallback)
{
  Whiskeys.findOne({name: name}, function(err, user) {
    if (results.checkAndSendError(res, err))
      return;
    
    if (user != null)
    {
      results.sendRequestError(res, 'Whiskey name already exists');
      return;
    }

    successCallback(req, res);
  });
}

exports.read_a_whiskey = function(req, res) {
  Whiskeys.findById(req.params._id, function(err, whiskey) {
    if (results.checkAndSendError(res, err))
      return;

    if (whiskey == null)
    {
      results.sendNotFound(res, "No whiskey could be found with the given details");
      return;
    }

    results.sendSuccess(res, whiskey);
  });
};

exports.update_a_whiskey = function(req, res) {
  var edited_whiskey = new Whiskeys(req.body);

  if (validate_whiskey(req, res))
  {
    if (check_whiskey_name(req, res, edited_whiskey.name, function(req, res)
    {
      Whiskeys.findByIdAndUpdate(req.params._id, req.body, {new: true}, function(err, whiskey) {
        if (results.checkAndSendError(res, err))
          return;

        results.sendSuccess(res, whiskey);
      });
    }));
  }
};

exports.delete_a_whiskey = function(req, res) {
  Whiskeys.findById(req.params._id, function(err, whiskey) {
    if (results.checkAndSendError(res, err))
      return;

    if (whiskey == null)
    {
      results.sendRequestError(res, "Could not find whiskey to delete");
      return;
    }

    whiskey.remove(function (err, whiskeyDeleted) {
      if (results.checkAndSendError(res, err))
        return;

      results.sendSuccessAfterCheckingError(res, err, 'Whiskey successfully deleted');
    });  
  });
};

