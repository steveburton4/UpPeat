'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DistillerySchema = new Schema({
  name: {
    type: String,
    required: 'Enter the name of the distillery',
    trim: 'true',
    unique: true
  },
  description: {
    type: String
  },
  location_id: {
    type: Schema.ObjectId,
    ref: 'Location'
  },
  links: {
    twitter: String,
    facebook: String,
    instagram: String,
    website: String,
    foursquare: String,
    yelp: String
  },
  tags: {
    type: [String]
  },
  meta: {
    likes: Number,
    ratings: Number,
    whiskeys: Number
  }
});

module.exports = mongoose.model('Distillery', DistillerySchema);