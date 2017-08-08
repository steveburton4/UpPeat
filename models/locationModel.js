'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  name: {
    type: String,
    required: 'Enter the name of the location',
    trim: 'true'
  },
  description: {
    type: String
  },
  place_id: {
    type: String
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
  distillery_ids: {
    type: [Schema.ObjectId],
    ref: 'Distillery'
  }
});

module.exports = mongoose.model('Location', LocationSchema);