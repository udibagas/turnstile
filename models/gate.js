"use strict";
const { Model } = require("sequelize");
const { Socket } = require("net");

module.exports = (sequelize, DataTypes) => {
  class Gate extends Model {
    socketClient;

    reconnect() {
      this.socketClient.removeAllListeners();
      this.socketClient.destroy();

      setTimeout(() => {
        this.scan(this.host);
      }, 1000);
    }

    scan() {
      this.socketClient = new Socket();
      const { name, host, port } = this;

      this.socketClient.connect(5000, host, () => {
        console.log(`${name} (${host}:${port}) is connected`);
      });

      this.socketClient.on("data", (bufferData) => {
        data = bufferData.toString().slice(1, -1);
        console.log(data);

        const prefix = data.slice(0, 2);

        if (!["PT", "QT"].includes(prefix)) {
          return console.log("Invalid input");
        }

        const number = data.slice(2);

        try {
          const ticket = sequelize.models.Ticket.findOne({ where: { number } });

          if (!ticket) {
            return console.log(`${name}: Tiket ${number} tidak ditemukan`);
          }

          if (ticket.status == false) {
            return console.log(`${name}: Tiket ${number} sudah tidak berlaku`);
          }

          console.log(`${name}: Tiket ${number} valid. Turnstile dibuka`);
          client.write(Buffer.from(`\xA6OUT1ON\xA9`));
          ticket.update({ status: false });
        } catch (error) {
          console.error(error.message);
        }
      });

      this.socketClient.on("error", (error) => {
        console.error(error.message);
        this.reconnect(client, host);
      });

      this.socketClient.on("close", () => {
        console.log(`${host} is disconnected`);
        this.reconnect();
      });
    }
  }

  Gate.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Nama harus diisi" },
          notEmpty: { msg: "Nama harus diisi" },
        },
      },
      host: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Host harus diisi" },
          notEmpty: { msg: "Host harus diisi" },
          isIP: { msg: "Invalid IP Address" },
        },
      },
      port: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Port harus diisi" },
          notEmpty: { msg: "Port harus diisi" },
          isInt: { msg: "Port harus berupa angka" },
        },
      },
    },
    {
      sequelize,
      modelName: "Gate",
    }
  );

  return Gate;
};
