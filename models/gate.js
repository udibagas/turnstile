"use strict";
const { Model } = require("sequelize");
const { Socket } = require("net");

module.exports = (sequelize, DataTypes) => {
  class Gate extends Model {
    socketClient;

    async reconnect() {
      try {
        await this.reload();

        if (this.socketClient instanceof Socket) {
          this.socketClient.removeAllListeners();
          this.socketClient.destroy();
        }

        setTimeout(() => {
          try {
            this.scan();
          } catch (error) {
            console.log(`${this.name} - ERROR - ${error.message}`);
          }
        }, 1000);
      } catch (error) {
        console.log(`${this.name} - ERROR - ${error.message}`);
      }
    }

    scan() {
      this.socketClient = new Socket();
      this.socketClient.setKeepAlive(true, 5000);
      const { name, host, port } = this;

      this.socketClient.connect(port, host, () => {
        console.log(`${name} - CONNECTED`);
      });

      this.socketClient.on("data", async (bufferData) => {
        const data = bufferData.toString().slice(1, -1);
        // console.log(`${name}: ${data}`);
        const prefix = data.slice(0, 2);
        if (!["PT", "QT"].includes(prefix)) return;
        const code = data.slice(2);
        try {
          await sequelize.models.Ticket.checkIn(code, this);
        } catch (error) {
          console.log(error.message);
        }
      });

      this.socketClient.on("error", (error) => {
        console.log(`${name} - ERROR - ${error.message}`);
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

  return Gate;
};
