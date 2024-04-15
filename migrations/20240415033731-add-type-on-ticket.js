"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tickets", "type", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "customer",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tickets", "type");
  },
};
