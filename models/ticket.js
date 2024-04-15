"use strict";
const { Model, Op } = require("sequelize");
const fetch = require("cross-fetch");

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    updateToCloud() {
      fetch(
        `${process.env.API_URL}/ticket/masuk/${this.code}/${this.gate_id}`,
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
          this.updateToCloud();
        });
    }

    static async paginate(
      page = 1,
      pageSize = 15,
      filter,
      sort = { column: "code", order: "asc" }
    ) {
      const { search, ticket_status } = filter;

      const options = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where: {},
        order: [[sort.column, sort.order]],
      };

      if (search) {
        options.where.code = {
          [Op.like]: `%${search}%`,
        };
      }

      if (ticket_status) {
        options.where.ticket_status = ticket_status;
      }

      const data = await Ticket.findAndCountAll(options);
      data.totalPage = Math.ceil(data.count / pageSize);
      return data;
    }

    static findByCode(code) {
      return this.findOne({ where: { code } });
    }

    static async checkIn(code, gate) {
      const ticket = await this.findByCode(code);

      if (!ticket) {
        if (gate.socketClient) {
          gate.socketClient.write(Buffer.from(`\xa6MT00002\xA9`));
        }
        throw new Error(`INVALID TICKET: ${code}`);
      }

      if (ticket.ticket_status == "used") {
        if (gate.socketClient) {
          gate.socketClient.write(Buffer.from(`\xa6MT00003\xA9`));
        }
        throw new Error(`TICKET HAS BEEN USED: ${code}`);
      }

      if (ticket.ticket_status == "refund") {
        if (gate.socketClient) {
          gate.socketClient.write(Buffer.from(`\xa6MT00002\xA9`));
        }
        throw new Error(`TICKET HAS BEEN REFUND: ${code}`);
      }

      console.log(`${gate.name} - OK - ${code}`);

      // update status local on local database kalau bukan ticket admin
      if (ticket.type != "admin") {
        await ticket.update({
          ticket_status: "used",
          date_used: new Date(),
          gate_id: gate.id,
        });

        ticket.updateToCloud();
      }

      // open gate
      if (gate.socketClient) {
        gate.socketClient.write(Buffer.from(`\xa6MT00004\xA9`));
        gate.socketClient.write(Buffer.from(`\xA6TRIG1\xA9`));
      }
    }

    static async fetch() {
      console.log(`Fetching tickets...`);
      let lastBatch = null;

      const lastTicket = await this.findOne({
        order: [["batch_generate", "desc"]],
      });

      if (lastTicket) {
        lastBatch = lastTicket.batch_generate;
      }

      const res = await fetch(
        `${process.env.API_URL}/ticket?batch=${lastBatch}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

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
        } else {
          console.log(`No new ticket`);
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
      type: DataTypes.STRING,
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
