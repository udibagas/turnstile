"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static findByCode(code) {
      return this.findOne({ where: { code } });
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

  return User;
};