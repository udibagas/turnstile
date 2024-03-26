"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      ["Gate 1", "192.168.1.150", 5000],
      ["Gate 2", "192.168.1.151", 5000],
      ["Gate 3", "192.168.1.152", 5000],
      ["Gate 4", "192.168.1.153", 5000],
    ].map((el) => {
      const [name, host, port] = el;
      const created_at = new Date();
      const updated_at = new Date();
      return { name, host, port, created_at, updated_at };
    });

    await queryInterface.bulkInsert("gates", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("gates");
  },
};
