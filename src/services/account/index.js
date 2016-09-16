'use strict';

const service = require('feathers-sequelize');
const account = require('../../models/account');
const hooks = require('./hooks');
const _ = require('lodash');



module.exports = function(){
  const app = this;

  const options = {
    Model: account(app),
    paginate: {
      default: 5,
      max: 25
    }
  };

  const models = app.get('models');
  const Account = models['account'];

  // Initialize our service with any options it requires
  app.use('/api/accounts', service(options));

  // Get our initialize service to that we can bind hooks
  const accountService = app.service('/api/accounts');

  // Set up our before hooks
  accountService.before(hooks.before);

  // Set up our after hooks
  accountService.after(hooks.after);
};
