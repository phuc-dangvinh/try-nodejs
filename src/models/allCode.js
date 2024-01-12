"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AllCode extends Model {
    static associate(models) {}
  }
  AllCode.init(
    {
      key: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      valueVi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AllCode",
    }
  );
  return AllCode;
};
