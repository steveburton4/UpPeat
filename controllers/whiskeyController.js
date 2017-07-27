'use strict';

require('../models/whiskeyModel');

var mongoose = require('mongoose'),
  Whiskeys = mongoose.model('Whiskey');

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
  new_whiskey.save(function(err, whiskey) {
    if (err)
      res.send(err);
    res.json(whiskey);
  });
};

exports.read_a_whiskey = function(req, res) {
  Whiskeys.findById(req.params._id, function(err, whiskey) {
    if (err)
      res.send(err);
    res.json(whiskey);
  });
};

exports.update_a_whiskey = function(req, res) {
  Whiskeys.findOneAndUpdate({_id: req.params._id}, req.body, {new: true}, function(err, whiskey) {
    if (err)
      res.send(err);
    res.json(whiskey);
  });
};

exports.delete_a_whiskey = function(req, res) {
  Whiskeys.remove({
    _id: req.params._id
  }, function(err, whiskey) {
    if (err)
      res.send(err);
    res.json({ message: 'Whiskey successfully deleted' });
  });
};

