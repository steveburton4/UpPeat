'use strict';

require('../models/distilleryModel');

var mongoose = require('mongoose'),
  Distilleries = mongoose.model('Distillery');

exports.list_all_distilleries = function(req, res) {
  Distilleries.find({}, function(err, distillery) {
    if (err)
      res.send(err);
    res.json(distillery);
  });
};

exports.create_a_distillery = function(req, res) {
  var new_distillery = new Distilleries(req.body);
  new_distillery.save(function(err, distillery) {
    if (err)
      res.send(err);
    res.json(distillery);
  });
};

exports.read_a_distillery = function(req, res) {
  Distilleries.findById(req.params._id, function(err, distillery) {
    if (err)
      res.send(err);
    res.json(distillery);
  });
};

exports.update_a_distillery = function(req, res) {
  Distilleries.findOneAndUpdate({_id: req.params._id}, req.body, {new: true}, function(err, distillery) {
    if (err)
      res.send(err);
    res.json(distillery);
  });
};

exports.delete_a_distillery = function(req, res) {
  Distilleries.remove({
    _id: req.params._id
  }, function(err, distillery) {
    if (err)
      res.send(err);
    res.json({ message: 'Distillery successfully deleted' });
  });
};

