'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('jobs', {
      build_num: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      build_time_millis: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      queued_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      start_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      stop_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      parallel: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      build_url: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('jobs');
  }
};
