"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tickets = [
      "6c3740c5-e7f2-4369-a424-c2fbcd272e26",
      "13cf05e6-f08a-4c42-845e-caf8319a82a1",
      "5b92f808-3f6b-4ab3-8910-7aaf858d27c9",
      "34e2943b-b81a-43e8-b72c-73f88935d031",
      "f43121c9-10d1-419e-a429-8de7afbe5f49",
      "8918e964-12be-4c0a-a8ba-5e764b250037",
      "04f052da-58b1-45c6-86c1-b1da95c1ae1d",
      "1c12882c-6a4a-4bd1-9a69-f08e22c53d7a",
      "65a4567c-cdd9-4262-aeec-78ecef9177c3",
      "5c1defe0-ecb6-4766-bed7-6d8b5af81407",
      "f58a8084-68c6-4689-9dd7-8cab8f7d2815",
      "18b22927-5c0b-4f07-854c-fbb236fd458d",
      "4953afa5-3442-42c1-a076-722d12769fb7",
      "d35496c9-4066-4415-a7d8-4d9a79d6a393",
      "139e259c-f022-4c11-b02f-709e10433ef4",
      "e57a56b4-c656-4d22-93cf-b0c237d6836f",
      "90780fad-0170-4efa-9bbf-59284dd0eaf8",
      "b9dc45ab-6222-4116-bfa9-664812d36650",
      "21bb93b8-b571-4998-9647-2ad9ae1d496b",
      "0c95011d-2cfa-47f7-ba78-6bc76fccabd6",
    ].map((t) => {
      return {
        code: t,
        batch_generate: "1",
        ticket_status: "ready",
        date_generate: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    await queryInterface.bulkInsert("tickets", tickets);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tickets");
  },
};
