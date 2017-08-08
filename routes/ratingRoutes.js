'use strict';

module.exports = function(app) {
  var ratingList = require('../controllers/ratingController');

  app.route('/ratings')
    .get(ratingList.list_all_ratings)
    .post(ratingList.create_a_rating);

  app.route('/ratings/:_id')
    .get(ratingList.read_a_rating)
    .put(ratingList.update_a_rating)
    .delete(ratingList.delete_a_rating);
};
