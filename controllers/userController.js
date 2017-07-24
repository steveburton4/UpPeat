'use strict';

require('../models/userModel');

var mongoose = require('mongoose'),
  Users = mongoose.model('User');

exports.list_all_users = function(req, res) {
  Users.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.create_a_user = function(req, res) {
  var new_user = new Users(req.body);
  new_user.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.read_a_user = function(req, res) {
  read_a_user_base({_id: req.params._id}, req, res); 
};

exports.read_a_user_by_name = function(req, res) {
  read_a_user_base({user_name: req.params.user_name}, req, res); 
};

function read_a_user_base (conditions, req, res) {
  Users.findOne(conditions, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.update_a_user = function(req, res) {
  update_a_user_base({_id: req.params._id}, req, res); 
};

exports.update_a_user_by_name = function(req, res) {
  update_a_user_base({user_name: req.params.user_name}, req, res); 
};

function update_a_user_base (conditions, req, res) {
  Users.findOneAndUpdate(conditions, req.body, {new: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.delete_a_user = function(req, res) {
  delete_a_user_base({_id: req.params._id}, req, res); 
};

exports.delete_a_user_by_name = function(req, res) {
  delete_a_user_base({user_name: req.params.user_name}, req, res); 
};

function delete_a_user_base (conditions, req, res) {
  Users.findOne(conditions, function(err, user) {
    if (err)
      res.send(err);
    
    if (user == null)
      res.json({ message: 'User could not be found' });
    
    if (user.deleted)
      res.json({ message: 'User already deleted' });

    user.deleted = true;
    Users.findOneAndUpdate({_id: user._id}, req.body, {new: true}, function(err, user) {
      if (err)
        res.send(err);
      res.json({ message: 'User successfully deleted' });
    });
  });
};


exports.delete_a_user = function(req, res) {
  Users.findById(req.params.user_name, function(err, user) {
    if (err)
      res.send(err);
    
    if (user.deleted)
      res.json({ message: 'User already deleted' });

    user.deleted = true;
    Users.findOneAndUpdate({_id: req.params.user_name}, req.body, {new: true}, function(err, user) {
      if (err)
        res.send(err);
      res.json({ message: 'User successfully deleted' });
    });
  });
};

