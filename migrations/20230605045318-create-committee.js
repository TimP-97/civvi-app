'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('committees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chamber: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      systemCode: {
        type: Sequelize.STRING
      },
      committeeTypeCode: {
        type: Sequelize.STRING
      },
      bills: {
        type: Sequelize.STRING
      },
      billsCount: {
        type: Sequelize.INTEGER
      },
      history: {
        type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.STRING))
      },
      communications: {
        type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.STRING))
      },
      parent: {
        type: Sequelize.JSON
      },
      url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('committees');
  }
};