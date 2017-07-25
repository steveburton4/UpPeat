'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DistillerySchema = new Schema({
  name: {
    type: String,
    Required: 'Enter the name of the distillery',
    trim: 'true'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Distillery', DistillerySchema);