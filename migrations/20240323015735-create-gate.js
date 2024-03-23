"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Gates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      host: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
      port: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5000,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Gates");
  },
};
