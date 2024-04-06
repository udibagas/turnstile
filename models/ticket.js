"use strict";
const { Model } = require("sequelize");
const fetch = require("cross-fetch");

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static findByCode(code) {
      return this.findOne({ where: { code } });
    }

    static async checkIn(code, gate) {
      try {
        const ticket = await this.findByCode(code);

        if (!ticket) {
          throw new Error(`INVALID TICKET: ${code}`);
        }

        if (ticket.ticket_status == "used") {
          throw new Error(`TICKET HAS BEEN USED: ${code}`);
        }

        if (ticket.ticket_status == "refund") {
          throw new Error(`TICKET HAS BEEN REFUND: ${code}`);
        }

        console.log(`${gate.name} - OK - ${code}`);

        // open gate
        if (gate.socketClient) {
          gate.socketClient.write(Buffer.from(`\xA6TRIG1\xA9`));
        }

        // update status local on local database
        await ticket.update({
          ticket_status: "used",
          date_used: new Date(),
          gate_id: gate.id,
        });

        // update status on cloud database
        fetch(
          `${process.env.API_URL}/ticket/masuk/${ticket.code}/${ticket.gate_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
          .then((_) => {
            console.log("SUCCESS update ticket to the cloud");
          })
          .catch((err) => {
            console.log(err.message);
          });
      } catch (error) {
        console.log(`${gate.name} - ERROR - ${error.message}`);
        return false;
      }

      return true;
    }
  }

  Ticket.init(
    {
      code: DataTypes.STRING,
      batch_generate: DataTypes.STRING,
      ticket_status: DataTypes.STRING,
      date_generate: DataTypes.DATE,
      date_used: DataTypes.DATE,
      date_refund: DataTypes.DATE,
      gate_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Ticket",
      tableName: "tickets",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Ticket;
};
