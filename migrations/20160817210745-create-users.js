'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.showAllTables().then(function(tableNames) {
      if (tableNames.users === undefined) {
        queryInterface.createTable('users', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          accountId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'accounts',
              key: 'id'
            },
            allowNull: false
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false
          },
          last_logged_in: Sequelize.DATE,
          last_logged_in_from: Sequelize.STRING,
          password: Sequelize.STRING,
          api_token: Sequelize.STRING,
          permissions: Sequelize.JSONB,
          refresh_token: Sequelize.STRING,
          refresh_token_expiration: Sequelize.DATE,
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
          },
          deletedAt: Sequelize.DATE
        });
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
