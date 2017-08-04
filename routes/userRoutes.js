'use strict';

module.exports = function(app) {
  var userList = require('../controllers/userController');

  app.route('/users')
    .get(userList.list_all_users)
    .post(userList.create_a_user);

  app.route('/users/username/:user_name')
    .get(userList.read_a_user_by_name)
    .put(userList.update_a_user_by_name)
    .delete(userList.delete_a_user_by_name);

  app.route('/users/:_id')
    .get(userList.read_a_user)
    .put(userList.update_a_user)
    .delete(userList.delete_a_user);

  app.route('/users/login')
    .post(userList.login);

  app.route('/users/logout')
    .post(userList.logout);

  app.route('/users/signup')
    .post(userList.signup);
};
