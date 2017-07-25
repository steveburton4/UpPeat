'use strict';

module.exports = function(app) {
  var distilleryList = require('../controllers/distilleryController');

  app.route('/distilleries')
    .get(distilleryList.list_all_distilleries)
    .post(distilleryList.create_a_distillery);

  app.route('/distilleries/:_id')
    .get(distilleryList.read_a_distillery)
    .put(distilleryList.update_a_distillery)
    .delete(distilleryList.delete_a_distillery);
};
