'use strict';

module.exports = function(app) {
  var whiskeyList = require('../controllers/whiskeyController'),
      ratingList = require('../controllers/ratingController');

  app.route('/whiskeys')
    .get(whiskeyList.list_all_whiskeys)
    .post(whiskeyList.create_a_whiskey);

  app.route('/whiskeys/:_id')
    .get(whiskeyList.read_a_whiskey)
    .put(whiskeyList.update_a_whiskey)
    .delete(whiskeyList.delete_a_whiskey);

  app.route('/whiskeys/:_id/ratings')
    .get(ratingList.list_all_ratings_for_whiskey);
};
