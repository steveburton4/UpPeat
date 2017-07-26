'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WhiskeySchema = new Schema({
  name: {
    type: String,
    required: 'Enter the name of the whiskey',
    trim: 'true'
  },
  abv: {
    type: Number,
    required: 'Average volume for the whiskey',
    min: 0,
    max: 100
  },
  distillery_id: {
    type: Schema.ObjectId,
    required: 'Unique identifier of the distillery the whiskey belongs to',
    ref: 'Distillery'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: [String]
  },
  type: {
    type: [{
      type: String,
      enum: ['malt', 'grain', 'blended', 'single pot', 'bourbon', 'tennessee', 'rye', 'corn']
    }],
    Required: 'Type of the whiskey'
  }
});

module.exports = mongoose.model('Whiskey', WhiskeySchema);