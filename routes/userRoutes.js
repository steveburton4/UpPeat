'use strict';

module.exports = function(app) {
  var userList = require('../controllers/userController');

  app.route('/users')
    .get(userList.list_all_users)
    .post(userList.create_a_user);

  app.route('/users/:user_name')
    .get(userList.read_a_user)
    .put(userList.update_a_user)
    .delete(userList.delete_a_user);
};
