'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingSchema = new Schema({
  rating: {
    type: number,
    required: 'The value of the rating',
    min: 0,
    max: 10
  },
  whiskey_id: {
    type: Schema.ObjectId,
    required: 'Unique identifier of the whiskey the rating is for',
    ref: 'Whiskey'
  },
  created_by: {
    type: Schema.ObjectId,
    required: 'Unique identifier of the user submitting the rating',
    ref: 'User'
  },
  place_id: {
    type: String
  },
  tags: {
    type: [String]
  },
  method: {
    type: [{
      type: String,
      enum: ['malt', 'grain', 'blended', 'single pot', 'bourbon', 'tennessee', 'rye', 'corn']
    }]
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rating', RatingSchema);