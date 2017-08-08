'use strict';

module.exports = function(app) {
  var locationList = require('../controllers/locationController'),
      ratingList = require('../controllers/ratingController');

  app.route('/locations')
    .get(locationList.list_all_locations)
    .post(locationList.create_a_location);

  app.route('/locations/:_id')
    .get(locationList.read_a_location)
    .put(locationList.update_a_location)
    .delete(locationList.delete_a_location);

  app.route('/locations/:_id/ratings')
    .get(ratingList.list_all_ratings_for_location);
};
