"use strict";

const { v4: uuid } = require("uuid");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const tickets = [];

    for (let i = 0; i < 10; i++) {
      tickets.push({
        code: uuid(),
        batch_generate: "2024_04_15_104223",
        ticket_status: "ready",
        type: "admin",
        date_generate: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert("tickets", tickets);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tickets", { type: "admin" });
  },
};
