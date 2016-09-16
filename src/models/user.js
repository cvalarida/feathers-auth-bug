'use strict';

// user.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');
const crypto = require('bcryptjs');

module.exports = function(app) {
  // We assume we're being called from app.configure();
  // If we're not, though, we need to be passed the app instance
  if (app === undefined)
    app = this;
  const sequelize = app.get('sequelize');

  const passwordField = 'password';

  const user = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accountId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'accounts', // Table name...is that right? Made the migration work...
        key: 'id'
      }
    },
    email: Sequelize.STRING,
    last_logged_in: {
      type: Sequelize.DATE
      // allowNull: true
    },
    last_logged_in_from: {
      type: Sequelize.STRING
      // allowNull: true
    },
    password: Sequelize.STRING,
    api_token: {
      type: Sequelize.STRING
      // allowNull: true
    },
    permissions: {
      type: Sequelize.JSONB
      // allowNull: true
    },
    refresh_token: {
      type: Sequelize.STRING
    },
    deletedAt: Sequelize.DATE
  }, {
    // Are these necessary here, or just when defining the model to make a
    //  psuedo-migration?
    paranoid: true, // soft deletes
    timestamps: true,

    classMethods: {
      associate() {
        const models = app.get('models');
        // console.log('    relating user to account:', models['account']);
        this.belongsTo(models['account'], {});
      }
    },
    instanceMethods: {
      /**
       * Changes the password on the current user model.
       * Note: This does not save the model, so after this method is called,
       *  the model must be saved externally for it to stick.
       */
      changePassword(newPass) {
        let thisUser = this;

        // Copied blatantly from https://github.com/feathersjs/feathers-authentication/blob/master/src/hooks/hash-password.js
        //  and modified to work here.

        // This really isn't the best way to do it; I'd rather call something
        //  from the auth service, but...I couldn't figure out how to do so.

        return new Promise(function (resolve, reject) {
          const hash = function(item, password, salt) {
            crypto.hash(password, salt, function (error, hash) {
              if (error) {
                return reject(error);
              }
              item[passwordField] = hash;
              resolve(item);
            });
          };

          crypto.genSalt(10, function (error, salt) {
            // Perform the hashing on thisUser using the newPass and the salt
            //  we generate using genSalt()
            hash(thisUser, newPass, salt);
          });
        });
      },

      checkPassword(pass) {
        crypto.compare(pass, this.password, (err, result) => {
          return pass + " does " + (result ? '' : 'NOT ') + "match the current password";
        });
      }
    }
  });

  return user;
};
