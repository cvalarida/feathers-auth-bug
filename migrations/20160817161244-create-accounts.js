'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // Make the accounts table if it doesn't already exist.
    // "If it doesn't already exist" because we have the previous migrations
    //  from the old Laravel web app.
    return queryInterface.showAllTables().then(function(tableNames) {
      if (tableNames.accounts === undefined) {
        queryInterface.createTable('accounts', {
          // Field definitions here
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: Sequelize.STRING,
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
    return queryInterface.dropTable('accounts');
  }
};
