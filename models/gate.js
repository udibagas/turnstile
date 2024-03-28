"use strict";
const { Model } = require("sequelize");
const { Socket } = require("net");

module.exports = (sequelize, DataTypes) => {
  class Gate extends Model {
    socketClient;

    reconnect() {
      if (this.socketClient instanceof Socket) {
        this.socketClient.removeAllListeners();
        this.socketClient.destroy();
      }

      setTimeout(() => {
        try {
          this.scan();
        } catch (error) {
          console.log(error.message);
        }
      }, 1000);
    }

    scan() {
      this.socketClient = new Socket();
      this.socketClient.setTimeout(1000);
      const { name, host, port } = this;

      this.socketClient.connect(port, host, () => {
        console.log(`${name}: CONNECTED`);
      });

      this.socketClient.on("data", async (bufferData) => {
        const data = bufferData.toString().slice(1, -1);
        console.log(`${name}: ${data}`);
        const prefix = data.slice(0, 2);
        if (!["PT", "QT"].includes(prefix)) return;
        const code = data.slice(2);

        try {
          const ticket = await sequelize.models.Ticket.findByCode(code);

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
          this.socketClient.write(Buffer.from(`\xA6TRIG1\xA9`));
          await ticket.update({
            ticket_status: "used",
            date_used: new Date(),
            gate_id: this.id,
          });
        } catch (error) {
          console.log(`${name}: ${error.message}`);
        }
      });

      this.socketClient.on("error", (error) => {
        console.log(`${name}: ${error.message}`);
        this.reconnect();
      });

      this.socketClient.on("timeout", () => {
        console.log(`${name}: TIMEOUT`);
        this.socketClient.end();
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
