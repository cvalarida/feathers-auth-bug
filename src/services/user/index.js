'use strict';

const service = require('feathers-sequelize');
const user = require('../../models/user');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: user(app),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/users', service(options));

  // Get our initialize service so we can bind hooks
  const userService = app.service('/api/users');

  // Set up our before hooks
  userService.before(hooks.before);

  // Set up our after hooks
  userService.after(hooks.after);
};
