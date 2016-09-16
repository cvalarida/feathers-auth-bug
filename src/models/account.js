'use strict';

// account.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(app) {
  // We assume we're being called from app.configure();
  // If we're not, though, we need to be passed the app instance
  if (app === undefined)
    app = this;
  const sequelize = app.get('sequelize');

  const account = sequelize.define('account', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING,
  }, {
    paranoid: true,
    timestamps: true,

    classMethods: {
      associate() {
        const models = app.get('models');
        // console.log('    relating account to user:', models['user']);
        this.hasMany(models['user'], {});
      }
    }
  });

  return account;
};
