"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DoctorClinicSpecialty extends Model {
    static associate(models) {}
  }
  DoctorClinicSpecialty.init(
    {
      doctorId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DoctorClinicSpecialty",
    }
  );
  return DoctorClinicSpecialty;
};
