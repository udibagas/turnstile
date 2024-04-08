"use strict";
const { Model } = require("sequelize");
const fetch = require("cross-fetch");

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static findByCode(code) {
      return this.findOne({ where: { code } });
    }

    static async checkIn(code, gate) {
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

      // open gate
      if (gate.socketClient) {
        gate.socketClient.write(Buffer.from(`\xA6TRIG1\xA9`));
      }
    }

    static async fetch() {
      console.log(`Fetching tickets...`);
      const res = await fetch(`${process.env.API_URL}/ticket`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await res.json();
      console.log(`Got ${data.length} tickets`);

      const existingReadyTickets = await Ticket.findAll({
        where: { ticket_status: "ready" },
      });

      const mappedData = data.map((el) => {
        el.date_generate = new Date();
        delete el.id;
        delete el.deleted_at;
        return el;
      });

      if (existingReadyTickets.length == 0) {
        await Ticket.bulkCreate(mappedData);
      } else {
        const filteredData = mappedData.filter((el) => {
          return !existingReadyTickets.map((t) => t.code).includes(el.code);
        });

        if (filteredData.length > 0) {
          console.log(`Got ${filteredData.length} new tickets`);
          await Ticket.bulkCreate(filteredData);
        }
      }
    }
  }

  Ticket.init(
    {
      code: DataTypes.STRING,
      batch_generate: DataTypes.STRING,
      ticket_status: DataTypes.STRING,
      date_generate: {
        type: DataTypes.DATE,
        get() {
          const rawValue = this.getDataValue("date_generate");
          return rawValue?.toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          });
        },
      },
      date_used: {
        type: DataTypes.DATE,
        get() {
          const rawValue = this.getDataValue("date_used");
          return rawValue?.toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          });
        },
      },
      date_refund: {
        type: DataTypes.DATE,
        get() {
          const rawValue = this.getDataValue("date_refund");
          return rawValue?.toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          });
        },
      },
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
