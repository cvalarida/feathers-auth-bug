// I blatantly ripped this from both the following:
// https://github.com/feathersjs/generator-feathers/issues/94#issuecomment-204165134
// https://github.com/feathersjs/feathers-demos/blob/master/examples/migrations/sequelize/src/models/index.js

const Sequelize = require('sequelize');
const _ = require('lodash');

// Import the models
const account = require('./account');
const user = require('./user');

module.exports = function () {
  const app = this;

  // Note: 'postgres' is found in config/default.json as the db url
  const sequelize = new Sequelize(app.get('postgres'), {
    dialect: app.get('db_dialect'),
    // logging: console.log
    logging: false
  });
  app.set('sequelize', sequelize);

  // Configure the models
  app.configure(account);
  app.configure(user);

  app.set('models', sequelize.models);

  // Set associations
  // Copied this into src/relate-models.js
  // Object.keys(sequelize.models).forEach(modelName => {
  //   if ('associate' in sequelize.models[modelName]) {
  //     sequelize.models[modelName].associate();
  //   }
  // });

  sequelize.sync();
};
