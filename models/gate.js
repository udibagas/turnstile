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
        this.scan();
      }, 1000);
    }

    scan() {
      this.socketClient = new Socket();
      const { name, host, port } = this;

      this.socketClient.connect(5000, host, () => {
        console.log(`${name} (${host}:${port}) is connected`);
      });

      this.socketClient.on("data", async (bufferData) => {
        data = bufferData.toString().slice(1, -1);
        console.log(data);

        const prefix = data.slice(0, 2);

        if (!["PT", "QT"].includes(prefix)) {
          return;
        }

        const code = data.slice(2);

        try {
          const ticket = sequelize.models.Ticket.findByCode(code);

          if (!ticket) {
            return console.log(`${name}: Tiket ${code} tidak ditemukan`);
          }

          if (ticket.ticket_status == "used") {
            return console.log(`${name}: Tiket ${code} sudah digunakan`);
          }

          if (ticket.ticket_status == "refund") {
            return console.log(`${name}: Tiket ${code} sudah direfund`);
          }

          console.log(`${name}: Tiket ${code} valid. Turnstile dibuka`);
          client.write(Buffer.from(`\xA6OUT1ON\xA9`));
          await ticket.update({
            ticket_status: "used",
            date_used: new Date(),
            gate_id: this.id,
          });
        } catch (error) {
          console.error(error.message);
        }
      });

      this.socketClient.on("error", (error) => {
        console.error(error.message);
        this.reconnect();
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
          notNull: { msg: "Nama gate harus diisi" },
          notEmpty: { msg: "Nama gate harus diisi" },
        },
      },
      host: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Alamat IP harus diisi" },
          notEmpty: { msg: "Alamat IP harus diisi" },
          isIP: { msg: "Alamat IP tidak valid" },
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

  Gate.afterCreate((gate) => {
    gate.scan();
  });

  // kalau ada perubahan ip atau port scan ulang
  // Gate.afterUpdate((gate) => {
  //   gate.scan();
  // });

  // ga bisa seperti ini harusnya. karena beda instance
  // Gate.afterDestroy((gate) => {
  //   gate.socketClient.destroy();
  // });

  return Gate;
};
