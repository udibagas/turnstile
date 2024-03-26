"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tickets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      batch_generate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ticket_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_generate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      date_used: {
        type: Sequelize.DATE,
      },
      date_refund: {
        type: Sequelize.DATE,
      },
      gate_id: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tickets");
  },
};
