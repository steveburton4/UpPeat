'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RatingSchema = new Schema({
  rating: {
    type: Number,
    required: 'The value of the rating',
    min: 0,
    max: 10
  },
  comments: {
    type: String
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
  location_id: {
    type: Schema.ObjectId,
    ref: 'Location'
  },
  tags: {
    type: [String]
  },
  profile: {
    appearance: {
      colour: [String],
      clarity: [String],
      viscosity: [String],
    },
    nose: {
      colour: [String]
    },
    palate: {
      colour: [String]
    },
    finish: {
      type: [String]
    },
    base_notes: {
      type: [String]
    }
  }
});

module.exports = mongoose.model('Rating', RatingSchema);