"use strict";
const { compareSync, hashSync } = require("bcryptjs");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    verify(password) {
      return compareSync(password, this.password);
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  User.beforeSave((user) => {
    if (user.password) {
      user.password = hashSync(user.password);
    }
  });

  return User;
};
