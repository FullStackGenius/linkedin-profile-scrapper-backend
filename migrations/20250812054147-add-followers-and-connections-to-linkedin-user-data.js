'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.addColumn('linkedin_user_data', 'followers_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn('linkedin_user_data', 'connections_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('linkedin_user_data', 'followers_count');
    await queryInterface.removeColumn('linkedin_user_data', 'connections_count');
  }
};
