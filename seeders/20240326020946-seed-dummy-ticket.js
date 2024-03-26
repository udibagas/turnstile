"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tickets = [
      {
        code: "12345",
        batch_generate: "1",
        ticket_status: "ready",
        date_generate: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("tickets", tickets);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tickets");
  },
};
