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
        order: [[sort.column || "code", sort.order || "asc"]],
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
          gate.socketClient.write(Buffer.from(`\xa6MT00001\xA9`));
        }
        throw new Error(`${gate.name} - INVALID TICKET: ${code}`);
      }

      if (ticket.ticket_status == "used") {
        if (gate.socketClient) {
          gate.socketClient.write(Buffer.from(`\xa6MT00002\xA9`));
        }
        throw new Error(`${gate.name} - TICKET HAS BEEN USED: ${code}`);
      }

      if (ticket.ticket_status == "refund") {
        if (gate.socketClient) {
          gate.socketClient.write(Buffer.from(`\xa6MT00001\xA9`));
        }
        throw new Error(`${gate.name} - TICKET HAS BEEN REFUND: ${code}`);
      }

      console.log(`${gate.name} - OK - ${code}`);

      // update status local on local database kalau bukan ticket admin
      if (ticket.type != "admin") {
        ticket.ticket_status = "used";
        ticket.updateToCloud();
      }

      // delay 3 seconds if admin
      if (ticket.type == "admin") {
        const now = new Date();
        if ((now - ticket.dataValues.date_used) / 1000 < 3) {
          return;
        }
      }

      ticket.date_used = new Date();
      ticket.gate_id = gate.id;
      ticket.scan_count += 1;
      await ticket.save();

      // open gate
      if (gate.socketClient) {
        gate.socketClient.write(Buffer.from(`\xa6MT00003\xA9`));
        gate.socketClient.write(Buffer.from(`\xA6TRIG1\xA9`));
      }
    }

    static fetch(page = 1) {
      console.log(`Fetching ticket page ${page}...`);
      fetch(`${process.env.API_URL}/ticket?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const { data: rows, current_page, next_page_url } = data;
          console.log(`Got ${rows.length} tickets`);
          rows.forEach((row, i) => {
            return Ticket.findOrCreate({
              where: { code: row.code },
              defaults: {
                batch_generate: row.batch_generate,
                ticket_status: row.ticket_status,
                date_generate: row.created_at,
                created_at: row.created_at,
                updated_at: row.updated_at,
              },
            })
              .then((ticket) => {
                console.log(`Page ${page} row ${i} - ${ticket[0].code}`);
              })
              .catch((err) => {
                console.log(err.message);
              });
          });

          if (next_page_url) {
            Ticket.fetch(current_page + 1);
          }
        })
        .catch((err) => {
          console.log(err.message);
          Ticket.fetch(page);
        });
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
      scan_count: DataTypes.INTEGER,
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
